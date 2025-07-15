#!/usr/bin/env python3
"""
Тестирование OAuth2 системы
"""
import asyncio
import httpx
import sys
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv('backend/.env')

async def test_oauth2_system():
    """Тестирует OAuth2 систему"""
    print("🧪 Тестирование OAuth2 системы")
    print("=" * 50)
    
    # Тестируем подключение к MongoDB
    print("\n1. 🗄️ Тестирование MongoDB...")
    try:
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        client = AsyncIOMotorClient(mongo_url)
        await client.admin.command('ping')
        print("✅ MongoDB подключение успешно")
        
        db = client[os.environ.get('DB_NAME', 'ecommerce_local')]
        products_count = await db.products.count_documents({})
        users_count = await db.users.count_documents({})
        print(f"   📦 Товаров в базе: {products_count}")
        print(f"   👥 Пользователей в базе: {users_count}")
        
        client.close()
    except Exception as e:
        print(f"❌ Ошибка MongoDB: {e}")
        return False
    
    # Тестируем FastAPI сервер
    print("\n2. 🌐 Тестирование FastAPI сервера...")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Тест основного endpoint
            response = await client.get("http://localhost:8001/")
            if response.status_code == 200:
                print("✅ Основной endpoint работает")
                data = response.json()
                print(f"   📄 Сообщение: {data.get('message', 'N/A')}")
            else:
                print(f"❌ Основной endpoint не работает: {response.status_code}")
                return False
            
            # Тест health check
            response = await client.get("http://localhost:8001/health")
            if response.status_code == 200:
                print("✅ Health check работает")
            else:
                print(f"⚠️ Health check не работает: {response.status_code}")
            
            # Тест товаров
            response = await client.get("http://localhost:8001/api/products")
            if response.status_code == 200:
                products = response.json()
                print(f"✅ API товаров работает ({len(products)} товаров)")
            else:
                print(f"❌ API товаров не работает: {response.status_code}")
                return False
            
            # Тест категорий
            response = await client.get("http://localhost:8001/api/categories")
            if response.status_code == 200:
                categories = response.json()
                print(f"✅ API категорий работает ({len(categories.get('categories', []))} категорий)")
            else:
                print(f"❌ API категорий не работает: {response.status_code}")
                return False
            
            # Тест OAuth2 redirect (должен вернуть 307)
            response = await client.get("http://localhost:8001/api/auth/google", follow_redirects=False)
            if response.status_code in [307, 302]:
                print("✅ OAuth2 redirect работает")
                print(f"   🔗 Перенаправление на: {response.headers.get('location', 'N/A')}")
            else:
                print(f"⚠️ OAuth2 redirect: {response.status_code}")
            
    except httpx.ConnectError:
        print("❌ Не удалось подключиться к серверу")
        print("💡 Убедитесь, что сервер запущен: python server_oauth.py")
        return False
    except Exception as e:
        print(f"❌ Ошибка при тестировании сервера: {e}")
        return False
    
    # Проверяем переменные окружения
    print("\n3. 🔧 Проверка переменных окружения...")
    
    google_client_id = os.environ.get('GOOGLE_CLIENT_ID')
    google_client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')
    jwt_secret = os.environ.get('JWT_SECRET_KEY')
    
    if not google_client_id or google_client_id == 'your-google-client-id':
        print("⚠️ GOOGLE_CLIENT_ID не настроен")
        print("   Настройте Google OAuth2 в backend/.env")
    else:
        print("✅ GOOGLE_CLIENT_ID настроен")
    
    if not google_client_secret or google_client_secret == 'your-google-client-secret':
        print("⚠️ GOOGLE_CLIENT_SECRET не настроен")
        print("   Настройте Google OAuth2 в backend/.env")
    else:
        print("✅ GOOGLE_CLIENT_SECRET настроен")
    
    if not jwt_secret or jwt_secret == 'your-super-secret-key-change-this-in-production':
        print("⚠️ JWT_SECRET_KEY использует значение по умолчанию")
        print("   Рекомендуется изменить на уникальный ключ")
    else:
        print("✅ JWT_SECRET_KEY настроен")
    
    # Проверяем файлы
    print("\n4. 📁 Проверка файлов...")
    
    required_files = [
        'backend/oauth_auth.py',
        'backend/server_oauth.py',
        'backend/requirements_oauth2.txt',
        'frontend/src/contexts/OAuth2AuthContext.js',
        'frontend/src/components/Auth/GoogleLoginButton.js',
        'frontend/src/components/Desktop/DesktopNavbarOAuth2.js',
        'frontend/src/components/Mobile/MobileNavbarOAuth2.js',
        'frontend/src/App_OAuth2.js'
    ]
    
    missing_files = []
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - файл не найден")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n❌ Отсутствуют файлы: {len(missing_files)}")
        return False
    
    print("\n🎉 Все тесты пройдены!")
    print("\n📋 Следующие шаги:")
    print("1. Настройте Google OAuth2 в backend/.env (если еще не сделано)")
    print("2. Запустите backend: python server_oauth.py")
    print("3. Запустите frontend: npm start (с App_OAuth2.js)")
    print("4. Перейдите на http://localhost:3000")
    print("5. Нажмите 'Войти через Google'")
    
    return True

if __name__ == "__main__":
    try:
        success = asyncio.run(test_oauth2_system())
        if success:
            print("\n✅ OAuth2 система готова к использованию!")
        else:
            print("\n❌ OAuth2 система требует настройки")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n⏹️ Тестирование прервано пользователем")
    except Exception as e:
        print(f"\n❌ Критическая ошибка: {e}")
        sys.exit(1)
    
    input("\nНажмите Enter для выхода...")