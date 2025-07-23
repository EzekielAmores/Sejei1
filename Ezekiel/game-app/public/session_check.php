<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(null);
    exit;
}

$username = $_SESSION['username'];

try {
    $pdo = new PDO("mysql:host=localhost;dbname=game", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("
        SELECT 
            a.id AS user_id, a.username, a.role, a.logged_in, 
            t.team_id, t.position
        FROM 
            accounts a
        LEFT JOIN 
            team_members t ON a.id = t.user_id
        WHERE 
            a.username = ?
    ");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(null);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}