<?php
header('Content-Type: application/json');

// Default statuses
$status = [
    "php" => "Online", // If you're seeing this file, PHP is working
    "mysql" => "Offline"
];

// Try connecting to MySQL
try {
    $mysqli = @new mysqli("localhost", "root", "", "game", 3306);
    if (!$mysqli->connect_error) {
        $status["mysql"] = "Online";
        $mysqli->close();
    }
} catch (Exception $e) {
    // Just keep MySQL as Offline
}

// Always return JSON
echo json_encode($status);