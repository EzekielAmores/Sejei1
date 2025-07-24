<?php
include '../../db/config.php';

$user_id = $_POST['user_id'];
$last = $_POST['last_name'];
$first = $_POST['first_name'];
$gender = $_POST['gender'];

$stmt = $conn->prepare("INSERT INTO users_info (user_id, last_name, first_name, gender) VALUES (?, ?, ?, ?)");
$stmt->bind_param("isss", $user_id, $last, $first, $gender);

echo $stmt->execute() ? "User info created" : "Error: " . $stmt->error;

$stmt->close();
$conn->close();
?>