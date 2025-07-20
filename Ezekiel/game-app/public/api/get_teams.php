<?php
require_once '../db.php'; // Feel nako kailangan i change

$stmt = $pdo->query("
  SELECT u.id, u.username, u.position, t.name as team_name, t.id as team_id
  FROM users u
  LEFT JOIN teams t ON u.team_id = t.id
  ORDER BY t.id ASC, u.position ASC
");

$teams = [];
foreach ($stmt->fetchAll() as $row) {
  $tid = $row['team_id'];
  if (!isset($teams[$tid])) {
    $teams[$tid] = ['team_name' => $row['team_name'], 'members' => []];
  }
  $teams[$tid]['members'][] = [
    'id' => $row['id'],
    'username' => $row['username'],
    'position' => $row['position']
  ];
}

echo json_encode(array_values($teams));