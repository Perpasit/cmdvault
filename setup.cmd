@echo off
setlocal

cd /d "%~dp0"

echo.
echo ========================================
echo   CmdVault Developer Setup
echo ========================================
echo.

echo [1/4] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js was not found.
    echo Install Node.js and try again.
    goto :failed
)
node --version
echo.

echo [2/4] Checking npm...
where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm was not found.
    echo Install Node.js with npm and try again.
    goto :failed
)
call npm --version
echo.

echo [3/4] Checking Rust...
where cargo >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Rust/Cargo was not found.
    echo Install Rust and try again.
    goto :failed
)
cargo --version
echo.

echo [4/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed.
    goto :failed
)

echo.
echo ========================================
echo   CmdVault setup completed successfully
echo ========================================
echo.
echo Next:
echo   Run dev.cmd to start CmdVault.
echo.
exit /b 0

:failed
echo.
echo ========================================
echo   CmdVault setup failed
echo ========================================
echo.
exit /b 1