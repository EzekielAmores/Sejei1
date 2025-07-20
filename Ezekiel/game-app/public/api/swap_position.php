<?php
// game-app/public/api/swap_position.php

require_once '../../db/config.php'; // correct DB path

header('Content-Type: application/json');

// Read and decode JSON input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

// Validate input
if (!isset($data['team_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing team_id']);
    exit;
}

$team_id = intval($data['team_id']);

// Fetch team members sorted by position (expecting at least 2)
$stmt = $conn->prepare("SELECT user_id, position FROM team_members WHERE team_id = ? ORDER BY position ASC LIMIT 2");
$stmt->execute([$team_id]);
$members = $stmt->fetchAll(PDO::FETCH_ASSOC);
file_put_contents('debug_members_log.txt', json_encode($members));

if (count($members) < 2) {
    http_response_code(400);
    echo json_encode(['error' => 'Not enough team members to swap']);
    exit;
}

$current = $members[0]; // position 1
$next = $members[1];    // position 2

try {
    // Begin transaction
    $conn->beginTransaction();

    // Swap positions
    $updateStmt = $conn->prepare("UPDATE team_members SET position = ? WHERE user_id = ?");

    $updateStmt->execute([$next['position'], $current['user_id']]);
    $updateStmt->execute([$current['position'], $next['user_id']]);

    // Commit transaction
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Positions swapped']);
} catch (Exception $e) {
    $conn->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Swap failed', 'details' => $e->getMessage()]);
}
