#!/usr/bin/env python3
"""
Add more demo products to the database with beautiful images
"""

import asyncio
import base64
import httpx
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime

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

async def add_more_products():
    """Add more demo products to database"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Additional product data with beautiful images
    new_products = [
        {
            "id": "prod-7",
            "name": "Умные часы Apple Watch Series 9",
            "description": "Новейшие умные часы Apple с функциями здоровья, фитнес-трекингом и всегда активным дисплеем. Водонепроницаемые, с GPS и возможностью принимать звонки.",
            "price": 45999.99,
            "category": "Электроника",
            "stock": 15,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-8", 
            "name": "Кофемашина Nespresso Vertuo",
            "description": "Автоматическая кофемашина для приготовления эспрессо и кофе. Система одного касания, различные размеры чашек, современный дизайн для кухни.",
            "price": 12990.99,
            "category": "Дом и быт",
            "stock": 8,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-9",
            "name": "Дизайнерская сумка Louis Vuitton",
            "description": "Роскошная кожаная сумка из новой коллекции. Изготовлена вручную из премиальных материалов, идеальна для деловых встреч и особых случаев.",
            "price": 125000.99,
            "category": "Мода и аксессуары",
            "stock": 3,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-10",
            "name": "Профессиональная камера Canon EOS R5",
            "description": "Беззеркальная камера полного кадра с разрешением 45 МП, записью видео 8K и невероятной скоростью автофокуса. Для профессиональных фотографов.",
            "price": 189999.99,
            "category": "Электроника",
            "stock": 5,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-11",
            "name": "Органический набор для ухода за кожей",
            "description": "Полный набор натуральной косметики: очищающий гель, тоник, сыворотка и увлажняющий крем. Без парабенов, для всех типов кожи.",
            "price": 4590.99,
            "category": "Красота и здоровье",
            "stock": 25,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-12",
            "name": "Беспроводные наушники Sony WH-1000XM5",
            "description": "Флагманские наушники с лучшим в классе шумоподавлением, 30 часов работы, быстрая зарядка и превосходное качество звука.",
            "price": 29990.99,
            "category": "Электроника",
            "stock": 12,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1484704324500-b23545a60696?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-13",
            "name": "Мужские кроссовки Nike Air Jordan",
            "description": "Легендарные баскетбольные кроссовки в ретро стиле. Премиальная кожа, воздушная подошва и культовый дизайн для истинных ценителей.",
            "price": 15990.99,
            "category": "Спорт и фитнес",
            "stock": 20,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-14",
            "name": "Игровое кресло Herman Miller",
            "description": "Эргономичное игровое кресло премиум класса с поддержкой поясницы, регулируемыми подлокотниками и дышащим материалом.",
            "price": 67990.99,
            "category": "Дом и быт", 
            "stock": 7,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-15",
            "name": "Планшет iPad Pro 12.9 дюймов",
            "description": "Мощный планшет с чипом M2, Liquid Retina XDR дисплеем, поддержкой Apple Pencil и Magic Keyboard. Для творчества и работы.",
            "price": 99990.99,
            "category": "Электроника",
            "stock": 10,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-16",
            "name": "Женские солнцезащитные очки Ray-Ban",
            "description": "Классические солнцезащитные очки авиаторы с защитой UV400, поляризованными линзами и прочной титановой оправой.",
            "price": 8990.99,
            "category": "Мода и аксессуары",
            "stock": 18,
            "status": "active", 
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-17",
            "name": "Домашний тренажёр Peloton Bike",
            "description": "Велотренажёр премиум класса с интерактивными тренировками, HD экраном и возможностью подключения к онлайн классам.",
            "price": 159990.99,
            "category": "Спорт и фитнес",
            "stock": 4,
            "status": "active",
            "created_by": "admin", 
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "prod-18",
            "name": "Ароматическая свеча Diptyque",
            "description": "Роскошная ароматическая свеча ручной работы с изысканным парфюмерным составом. Время горения 60 часов, элегантная упаковка.",
            "price": 6790.99,
            "category": "Дом и быт",
            "stock": 15,
            "status": "active",
            "created_by": "admin",
            "image_url": "https://images.unsplash.com/photo-1602874801007-62a651cfc1fe?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85"
        }
    ]
    
    # Process each product
    for product in new_products:
        print(f"Processing product: {product['name']}")
        
        # Download and encode image
        image_base64 = await download_and_encode_image(product['image_url'])
        
        if image_base64:
            # Add timestamps
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
    
    print(f"\n🎉 Added {len(new_products)} additional products successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(add_more_products())