@echo off
title OAuth2 Frontend Server
echo 🔐 Запуск OAuth2 Frontend сервера...
echo ========================================

cd /d "%~dp0"
cd frontend

echo 📦 Установка зависимостей...
if exist yarn.lock (
    yarn install
) else (
    npm install
)

echo 🔧 Проверка переменных окружения...
if not exist .env (
    echo REACT_APP_BACKEND_URL=http://localhost:8001 > .env
    echo ✅ Создан файл .env
)

echo 🔄 Обновление App.js для OAuth2...
if exist src\App_OAuth2.js (
    copy src\App_OAuth2.js src\App.js
    echo ✅ App.js обновлен для OAuth2
) else (
    echo ⚠️  App_OAuth2.js не найден, используется стандартный App.js
)

echo 🌐 Запуск React сервера...
if exist yarn.lock (
    yarn start
) else (
    npm start
)

pause