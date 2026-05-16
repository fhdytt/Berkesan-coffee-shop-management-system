<?php

// --- Database Configuration ---
define('DB_HOST', 'localhost');      
define('DB_USER', 'your_username');  
define('DB_PASS', 'your_password');  
define('DB_NAME', 'berkesan');     

define('BASE_URL', 'http://localhost/'); 

try {
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $db  = new PDO($dsn, DB_USER, DB_PASS, $options);

} catch (PDOException $e) {
    error_log($e->getMessage());
    die("Koneksi ke database gagal. Pastikan Anda telah mengatur file config.php dengan benar.");
}