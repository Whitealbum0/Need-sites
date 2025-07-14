from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timedelta
import httpx
import json
from enum import Enum
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"

class ProductStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    role: UserRole = UserRole.USER
    session_token: Optional[str] = None
    session_expires: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    profile_picture: Optional[str] = None

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    images: List[str] = []  # Base64 encoded images
    category: str
    stock: int = 0
    status: ProductStatus = ProductStatus.ACTIVE
    created_by: str  # Admin user ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    images: List[str] = []
    category: str
    stock: int = 0

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    images: Optional[List[str]] = None
    category: Optional[str] = None
    stock: Optional[int] = None
    status: Optional[ProductStatus] = None

class VisitorTrack(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    visitor_id: str
    page: str
    user_agent: str
    ip_address: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    session_id: Optional[str] = None
    user_id: Optional[str] = None

class LoginRequest(BaseModel):
    redirect_url: str

class SessionData(BaseModel):
    session_id: str

# Authentication helper functions
async def get_current_user(authorization: str = Header(None)) -> Optional[User]:
    if not authorization:
        return None
    
    try:
        token = authorization.replace("Bearer ", "")
        user_data = await db.users.find_one({"session_token": token})
        
        if not user_data:
            return None
            
        user = User(**user_data)
        
        # Check if session is expired
        if user.session_expires and user.session_expires < datetime.utcnow():
            await db.users.update_one(
                {"id": user.id},
                {"$unset": {"session_token": "", "session_expires": ""}}
            )
            return None
            
        return user
    except Exception:
        return None

async def get_current_admin(authorization: str = Header(None)) -> User:
    user = await get_current_user(authorization)
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def track_visitor(request: Request, background_tasks: BackgroundTasks, page: str, user: Optional[User] = None):
    """Background task to track visitor"""
    visitor_id = str(uuid.uuid4())
    user_agent = request.headers.get("user-agent", "")
    
    # Get IP address
    ip_address = request.client.host if request.client else "unknown"
    if "x-forwarded-for" in request.headers:
        ip_address = request.headers["x-forwarded-for"].split(",")[0].strip()
    
    track_data = VisitorTrack(
        visitor_id=visitor_id,
        page=page,
        user_agent=user_agent,
        ip_address=ip_address,
        user_id=user.id if user else None
    )
    
    background_tasks.add_task(save_visitor_track, track_data)

async def save_visitor_track(track_data: VisitorTrack):
    """Save visitor tracking data to database"""
    try:
        await db.visitor_tracks.insert_one(track_data.dict())
    except Exception as e:
        logging.error(f"Error saving visitor track: {e}")

# Authentication endpoints
@api_router.get("/auth/login")
async def login_redirect():
    """Redirect to Emergent authentication"""
    auth_url = "https://auth.emergentagent.com/"
    preview_url = "https://8a063d6c-5752-4df9-85f9-6d669b46ccd2.preview.emergentagent.com/profile"
    return {"auth_url": f"{auth_url}?redirect={preview_url}"}

@api_router.post("/auth/session")
async def authenticate_session(session_data: SessionData):
    """Authenticate user session with Emergent auth"""
    try:
        # Call Emergent auth API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_data.session_id}
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session")
            
            auth_data = response.json()
            
            # Check if user exists
            existing_user = await db.users.find_one({"email": auth_data["email"]})
            
            if existing_user:
                # Update session token
                session_token = str(uuid.uuid4())
                session_expires = datetime.utcnow() + timedelta(days=7)
                
                await db.users.update_one(
                    {"email": auth_data["email"]},
                    {
                        "$set": {
                            "session_token": session_token,
                            "session_expires": session_expires,
                            "name": auth_data["name"],
                            "profile_picture": auth_data.get("picture")
                        }
                    }
                )
                
                user = User(**existing_user)
                user.session_token = session_token
                user.session_expires = session_expires
                user.name = auth_data["name"]
                user.profile_picture = auth_data.get("picture")
            else:
                # Create new user
                session_token = str(uuid.uuid4())
                session_expires = datetime.utcnow() + timedelta(days=7)
                
                user = User(
                    email=auth_data["email"],
                    name=auth_data["name"],
                    role=UserRole.ADMIN if auth_data["email"] == "admin@shop.com" else UserRole.USER,
                    session_token=session_token,
                    session_expires=session_expires,
                    profile_picture=auth_data.get("picture")
                )
                
                await db.users.insert_one(user.dict())
            
            return {
                "user": user.dict(),
                "session_token": session_token,
                "message": "Authentication successful"
            }
            
    except httpx.HTTPError:
        raise HTTPException(status_code=500, detail="Authentication service unavailable")
    except Exception as e:
        logging.error(f"Authentication error: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed")

@api_router.post("/auth/logout")
async def logout(user: User = Depends(get_current_user)):
    """Logout user"""
    if user:
        await db.users.update_one(
            {"id": user.id},
            {"$unset": {"session_token": "", "session_expires": ""}}
        )
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_current_user_info(user: User = Depends(get_current_user)):
    """Get current user information"""
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# Product endpoints
@api_router.get("/products")
async def get_products(
    request: Request,
    background_tasks: BackgroundTasks,
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = None,
    user: Optional[User] = Depends(get_current_user)
):
    """Get all active products with advanced filtering"""
    background_tasks.add_task(track_visitor, request, background_tasks, "products", user)
    
    query = {"status": ProductStatus.ACTIVE}
    
    if category:
        query["category"] = category
    
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]
    
    # Price filtering
    if min_price is not None or max_price is not None:
        price_filter = {}
        if min_price is not None:
            price_filter["$gte"] = min_price
        if max_price is not None:
            price_filter["$lte"] = max_price
        query["price"] = price_filter
    
    # Get products
    products_cursor = db.products.find(query)
    
    # Apply sorting
    if sort_by:
        if sort_by == "price_low":
            products_cursor = products_cursor.sort("price", 1)
        elif sort_by == "price_high":
            products_cursor = products_cursor.sort("price", -1)
        elif sort_by == "name":
            products_cursor = products_cursor.sort("name", 1)
        elif sort_by == "newest":
            products_cursor = products_cursor.sort("created_at", -1)
        elif sort_by == "oldest":
            products_cursor = products_cursor.sort("created_at", 1)
    
    products = await products_cursor.to_list(1000)
    return [Product(**product) for product in products]

@api_router.get("/products/{product_id}")
async def get_product(
    product_id: str,
    request: Request,
    background_tasks: BackgroundTasks,
    user: Optional[User] = Depends(get_current_user)
):
    """Get product by ID"""
    background_tasks.add_task(track_visitor, request, background_tasks, f"product/{product_id}", user)
    
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return Product(**product)

@api_router.post("/products", response_model=Product)
async def create_product(
    product_data: ProductCreate,
    admin: User = Depends(get_current_admin)
):
    """Create new product (admin only)"""
    product = Product(**product_data.dict(), created_by=admin.id)
    await db.products.insert_one(product.dict())
    return product

@api_router.put("/products/{product_id}")
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    admin: User = Depends(get_current_admin)
):
    """Update product (admin only)"""
    existing_product = await db.products.find_one({"id": product_id})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = {k: v for k, v in product_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.products.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    updated_product = await db.products.find_one({"id": product_id})
    return Product(**updated_product)

@api_router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    admin: User = Depends(get_current_admin)
):
    """Delete product (admin only)"""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}

# Categories endpoint
@api_router.get("/categories")
async def get_categories():
    """Get all product categories"""
    categories = await db.products.distinct("category")
    return {"categories": categories}

@api_router.get("/categories/stats")
async def get_category_stats():
    """Get category statistics"""
    pipeline = [
        {"$match": {"status": ProductStatus.ACTIVE}},
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
    
    # Format the response
    formatted_stats = {}
    for stat in stats:
        formatted_stats[stat["_id"]] = {
            "count": stat["count"],
            "min_price": round(stat["min_price"], 2),
            "max_price": round(stat["max_price"], 2),
            "avg_price": round(stat["avg_price"], 2)
        }
    
    return {"category_stats": formatted_stats}

# Admin analytics endpoints
@api_router.get("/admin/analytics")
async def get_analytics(admin: User = Depends(get_current_admin)):
    """Get visitor analytics (admin only)"""
    
    # Get visitor stats
    total_visitors = await db.visitor_tracks.count_documents({})
    unique_visitors = len(await db.visitor_tracks.distinct("visitor_id"))
    
    # Get page views
    page_views = await db.visitor_tracks.aggregate([
        {"$group": {"_id": "$page", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]).to_list(100)
    
    # Get users stats
    total_users = await db.users.count_documents({})
    admin_users = await db.users.count_documents({"role": UserRole.ADMIN})
    
    # Get products stats
    total_products = await db.products.count_documents({})
    active_products = await db.products.count_documents({"status": ProductStatus.ACTIVE})
    
    return {
        "visitors": {
            "total": total_visitors,
            "unique": unique_visitors
        },
        "page_views": page_views,
        "users": {
            "total": total_users,
            "admins": admin_users
        },
        "products": {
            "total": total_products,
            "active": active_products
        }
    }

@api_router.get("/admin/users")
async def get_all_users(admin: User = Depends(get_current_admin)):
    """Get all users (admin only)"""
    users = await db.users.find({}).to_list(1000)
    return [User(**user) for user in users]

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ecommerce-api"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()