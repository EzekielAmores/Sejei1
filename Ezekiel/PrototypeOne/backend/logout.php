<?php
// session_start() gets existing session if it exist
session_start();
require '../db/config.php';

// isset() checks if that thing exist
if (isset($_SESSION['user_id'])){
    // Gets session user_id
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("UPDATE credentials SET in_session = 0 WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->close();

    session_destroy();
    echo json_encode(['success' => true]);
}else {
    // exactly! Checks if session exist, why log out when there is no session
    echo json_encode(['error' => 'No active session']);
}
?>