@echo off
echo === Checking Server Status ===

tasklist /FI "IMAGENAME eq mysqld.exe" | find /I "mysqld.exe" >nul
if %errorlevel%==0 (
    echo MariaDB is running.
) else (
    echo MariaDB is NOT running.
)

tasklist /FI "IMAGENAME eq php.exe" | find /I "php.exe" >nul
if %errorlevel%==0 (
    echo PHP Server is running.
) else (
    echo PHP Server is NOT running.
)

tasklist /FI "IMAGENAME eq node.exe" | find /I "node.exe" >nul
if %errorlevel%==0 (
    echo Node.js server is running.
) else (
    echo Node.js server is NOT running.
)

pause