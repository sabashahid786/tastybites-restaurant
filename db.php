<?php
// db.php - creates and returns a PDO instance using settings from config.php
require_once __DIR__ . '/config.php';

function getPDO(){
    static $pdo = null;
    if ($pdo) return $pdo;

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        // In production, avoid exposing detailed errors
        if (defined('APP_ENV') && APP_ENV === 'development') {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Database connection failed', 'details' => $e->getMessage()]);
        } else {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Database connection failed']);
        }
        exit;
    }
}
