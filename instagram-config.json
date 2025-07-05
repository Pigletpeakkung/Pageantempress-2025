<?php
// Instagram API Integration
// This is a backend script to handle Instagram API calls

class InstagramAPI {
    private $accessToken;
    private $userId;
    
    public function __construct() {
        $this->accessToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN';
        $this->userId = 'YOUR_INSTAGRAM_USER_ID';
    }
    
    // Get recent posts
    public function getRecentPosts($limit = 8) {
        $url = "https://graph.instagram.com/{$this->userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit={$limit}&access_token={$this->accessToken}";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    // Get account info
    public function getAccountInfo() {
        $url = "https://graph.instagram.com/{$this->userId}?fields=id,username,media_count,followers_count&access_token={$this->accessToken}";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    // Refresh access token
    public function refreshToken() {
        $url = "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={$this->accessToken}";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
}

// API Endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$api = new InstagramAPI();
$action = $_GET['action'] ?? 'posts';

switch($action) {
    case 'posts':
        $posts = $api->getRecentPosts();
        echo json_encode($posts);
        break;
        
    case 'account':
        $account = $api->getAccountInfo();
        echo json_encode($account);
        break;
        
    case 'refresh':
        $token = $api->refreshToken();
        echo json_encode($token);
        break;
        
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}
?>
