@echo off
title OAuth2 Backend Server
echo 🔐 Запуск OAuth2 Backend сервера...
echo ========================================

cd /d "%~dp0"
cd backend

echo 📦 Установка зависимостей...
pip install -r requirements_oauth2.txt

echo 🔧 Проверка переменных окружения...
if not exist .env (
    echo # OAuth2 Configuration > .env
    echo GOOGLE_CLIENT_ID=your-google-client-id >> .env
    echo GOOGLE_CLIENT_SECRET=your-google-client-secret >> .env
    echo GOOGLE_REDIRECT_URI=http://localhost:8001/api/auth/google/callback >> .env
    echo. >> .env
    echo # JWT Configuration >> .env
    echo JWT_SECRET_KEY=your-super-secret-key-change-this-in-production >> .env
    echo. >> .env
    echo # Database Configuration >> .env
    echo MONGO_URL=mongodb://localhost:27017 >> .env
    echo DB_NAME=ecommerce_local >> .env
    echo. >> .env
    echo # Frontend URL >> .env
    echo FRONTEND_URL=http://localhost:3000 >> .env
    echo ✅ Создан файл .env
    echo.
    echo ⚠️  ВАЖНО: Настройте Google OAuth2 в .env файле!
    echo    1. Получите Client ID и Client Secret в Google Cloud Console
    echo    2. Добавьте их в .env файл
    echo    3. Перезапустите сервер
    echo.
)

echo 🔍 Проверка настроек OAuth2...
findstr /C:"GOOGLE_CLIENT_ID=your-google-client-id" .env >nul
if %errorlevel% == 0 (
    echo ⚠️  Google OAuth2 не настроен!
    echo    Откройте backend\.env и настройте:
    echo    - GOOGLE_CLIENT_ID
    echo    - GOOGLE_CLIENT_SECRET
    echo.
    echo 📋 Инструкция:
    echo    1. Перейдите в Google Cloud Console
    echo    2. Создайте OAuth2 Client ID
    echo    3. Добавьте redirect URI: http://localhost:8001/api/auth/google/callback
    echo    4. Скопируйте Client ID и Client Secret в .env
    echo.
)

echo 🌐 Запуск FastAPI сервера с OAuth2...
python server_oauth.py

pause