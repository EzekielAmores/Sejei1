<?php
$conn = new mysqli('localhost', 'root', '', 'test');
$result = $conn->query("SELECT * FROM actions ORDER BY timestamp DESC LIMIT 10");
$rows = [];

while ($row = $result->fetch_assoc()) {
  $rows[] = $row;
}

header('Content-Type: application/json');
echo json_encode($rows);
?>