<?php
/**
 * Configuration file for Pageant Empress FAQ API
 */

// Prevent direct access
if (!defined('API_ACCESS')) {
    http_response_code(403);
    die('Access denied');
}

// Environment configuration
define('ENVIRONMENT', 'production'); // 'development' or 'production'

// Database configuration (if using database storage)
define('DB_HOST', 'localhost');
define('DB_NAME', 'pageantempress_db');
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
define('DB_CHARSET', 'utf8mb4');

// API configuration
define('API_VERSION', '1.0');
define('API_BASE_URL', 'https://pageantempress.com/api/');

// Rate limiting
define('RATE_LIMIT_REQUESTS', 100); // requests per hour
define('RATE_LIMIT_WINDOW', 3600); // in seconds

// Security
define('API_SECRET_KEY', 'your_secret_key_here_change_this');
define('CORS_ORIGINS', [
    'https://pageantempress.com',
    'https://www.pageantempress.com',
    'http://localhost:3000' // for development
]);

// File paths
define('FAQ_DATA_FILE', '../data/faq-data.json');
define('LOG_FILE', '../logs/api.log');
define('CACHE_DIR', '../cache/');

// Cache settings
define('CACHE_ENABLED', true);
define('CACHE_DURATION', 3600); // 1 hour

// Analytics
define('GOOGLE_ANALYTICS_ID', 'GA_MEASUREMENT_ID');
define('TRACK_SEARCH_QUERIES', true);

// Email settings for feedback
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your_email@gmail.com');
define('SMTP_PASS', 'your_app_password');
define('ADMIN_EMAIL', 'admin@pageantempress.com');

// Error reporting
if (ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    define('DEBUG_MODE', true);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    define('DEBUG_MODE', false);
}

// Timezone
date_default_timezone_set('America/New_York');

// Security headers
function setSecurityHeaders() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    if (ENVIRONMENT === 'production') {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

// CORS headers
function setCORSHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, CORS_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');
}

// Database connection
function getDatabaseConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (PDOException $e) {
            if (DEBUG_MODE) {
                die('Database connection failed: ' . $e->getMessage());
            } else {
                die('Database connection failed');
            }
        }
    }
    
    return $pdo;
}

// Logging function
function logMessage($message, $level = 'INFO') {
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[{$timestamp}] [{$level}] {$message}" . PHP_EOL;
    
    if (is_writable(dirname(LOG_FILE))) {
        file_put_contents(LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
    }
}

// Rate limiting check
function checkRateLimit($identifier) {
    $cacheFile = CACHE_DIR . 'rate_limit_' . md5($identifier);
    
    if (!file_exists($cacheFile)) {
        file_put_contents($cacheFile, json_encode([
            'requests' => 1,
            'window_start' => time()
        ]));
        return true;
    }
    
    $data = json_decode(file_get_contents($cacheFile), true);
    
    if (time() - $data['window_start'] > RATE_LIMIT_WINDOW) {
        // Reset window
        $data = [
            'requests' => 1,
            'window_start' => time()
        ];
    } else {
        $data['requests']++;
    }
    
    file_put_contents($cacheFile, json_encode($data));
    
    return $data['requests'] <= RATE_LIMIT_REQUESTS;
}

// Cache functions
function getCacheKey($key) {
    return CACHE_DIR . 'cache_' . md5($key);
}

function getFromCache($key) {
    if (!CACHE_ENABLED) return null;
    
    $cacheFile = getCacheKey($key);
    
    if (file_exists($cacheFile)) {
        $data = json_decode(file_get_contents($cacheFile), true);
        
        if (time() - $data['timestamp'] < CACHE_DURATION) {
            return $data['content'];
        }
    }
    
    return null;
}

function saveToCache($key, $content) {
    if (!CACHE_ENABLED) return;
    
    $cacheFile = getCacheKey($key);
    $data = [
        'timestamp' => time(),
        'content' => $content
    ];
    
    file_put_contents($cacheFile, json_encode($data));
}

?>
