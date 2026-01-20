<?php
// Backend config: database credentials and basic settings
// Update these values to match your XAMPP MySQL setup if different
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'tastybites');
define('DB_USER', 'root');
define('DB_PASS', ''); // default XAMPP MySQL has empty password for root

// Other settings
define('APP_ENV', 'development');

// Helpful: set appropriate headers for AJAX JSON responses by default
header('Access-Control-Allow-Origin: *'); // adjust in production
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
// Do not output anything here
?>
