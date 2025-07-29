<?php
$conn = new mysqli("127.0.0.1", "root", "", "game");

if ($conn->connect_error) {
    die("Connection failed");
}

$name = trim($_POST['name'] ?? '');

if (!$name) {
    echo "Name is required.";
    exit;
}

$stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param("s", $name);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo "Name already exists.";
} else {
    $stmt = $conn->prepare("INSERT INTO users (username) VALUES (?)");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    echo "Name added.";
}

$conn->close();