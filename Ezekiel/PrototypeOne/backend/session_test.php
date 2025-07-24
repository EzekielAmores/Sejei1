<?php
session_start();

// Initialize or increment visit count
if (!isset($_SESSION['visit_count'])) {
    $_SESSION['visit_count'] = 1;
} else {
    $_SESSION['visit_count']++;
}

// Display session ID and visit count
echo "<h1>PHP Session Test</h1>";
echo "<p><strong>Session ID:</strong> " . session_id() . "</p>";
echo "<p><strong>Visit Count (in this session):</strong> " . $_SESSION['visit_count'] . "</p>";