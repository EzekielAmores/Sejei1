<?php
session_start();
require_once '../db/config.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = $_POST['username'];
  $password = $_POST['password'];

  $stmt = $conn->prepare("SELECT * FROM accounts WHERE username = ?");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result();
  $account = $result->fetch_assoc();

  if ($account && $password === $account['password']) { // Use password_verify if hashed
    if ($account['logged_in'] == 1) {
      $error = "Account is already in session.";
    } else {
      $_SESSION['username'] = $username;
      $_SESSION['role'] = $account['role'];
      $_SESSION['user_id'] = $account['id'];

      $conn->query("UPDATE accounts SET logged_in = 1 WHERE id = {$account['id']}");

      if ($account['role'] == 'admin') {
        header("Location: admin.html");
      } else {
        header("Location: client.html");
      }
      exit;
    }
  } else {
    $error = "Invalid username or password.";
  }
}
?>

<!DOCTYPE html>
<html>
<head>
  <title>Login</title>
</head>
<body>
  <h2>Login</h2>
  <?php if ($error): ?><p style="color:red"><?= $error ?></p><?php endif; ?>
  <form method="POST">
    <input name="username" required placeholder="Username"><br>
    <input name="password" type="password" required placeholder="Password"><br>
    <button type="submit">Login</button>
  </form>
</body>
</html>