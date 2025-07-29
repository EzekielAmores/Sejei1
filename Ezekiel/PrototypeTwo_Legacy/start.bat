@echo off
echo === Starting MariaDB Server ===
start "" "mariadb\bin\mysqld.exe" --defaults-file=mariadb\my.ini

echo === Starting PHP Server ===
start "" "php\php.exe" -S localhost:8000 -t public

echo === Starting Node.js Server ===
cd server
start "" "node" server.js
cd ..

echo All servers started.
pause