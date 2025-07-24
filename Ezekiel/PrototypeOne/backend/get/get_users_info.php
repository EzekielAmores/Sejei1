<?php
include '../../db/config.php';

$result = $conn->query("SELECT * FROM users_info");
$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data, JSON_PRETTY_PRINT);
$conn->close();
?>