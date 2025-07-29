@echo off
echo === Stopping MariaDB Server ===
taskkill /F /IM mysqld.exe >nul 2>&1

echo === Stopping PHP Server ===
taskkill /F /IM php.exe >nul 2>&1

echo === Stopping Node.js Server ===
taskkill /F /IM node.exe >nul 2>&1

echo All servers stopped.
pause