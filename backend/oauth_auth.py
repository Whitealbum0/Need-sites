from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import httpx
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# OAuth2 конфигурация
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8001/api/auth/google/callback")

# JWT конфигурация
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# HTTP Bearer для токенов
security = HTTPBearer(auto_error=False)

# База данных
client = AsyncIOMotorClient(os.environ.get('MONGO_URL', 'mongodb://localhost:27017'))
db = client[os.environ.get('DB_NAME', 'ecommerce_local')]

class OAuth2Auth:
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        """Создание JWT токена"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    async def get_user_by_email(email: str):
        """Получение пользователя по email"""
        user = await db.users.find_one({"email": email})
        return user
    
    @staticmethod
    async def get_user_by_google_id(google_id: str):
        """Получение пользователя по Google ID"""
        user = await db.users.find_one({"google_id": google_id})
        return user
    
    @staticmethod
    async def create_or_update_user(google_user_info: dict):
        """Создание или обновление пользователя из Google"""
        email = google_user_info.get("email")
        google_id = google_user_info.get("sub")
        name = google_user_info.get("name")
        picture = google_user_info.get("picture")
        
        # Проверяем, существует ли пользователь с таким Google ID
        existing_user = await OAuth2Auth.get_user_by_google_id(google_id)
        
        if existing_user:
            # Обновляем существующего пользователя
            update_data = {
                "name": name,
                "picture": picture,
                "last_login": datetime.now(timezone.utc)
            }
            await db.users.update_one(
                {"google_id": google_id},
                {"$set": update_data}
            )
            existing_user.update(update_data)
            return existing_user
        else:
            # Проверяем, есть ли пользователь с таким email
            existing_email_user = await OAuth2Auth.get_user_by_email(email)
            
            if existing_email_user:
                # Связываем существующий аккаунт с Google
                update_data = {
                    "google_id": google_id,
                    "picture": picture,
                    "last_login": datetime.now(timezone.utc)
                }
                await db.users.update_one(
                    {"email": email},
                    {"$set": update_data}
                )
                existing_email_user.update(update_data)
                return existing_email_user
            else:
                # Создаем нового пользователя
                new_user = {
                    "email": email,
                    "google_id": google_id,
                    "name": name,
                    "picture": picture,
                    "role": "user",
                    "provider": "google",
                    "created_at": datetime.now(timezone.utc),
                    "last_login": datetime.now(timezone.utc),
                    "is_active": True
                }
                
                result = await db.users.insert_one(new_user)
                new_user["_id"] = str(result.inserted_id)
                return new_user
    
    @staticmethod
    async def get_google_user_info(access_token: str):
        """Получение информации о пользователе из Google"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}"
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=400, detail="Не удалось получить информацию о пользователе")
    
    @staticmethod
    async def exchange_code_for_token(code: str):
        """Обмен authorization code на access token"""
        token_url = "https://oauth2.googleapis.com/token"
        
        data = {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": GOOGLE_REDIRECT_URI,
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(status_code=400, detail="Не удалось получить токен")
    
    @staticmethod
    async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
        """Получение текущего пользователя из JWT токена"""
        if not credentials:
            raise HTTPException(status_code=401, detail="Не авторизован")
            
        token = credentials.credentials
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise HTTPException(status_code=401, detail="Неверный токен")
        except JWTError:
            raise HTTPException(status_code=401, detail="Неверный токен")
        
        user = await OAuth2Auth.get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=401, detail="Пользователь не найден")
        
        user["_id"] = str(user["_id"])
        return user

# Вспомогательные функции
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    try:
        return await OAuth2Auth.get_current_user(credentials)
    except:
        return None

async def get_current_active_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await OAuth2Auth.get_current_user(credentials)
    if not user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Неактивный пользователь")
    return user

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await OAuth2Auth.get_current_user(credentials)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    return user

# Опциональная аутентификация
async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        return None
    try:
        return await OAuth2Auth.get_current_user(credentials)
    except:
        return None