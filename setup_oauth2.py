#!/usr/bin/env python3
"""
Настройка OAuth2 авторизации для e-commerce приложения
"""
import pymongo
from pymongo import MongoClient
from datetime import datetime
import uuid
import os

def setup_oauth2_database():
    """Настраивает базу данных для OAuth2 авторизации"""
    
    # Настройки подключения
    mongo_url = "mongodb://localhost:27017"
    db_name = "ecommerce_local"
    
    print("🔐 Настройка OAuth2 авторизации")
    print("=" * 50)
    print(f"🔌 Подключение к: {mongo_url}")
    print(f"📊 База данных: {db_name}")
    
    try:
        # Подключение к MongoDB
        client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
        
        # Проверка подключения
        client.admin.command('ping')
        print("✅ Подключение к MongoDB успешно!")
        
        db = client[db_name]
        
        # Создание индексов для OAuth2
        print("\n🔧 Создание индексов для OAuth2...")
        
        # Индексы для users
        db.users.create_index([("email", 1)], unique=True)
        db.users.create_index([("google_id", 1)], unique=True, sparse=True)
        db.users.create_index([("provider", 1)])
        db.users.create_index([("role", 1)])
        db.users.create_index([("created_at", -1)])
        
        # Индексы для products
        db.products.create_index([("status", 1)])
        db.products.create_index([("category", 1)])
        db.products.create_index([("price", 1)])
        db.products.create_index([("created_at", -1)])
        db.products.create_index([("status", 1), ("category", 1)])
        
        # Текстовый индекс для поиска
        try:
            db.products.create_index([
                ("name", "text"),
                ("description", "text"),
                ("category", "text")
            ])
        except Exception as e:
            print(f"⚠️ Текстовый индекс уже существует: {e}")
        
        # Индексы для visitor_logs
        db.visitor_logs.create_index([("timestamp", -1)])
        db.visitor_logs.create_index([("user_id", 1)])
        db.visitor_logs.create_index([("page", 1)])
        
        print("✅ Индексы созданы успешно")
        
        # Добавление демо товаров
        print("\n📦 Добавление демо товаров...")
        
        # Очистка старых данных
        db.products.delete_many({})
        
        # Демо товары
        demo_products = [
            {
                "id": str(uuid.uuid4()),
                "name": "iPhone 15 Pro",
                "description": "Новейший iPhone с профессиональными возможностями камеры",
                "price": 129999.99,
                "category": "Электроника",
                "stock": 15,
                "images": [],
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "MacBook Pro 16",
                "description": "Мощный ноутбук для профессиональной работы",
                "price": 299999.99,
                "category": "Электроника",
                "stock": 8,
                "images": [],
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Nike Air Max 270",
                "description": "Стильные кроссовки для спорта и повседневной носки",
                "price": 12999.99,
                "category": "Спорт и фитнес",
                "stock": 25,
                "images": [],
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Dior Sauvage",
                "description": "Элегантный мужской парфюм",
                "price": 8999.99,
                "category": "Красота и здоровье",
                "stock": 30,
                "images": [],
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Dyson V15 Detect",
                "description": "Беспроводной пылесос с лазерной детекцией пыли",
                "price": 59999.99,
                "category": "Дом и быт",
                "stock": 12,
                "images": [],
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Gucci Dionysus",
                "description": "Дизайнерская сумка из натуральной кожи",
                "price": 189999.99,
                "category": "Мода и аксессуары",
                "stock": 5,
                "images": [],
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Samsung Galaxy S24 Ultra",
                "description": "Флагманский смартфон с S Pen",
                "price": 119999.99,
                "category": "Электроника",
                "stock": 20,
                "images": [],
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Adidas Ultraboost 22",
                "description": "Беговые кроссовки с технологией Boost",
                "price": 16999.99,
                "category": "Спорт и фитнес",
                "stock": 18,
                "images": [],
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Chanel No.5",
                "description": "Легендарный женский аромат",
                "price": 12999.99,
                "category": "Красота и здоровье",
                "stock": 22,
                "images": [],
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Nespresso Vertuo",
                "description": "Кофемашина с технологией Centrifusion",
                "price": 24999.99,
                "category": "Дом и быт",
                "stock": 10,
                "images": [],
                "status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        ]
        
        # Вставка товаров
        result = db.products.insert_many(demo_products)
        print(f"✅ Добавлено {len(result.inserted_ids)} товаров")
        
        # Создание тестового админа
        print("\n👨‍💻 Создание тестового администратора...")
        
        # Удаляем старых пользователей
        db.users.delete_many({})
        
        # Создаем тестового админа
        admin_user = {
            "email": "admin@example.com",
            "name": "Администратор",
            "role": "admin",
            "provider": "manual",
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        db.users.insert_one(admin_user)
        print("✅ Создан тестовый администратор: admin@example.com")
        
        # Проверка результата
        count = db.products.count_documents({})
        categories = db.products.distinct("category")
        users_count = db.users.count_documents({})
        
        print(f"\n📊 Итоговая статистика:")
        print(f"   📦 Товаров: {count}")
        print(f"   📂 Категорий: {len(categories)}")
        print(f"   👥 Пользователей: {users_count}")
        print(f"   🏷️  Категории: {', '.join(categories)}")
        
        client.close()
        
        # Создаем .env файл с инструкциями
        print("\n🔧 Создание .env файлов...")
        
        # Backend .env
        backend_env = """# OAuth2 Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8001/api/auth/google/callback

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-change-this-in-production

# Database Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=ecommerce_local

# Frontend URL
FRONTEND_URL=http://localhost:3000
"""
        
        with open("backend/.env", "w", encoding="utf-8") as f:
            f.write(backend_env)
        
        # Frontend .env
        frontend_env = """# Backend API URL
REACT_APP_BACKEND_URL=http://localhost:8001
"""
        
        with open("frontend/.env", "w", encoding="utf-8") as f:
            f.write(frontend_env)
        
        print("✅ .env файлы созданы")
        
        print("\n🎉 OAuth2 настройка завершена!")
        print("\n📋 Следующие шаги:")
        print("1. Настройте Google OAuth2 в Google Cloud Console")
        print("2. Получите GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET")
        print("3. Добавьте их в backend/.env")
        print("4. Запустите приложение: python server_oauth.py")
        
        return True
        
    except pymongo.errors.ServerSelectionTimeoutError:
        print("❌ Не удалось подключиться к MongoDB")
        print("💡 Убедитесь, что MongoDB запущен на localhost:27017")
        return False
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False

if __name__ == "__main__":
    success = setup_oauth2_database()
    
    if success:
        print("\n🚀 Готово к настройке Google OAuth2!")
        print("\n🔗 Инструкция по настройке Google OAuth2:")
        print("1. Перейдите в Google Cloud Console: https://console.cloud.google.com/")
        print("2. Создайте новый проект или выберите существующий")
        print("3. Включите Google+ API")
        print("4. Создайте OAuth2 Client ID")
        print("5. Добавьте Authorized redirect URI: http://localhost:8001/api/auth/google/callback")
        print("6. Скопируйте Client ID и Client Secret в backend/.env")
    else:
        print("\n❌ Настройка не удалась")
    
    input("\nНажмите Enter для выхода...")