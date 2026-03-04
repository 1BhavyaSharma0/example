<?php
/**
 * NEXUS Agency — Database Connection
 */
define('DB_HOST', 'localhost');
define('DB_USER', 'nexus_user');
define('DB_PASS', 'your_secure_password');
define('DB_NAME', 'nexus_agency');

$pdo = new PDO(
    "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
    DB_USER, DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
);
