#!/usr/bin/env python3
"""
Скрипт для создания индексов в MongoDB для оптимизации производительности
"""
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv('backend/.env')

async def create_indexes():
    """Создает индексы для оптимизации запросов"""
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    
    print("🔧 Создание индексов для оптимизации...")
    
    # Индексы для коллекции products
    await db.products.create_index([("status", 1)])
    print("✅ Индекс по status создан")
    
    await db.products.create_index([("category", 1)])
    print("✅ Индекс по category создан")
    
    await db.products.create_index([("price", 1)])
    print("✅ Индекс по price создан")
    
    await db.products.create_index([("created_at", -1)])
    print("✅ Индекс по created_at создан")
    
    # Составные индексы для более сложных запросов
    await db.products.create_index([("status", 1), ("category", 1)])
    print("✅ Составной индекс по status и category создан")
    
    await db.products.create_index([("status", 1), ("price", 1)])
    print("✅ Составной индекс по status и price создан")
    
    await db.products.create_index([("category", 1), ("price", 1)])
    print("✅ Составной индекс по category и price создан")
    
    # Текстовый индекс для поиска
    await db.products.create_index([
        ("name", "text"),
        ("description", "text"),
        ("category", "text")
    ])
    print("✅ Текстовый индекс для поиска создан")
    
    # Индексы для коллекции users
    await db.users.create_index([("email", 1)], unique=True)
    print("✅ Уникальный индекс по email создан")
    
    await db.users.create_index([("role", 1)])
    print("✅ Индекс по role создан")
    
    # Индексы для коллекции visitor_logs
    await db.visitor_logs.create_index([("timestamp", -1)])
    print("✅ Индекс по timestamp создан")
    
    await db.visitor_logs.create_index([("user_id", 1)])
    print("✅ Индекс по user_id создан")
    
    await db.visitor_logs.create_index([("page", 1)])
    print("✅ Индекс по page создан")
    
    await db.visitor_logs.create_index([("ip_address", 1)])
    print("✅ Индекс по ip_address создан")
    
    print("\n🎉 Все индексы успешно созданы!")
    print("📊 Теперь запросы к базе данных будут выполняться быстрее")
    
    # Проверим созданные индексы
    print("\n📋 Список индексов для коллекции products:")
    indexes = await db.products.list_indexes().to_list(length=None)
    for idx in indexes:
        print(f"  - {idx['name']}: {idx['key']}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_indexes())