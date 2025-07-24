<?php
include '../../db/config.php';

$team = $_POST['team'];

$stmt = $conn->prepare("INSERT INTO teams (team, score) VALUES (?, 0)");
$stmt->bind_param("s", $team);

echo $stmt->execute() ? "Team created" : "Error: " . $stmt->error;

$stmt->close();
$conn->close();
?>