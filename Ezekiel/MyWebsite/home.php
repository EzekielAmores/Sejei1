<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head><title>Welcome</title></head>
<body>
  <h2>Welcome, <?php echo $_SESSION['email']; ?>!</h2>
  <a href="logout.php">Logout</a>
</body>
</html>