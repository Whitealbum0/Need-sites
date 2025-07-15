from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import os
import urllib.parse
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Импорт OAuth2 системы авторизации
from oauth_auth import OAuth2Auth, get_current_user, get_current_active_user, get_admin_user, get_current_user_optional

load_dotenv()

app = FastAPI(title="E-commerce API with OAuth2", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# База данных
client = AsyncIOMotorClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
db = client[os.environ.get('DB_NAME', 'ecommerce_local')]

# OAuth2 конфигурация
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8001/api/auth/google/callback")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Модели данных
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# OAuth2 маршруты
@app.get("/api/auth/google")
async def google_auth():
    """Перенаправление на Google OAuth2"""
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={urllib.parse.quote(GOOGLE_REDIRECT_URI)}&"
        f"scope=openid email profile&"
        f"response_type=code&"
        f"access_type=offline"
    )
    return RedirectResponse(url=google_auth_url)

@app.get("/api/auth/google/callback")
async def google_callback(code: str, state: Optional[str] = None):
    """Обработка callback от Google OAuth2"""
    try:
        # Обмениваем код на токен
        token_data = await OAuth2Auth.exchange_code_for_token(code)
        access_token = token_data.get("access_token")
        
        # Получаем информацию о пользователе
        user_info = await OAuth2Auth.get_google_user_info(access_token)
        
        # Создаем или обновляем пользователя
        user = await OAuth2Auth.create_or_update_user(user_info)
        
        # Создаем JWT токен
        jwt_token = OAuth2Auth.create_access_token(data={"sub": user["email"]})
        
        # Перенаправляем на frontend с токеном
        frontend_url = f"{FRONTEND_URL}?token={jwt_token}"
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        error_url = f"{FRONTEND_URL}?error={str(e)}"
        return RedirectResponse(url=error_url)

@app.post("/api/auth/google/mobile")
async def google_mobile_auth(request: Request):
    """Авторизация через Google для мобильных приложений"""
    try:
        data = await request.json()
        access_token = data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="Токен не предоставлен")
        
        # Получаем информацию о пользователе
        user_info = await OAuth2Auth.get_google_user_info(access_token)
        
        # Создаем или обновляем пользователя
        user = await OAuth2Auth.create_or_update_user(user_info)
        
        # Создаем JWT токен
        jwt_token = OAuth2Auth.create_access_token(data={"sub": user["email"]})
        
        # Убираем служебные поля
        user_response = user.copy()
        user_response.pop("_id", None)
        user_response.pop("google_id", None)
        user_response["id"] = str(user.get("_id", ""))
        
        return {
            "access_token": jwt_token,
            "token_type": "bearer",
            "user": user_response
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_active_user)):
    """Получение информации о текущем пользователе"""
    return current_user

@app.post("/api/auth/logout")
async def logout():
    """Выход из системы"""
    return {"message": "Выход выполнен успешно"}

# Публичные маршруты
@app.get("/api/products")
async def get_products(
    request: Request,
    background_tasks: BackgroundTasks,
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = None,
    user: Optional[dict] = Depends(get_current_user_optional)
):
    """Получение списка товаров"""
    query = {"status": "active"}
    
    if category:
        query["category"] = category
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]
    
    if min_price is not None or max_price is not None:
        price_filter = {}
        if min_price is not None:
            price_filter["$gte"] = min_price
        if max_price is not None:
            price_filter["$lte"] = max_price
        query["price"] = price_filter
    
    products_cursor = db.products.find(query)
    
    if sort_by:
        if sort_by == "price_low":
            products_cursor = products_cursor.sort("price", 1)
        elif sort_by == "price_high":
            products_cursor = products_cursor.sort("price", -1)
        elif sort_by == "name":
            products_cursor = products_cursor.sort("name", 1)
        elif sort_by == "newest":
            products_cursor = products_cursor.sort("created_at", -1)
    
    products = await products_cursor.to_list(1000)
    
    # Конвертируем ObjectId в строку
    for product in products:
        product["_id"] = str(product["_id"])
    
    # Логируем посещение
    if user:
        background_tasks.add_task(log_visit, request, user, "products")
    
    return products

@app.get("/api/categories")
async def get_categories():
    """Получение списка категорий"""
    categories = await db.products.distinct("category")
    return {"categories": categories}

@app.get("/api/categories/stats")
async def get_category_stats():
    """Получение статистики по категориям"""
    pipeline = [
        {"$match": {"status": "active"}},
        {"$group": {
            "_id": "$category",
            "count": {"$sum": 1},
            "min_price": {"$min": "$price"},
            "max_price": {"$max": "$price"},
            "avg_price": {"$avg": "$price"}
        }},
        {"$sort": {"count": -1}}
    ]
    
    stats = await db.products.aggregate(pipeline).to_list(100)
    
    formatted_stats = {}
    for stat in stats:
        formatted_stats[stat["_id"]] = {
            "count": stat["count"],
            "min_price": round(stat["min_price"], 2),
            "max_price": round(stat["max_price"], 2),
            "avg_price": round(stat["avg_price"], 2)
        }
    
    return {"category_stats": formatted_stats}

# Защищенные маршруты
@app.get("/api/profile")
async def get_profile(current_user: dict = Depends(get_current_active_user)):
    """Получение профиля пользователя"""
    return current_user

@app.put("/api/profile")
async def update_profile(
    request: Request,
    current_user: dict = Depends(get_current_active_user)
):
    """Обновление профиля пользователя"""
    data = await request.json()
    
    # Обновляем только разрешенные поля
    allowed_fields = ["name"]
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    update_data["updated_at"] = datetime.now()
    
    await db.users.update_one(
        {"email": current_user["email"]},
        {"$set": update_data}
    )
    
    return {"message": "Профиль обновлен"}

# Административные маршруты
@app.get("/api/admin/users")
async def get_users(admin_user: dict = Depends(get_admin_user)):
    """Получение списка пользователей"""
    users = await db.users.find({}).to_list(1000)
    for user in users:
        user["_id"] = str(user["_id"])
        user.pop("google_id", None)  # Скрываем Google ID
    return users

@app.get("/api/admin/stats")
async def get_admin_stats(admin_user: dict = Depends(get_admin_user)):
    """Получение статистики для админа"""
    stats = {
        "total_users": await db.users.count_documents({}),
        "total_products": await db.products.count_documents({}),
        "total_visits": await db.visitor_logs.count_documents({}),
        "users_by_provider": await db.users.aggregate([
            {"$group": {
                "_id": "$provider", 
                "count": {"$sum": 1}
            }}
        ]).to_list(100)
    }
    
    return stats

# Функция для логирования посещений
async def log_visit(request: Request, user: dict, page: str):
    """Логирование посещения пользователя"""
    visit_data = {
        "user_id": str(user.get("_id")),
        "page": page,
        "ip_address": request.client.host,
        "user_agent": request.headers.get("user-agent", ""),
        "timestamp": datetime.utcnow()
    }
    await db.visitor_logs.insert_one(visit_data)

# Основной маршрут
@app.get("/")
async def root():
    return {
        "message": "E-commerce API с OAuth2 авторизацией",
        "version": "1.0.0",
        "auth_url": "/api/auth/google"
    }

@app.get("/health")
async def health_check():
    """Проверка здоровья приложения"""
    return {"status": "healthy", "timestamp": datetime.utcnow()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)