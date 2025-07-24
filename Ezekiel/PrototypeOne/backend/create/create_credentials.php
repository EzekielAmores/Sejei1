<?php
require '../../db/config.php';

$username = $_POST['username'];
$password = $_POST['password'];
$role = $_POST['role'];
$user_id = $_POST['user_id'];

$stmt = $conn->prepare("INSERT INTO credentials (username, password, role, user_id) VALUES (?, ?, ?, ?)");
$stmt->bind_param("sssi", $username, $password, $role, $user_id);

echo $stmt->execute() ? "Credentials created" : "Error: " . $stmt->error;

$stmt->close();
$conn->close();
?>