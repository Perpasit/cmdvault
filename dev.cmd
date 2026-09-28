@echo off
setlocal

cd /d "%~dp0"

echo.
echo ========================================
echo   Starting CmdVault
echo ========================================
echo.

if not exist "node_modules" (
    echo [ERROR] Dependencies are not installed.
    echo Run setup.cmd first.
    echo.
    exit /b 1
)

where cargo >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Rust/Cargo was not found.
    echo Run setup.cmd and check the Rust installation.
    echo.
    exit /b 1
)

echo Starting Tauri development mode...
echo Press Ctrl+C to stop CmdVault.
echo.

call npx tauri dev

if errorlevel 1 (
    echo.
    echo [ERROR] CmdVault stopped with an error.
    exit /b 1
)

endlocal