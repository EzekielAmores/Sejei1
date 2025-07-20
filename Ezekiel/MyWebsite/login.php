<?php
session_start();
include 'connect.php';

$email = $_POST['email'];
$password = $_POST['password'];

// Get user from DB
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    
    if (password_verify($password, $user['password'])) {
        // Password matches
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        header("Location: home.php");
        exit;
    } else {
        echo "Invalid password.";
    }
} else {
    echo "No account found.";
}

$conn->close();
?>