<?php
require_once '../db/config.php';

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM accounts WHERE username=? AND password=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

$response = ["success" => false];
if ($user = $result->fetch_assoc()) {
    $response["success"] = true;
    $response["user"] = [
        "username" => $user["username"],
        "user_id" => $user["id"],
        "role" => $user["role"] ?? "player"
    ];
}
echo json_encode($response);
?>
