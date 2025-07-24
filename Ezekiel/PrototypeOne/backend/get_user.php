<?php
session_start();

header('Content-Type: application/json');
$logFile = 'get_user.log';
$timestamp = date('Y-m-d H:i:s'); // Format: 2025-07-24 14:35:00
$logEntry = "[$timestamp] GET USER LOG\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);
file_put_contents($logFile, "session username: " . isset($_SESSION['username']) . "\n", FILE_APPEND);

$json = json_encode([
    'session_id' => session_id(),
    'session_username' => $_SESSION['username'] ?? null,
    'all_session_data' => $_SESSION
]);

file_put_contents($logFile, "json session: " . $json . "\n", FILE_APPEND);


if (isset($_SESSION['username'])) {
    echo json_encode(["username" => $_SESSION['username'], "user_id" => $_SESSION['user_id'], "role" => $_SESSION['role']]);
} else {
    echo json_encode(["username" => null, "user_id" => null, "role" => null]);
}