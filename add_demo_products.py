#!/usr/bin/env python3
"""
Add demo products to the database with base64 images
"""

import asyncio
import base64
import httpx
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from backend directory
ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

async def download_and_encode_image(url):
    """Download image from URL and encode to base64"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code == 200:
                image_data = response.content
                base64_image = base64.b64encode(image_data).decode('utf-8')
                return base64_image
            else:
                print(f"Failed to download image from {url}")
                return None
    except Exception as e:
        print(f"Error downloading image: {e}")
        return None

async def add_demo_products():
    """Add demo products to database"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Product data with image URLs
    products = [
        {
            "id": "demo-1",
            "name": "Набор косметики премиум класса",
            "description": "Роскошный набор косметических средств для ежедневного ухода. Включает крем для лица, сыворотку и лосьон.",
            "price": 5999.99,
            "category": "Красота и здоровье",
            "stock": 25,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxwcm9kdWN0c3xlbnwwfHx8fDE3NTI0MjM3MzZ8MA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "demo-2", 
            "name": "Набор электроники для работы",
            "description": "Современный набор для продуктивной работы: беспроводные наушники, ноутбук и смартфон последнего поколения.",
            "price": 89999.99,
            "category": "Электроника",
            "stock": 12,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1498049794561-7780e7231661?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljc3xlbnwwfHx8fDE3NTI0Mzk5NzZ8MA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "demo-3",
            "name": "Curology - Система ухода за кожей",
            "description": "Персонализированная система ухода за кожей с уникальным составом, разработанным дерматологами.",
            "price": 3499.99,
            "category": "Красота и здоровье",
            "stock": 35,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxwcm9kdWN0c3xlbnwwfHx8fDE3NTI0MjM3MzZ8MA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "demo-4",
            "name": "Минималистичный набор для ухода",
            "description": "Стильный набор средств для ежедневного ухода в минималистичном черно-белом дизайне.",
            "price": 2799.99,
            "category": "Красота и здоровье",
            "stock": 45,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxwcm9kdWN0c3xlbnwwfHx8fDE3NTI0MjM3MzZ8MA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "demo-5",
            "name": "Смартфон премиум класса",
            "description": "Флагманский смартфон с камерой 108MP, OLED дисплеем и аккумулятором 5000mAh.",
            "price": 79999.99,
            "category": "Электроника",
            "stock": 18,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1498049794561-7780e7231661?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljc3xlbnwwfHx8fDE3NTI0Mzk5NzZ8MA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "demo-6",
            "name": "Беспроводные наушники Pro",
            "description": "Премиальные беспроводные наушники с активным шумоподавлением и временем работы до 30 часов.",
            "price": 15999.99,
            "category": "Электроника",
            "stock": 22,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1498049794561-7780e7231661?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljc3xlbnwwfHx8fDE3NTI0Mzk5NzZ8MA&ixlib=rb-4.1.0&q=85"
        }
    ]
    
    # Process each product
    for product in products:
        print(f"Processing product: {product['name']}")
        
        # Download and encode image
        image_base64 = await download_and_encode_image(product['image_url'])
        
        if image_base64:
            # Add timestamps
            from datetime import datetime
            now = datetime.utcnow()
            
            # Create product document
            product_doc = {
                "id": product['id'],
                "name": product['name'],
                "description": product['description'],
                "price": product['price'],
                "category": product['category'],
                "stock": product['stock'],
                "status": product['status'],
                "created_by": product['created_by'],
                "images": [image_base64],  # Store as base64
                "created_at": now,
                "updated_at": now
            }
            
            # Insert or update product
            await db.products.replace_one(
                {"id": product['id']}, 
                product_doc, 
                upsert=True
            )
            print(f"✅ Added product: {product['name']}")
        else:
            print(f"❌ Failed to process product: {product['name']}")
    
    print("\n🎉 Demo products added successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(add_demo_products())