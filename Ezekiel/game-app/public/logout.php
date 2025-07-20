<?php
session_start();
require_once '../db/config.php';

if (isset($_SESSION['user_id'])) {
  $id = $_SESSION['user_id'];
  $conn->query("UPDATE accounts SET logged_in = 0 WHERE id = $id");
}

session_destroy();
header("Location: login.php");
exit;
?>