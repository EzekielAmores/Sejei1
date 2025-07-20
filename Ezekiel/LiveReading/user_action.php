<?php
$data = json_decode(file_get_contents('php://input'), true);
$user = $data['user'];
$action = $data['action'];

$conn = new mysqli('localhost', 'root', '', 'test');
$conn->query("INSERT INTO actions (user, action) VALUES ('$user', '$action')");
echo "OK";
?>