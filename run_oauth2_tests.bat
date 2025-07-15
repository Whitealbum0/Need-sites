@echo off
title OAuth2 System Tests
echo 🧪 Тестирование OAuth2 системы...
echo ====================================

cd /d "%~dp0"

echo 📋 Проверка системных требований...
echo.

REM Проверка Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python не найден!
    echo 💡 Установите Python 3.8+ с https://python.org
    pause
    exit /b 1
)
echo ✅ Python найден

REM Проверка Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js не найден!
    echo 💡 Установите Node.js 16+ с https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js найден

REM Проверка MongoDB
mongo --eval "db.adminCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ MongoDB не запущен или не установлен
    echo 💡 Запустите MongoDB или установите с https://mongodb.com
    echo.
) else (
    echo ✅ MongoDB доступен
)

echo.
echo 🔧 Проверка структуры проекта...

REM Проверка критических файлов
if not exist backend\oauth_auth.py (
    echo ❌ backend\oauth_auth.py не найден
    set /a errors+=1
) else (
    echo ✅ backend\oauth_auth.py
)

if not exist backend\server_oauth.py (
    echo ❌ backend\server_oauth.py не найден
    set /a errors+=1
) else (
    echo ✅ backend\server_oauth.py
)

if not exist frontend\src\contexts\OAuth2AuthContext.js (
    echo ❌ frontend\src\contexts\OAuth2AuthContext.js не найден
    set /a errors+=1
) else (
    echo ✅ frontend\src\contexts\OAuth2AuthContext.js
)

if not exist frontend\src\App_OAuth2.js (
    echo ❌ frontend\src\App_OAuth2.js не найден
    set /a errors+=1
) else (
    echo ✅ frontend\src\App_OAuth2.js
)

if %errors% gtr 0 (
    echo.
    echo ❌ Найдены критические ошибки! Файлы отсутствуют.
    echo 💡 Убедитесь, что все файлы OAuth2 созданы
    pause
    exit /b 1
)

echo.
echo 🧪 Запуск тестов OAuth2 системы...
python test_oauth2_system.py

echo.
echo 📊 Результаты тестирования:
if %errorlevel% equ 0 (
    echo ✅ Все тесты пройдены успешно!
    echo.
    echo 🚀 Система готова к использованию:
    echo    1. Настройте Google OAuth2 в backend\.env
    echo    2. Запустите: start_oauth2_backend.bat
    echo    3. Запустите: start_oauth2_frontend.bat
    echo    4. Перейдите на http://localhost:3000
) else (
    echo ❌ Обнаружены проблемы!
    echo 💡 Проверьте сообщения выше и исправьте ошибки
    echo 📖 Подробная помощь: TROUBLESHOOTING_OAuth2.md
)

echo.
pause