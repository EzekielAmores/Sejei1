<?php
session_start();
require '../db/config.php';

header('Content-Type: application/json');
$logFile = 'login.log';
$timestamp = date('Y-m-d H:i:s'); // Format: 2025-07-24 14:35:00
$logEntry = "[$timestamp] LOGIN LOG\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

// CHECK IF SESSION ALREADY EXIST BY IT'S USERNAME
if (isset($_SESSION['username'])) {
    echo json_encode(['error' => 'Session already Exist']);
    exit;
}

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$stmt = $conn->prepare("SELECT * FROM credentials WHERE username = ?"); // prepares the table
$stmt->bind_param("s", $username); // links ? of type 's' string, with value of $username
$stmt->execute();  // Executes the command
$result = $stmt->get_result(); // Gets the result

// Debug Log
file_put_contents($logFile, "username: " . $username . "\n", FILE_APPEND);
file_put_contents($logFile, "password: " . $password . "\n", FILE_APPEND);


// Fetch the first result
if ($user = $result->fetch_assoc()){
    // Debug Log
    file_put_contents($logFile, print_r($user, true) . "\n", FILE_APPEND);
    // Check if password is correct
    // if (password_verify($password, $user['password'])){
    if ($password === $user['password']){ // Use if password is not hashed
        // Check if account is already in session
        if ($user['in_session'] == 1){
            // echo
            echo json_encode(['error' => 'Account already in session']);
            exit;
        }

        // Adds user and id to session. Still don't know about session
        $_SESSION['username'] = $user['username'];
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];

        file_put_contents($logFile, "session username: " . $_SESSION['username'] . "\n", FILE_APPEND);
        file_put_contents($logFile, "session user_id: " . $_SESSION['user_id'] . "\n", FILE_APPEND);

        // Updates in_session from 0 to 1
        $update = $conn->prepare("UPDATE credentials SET in_session = 1 WHERE id = ?");
        $update->bind_param("i", $user['id']);
        $update->execute();

        // SESSION LOG
        $json = json_encode([
            'session_id' => session_id(),
            'session_username' => $_SESSION['username'] ?? null,
            'all_session_data' => $_SESSION
        ]);
        file_put_contents($logFile, "json session: " . $json . "\n", FILE_APPEND);

        session_write_close(); // ALWAYS SAVE BEFORE REDIRECTING

        // returns success to client
        echo json_encode(['success' => true, 'username' => $user['username'], 'role' => $user['role']]);
    }else{
        echo json_encode(['error' => 'Invalid password']);
    }
}else{
    echo json_encode(['error' => 'User not found']);
}

$stmt->close(); // Closes the command
$conn->close(); // Closes the connection
?>