<?php
$host = 'localhost';
$dbname = 'game';
$user = 'root';
$pass = ''; // Change if using password

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>