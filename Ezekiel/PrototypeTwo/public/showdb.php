<?php
$conn = new mysqli("localhost", "root", "", "");
$result = $conn->query("SHOW DATABASES;");
while ($row = $result->fetch_array()) {
    echo $row[0] . "<br>";
}
?>