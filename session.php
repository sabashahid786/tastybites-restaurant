<?php
// session.php - centralized session start and helpers
if (session_status() === PHP_SESSION_NONE) {
    // Use cookies only (optional settings can be changed for security)
    session_start();
}

// Initialize cart in session if not present
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Helper: get current logged in user from session
function current_user(){
    if (!empty($_SESSION['user'])) return $_SESSION['user'];
    return null;
}
