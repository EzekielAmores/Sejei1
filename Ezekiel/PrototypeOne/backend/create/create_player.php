<?php
include '../../db/config.php';

$user_id = $_POST['user_id'];
$team_id = $_POST['team_id'];

$stmt = $conn->prepare("INSERT INTO players (user_id, team_id) VALUES (?, ?)");
$stmt->bind_param("ii", $user_id, $team_id);

echo $stmt->execute() ? "Player created" : "Error: " . $stmt->error;

$stmt->close();
$conn->close();
?>