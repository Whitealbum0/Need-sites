@echo off
title Настройка OAuth2 E-commerce приложения
echo 🔐 Настройка OAuth2 E-commerce приложения
echo =============================================

cd /d "%~dp0"

echo 📦 Шаг 1: Установка Python зависимостей...
pip install pymongo motor fastapi uvicorn python-dotenv python-multipart python-jose[cryptography] httpx

echo 🗄️ Шаг 2: Настройка базы данных OAuth2...
python setup_oauth2.py

echo 🔧 Шаг 3: Проверка структуры проекта...
if not exist backend\oauth_auth.py (
    echo ❌ Файл oauth_auth.py не найден!
    pause
    exit /b 1
)

if not exist backend\server_oauth.py (
    echo ❌ Файл server_oauth.py не найден!
    pause
    exit /b 1
)

if not exist frontend\src\contexts\OAuth2AuthContext.js (
    echo ❌ Файл OAuth2AuthContext.js не найден!
    pause
    exit /b 1
)

echo ✅ Все необходимые файлы OAuth2 найдены!
echo.

echo 🎉 Настройка OAuth2 завершена!
echo.
echo 📋 Следующие шаги:
echo    1. Настройте Google OAuth2 в Google Cloud Console
echo    2. Получите Client ID и Client Secret
echo    3. Добавьте их в backend\.env
echo    4. Запустите start_oauth2_backend.bat
echo    5. Запустите start_oauth2_frontend.bat (в новом окне)
echo.
echo 🌐 Приложение будет доступно по адресу: http://localhost:3000
echo 🔐 Авторизация через Google OAuth2
echo.
echo 📖 Полная инструкция: OAuth2_SETUP_GUIDE.md
echo.

pause