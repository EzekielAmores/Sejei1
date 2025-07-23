<?php
session_start();
require '../db/config.php';

header('Content-Type: application/json');
$logFile = 'debug.log';
file_put_contents($logFile, "DEBUG LOG\n", FILE_APPEND);

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$stmt = $conn->prepare("SELECT * FROM credentials WHERE username = ?"); // prepares the table
$stmt->bind_param("s", $username); // links ? of type 's' string, with value of $username
$stmt->execute();  // Executes the command
$result = $stmt->get_result(); // Gets the result

file_put_contents($logFile, "username: " . $username . "\n", FILE_APPEND);
file_put_contents($logFile, "password: " . $password . "\n", FILE_APPEND);

// Fetch the first result
if ($user = $result->fetch_assoc()){
    // Check if password is correct
    if (password_verify($password, $user['password'])){
        // Check if account is already in session
        if ($user['in_session'] == 1){
            // echo
            echo json_encode(['error' => 'Account already in session']);
            exit;
        }

        // Adds user and id to session. Still don't know about session
        $_SESSION['username'] = $user['username'];
        $_SESSION['user_id'] = $user['id'];

        // Updates in_session from 0 to 1
        $update = $conn->prepare("UPDATE credentials SET in_session = 1 WHERE id = ?");
        $update->bind_param("i", $user['id']);
        $update->execute();

        // returns success to client
        echo json_encode(['success' => true, 'username' => $user['username']]);
    }else{
        echo json_encode(['error' => 'Invalid password']);
    }
}else{
    echo json_encode(['error' => 'User not found']);
}

$stmt->close(); // Closes the command
$conn->close(); // Closes the connection
?>