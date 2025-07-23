<?php
// game-app/public/api/swap_position.php
require '../../db/config.php';

header('Content-Type: application/json');

$logFile = 'swap_debug.log';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
file_put_contents($logFile, "Raw input: " . $rawInput . "\n", FILE_APPEND);

// Check required parameter
if (!isset($data['team_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing team_id']);
    exit;
}

$team_id = $data['team_id'];

// Fetch players in order of position
$stmt = $conn->prepare("SELECT user_id, position FROM team_members WHERE team_id = ? ORDER BY position ASC");
$stmt->bind_param("i", $team_id);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'DB error']);
    exit;
}

$result = $stmt->get_result();
$players = [];
while ($row = $result->fetch_assoc()) {
    $players[] = $row;
}

file_put_contents($logFile, "Fetched players: " . json_encode($players) . "\n", FILE_APPEND);

$count = count($players);
if ($count < 2) {
    http_response_code(400);
    echo json_encode(['error' => 'Not enough team members']);
    exit;
}

// Perform circular shift of positions
$originalPositions = array_column($players, 'position');
$rotatedPositions = $originalPositions;
// array_push($rotatedPositions, array_shift($rotatedPositions)); // shift left
array_unshift($rotatedPositions, array_pop($rotatedPositions)); // shift right

file_put_contents($logFile, "Rotated: " . json_encode($rotatedPositions) . "\n", FILE_APPEND);

// Update positions in DB
for ($i = 0; $i < $count; $i++) {
    $user_id = $players[$i]['user_id'];
    $new_pos = $rotatedPositions[$i];

    $update = $conn->prepare("UPDATE team_members SET position = ? WHERE user_id = ?");
    $update->bind_param("ii", $new_pos, $user_id);
    $update->execute();
    file_put_contents($logFile, "Updated user_id $user_id to position $new_pos\n", FILE_APPEND);
}

echo json_encode(['success' => true]);
?>