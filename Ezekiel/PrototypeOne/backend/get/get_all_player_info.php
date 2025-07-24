<?php
include '../../db/config.php';

$sql = "
SELECT 
  u.first_name,
  u.last_name,
  u.gender,
  c.role,
  t.team,
  t.score
FROM players p
JOIN users_info u ON p.user_id = u.user_id
JOIN credentials c ON c.user_id = u.user_id
JOIN teams t ON p.team_id = t.team_id
";

$result = $conn->query($sql);
$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data, JSON_PRETTY_PRINT);
$conn->close();
?>