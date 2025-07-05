<?php
/**
 * FAQ Search API Endpoint
 * Handles FAQ search requests and returns filtered results
 */

define('API_ACCESS', true);
require_once 'config.php';

// Set headers
setSecurityHeaders();
setCORSHeaders();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET and POST requests
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST'])) {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Rate limiting
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!checkRateLimit($clientIP)) {
    http_response_code(429);
    echo json_encode(['error' => 'Rate limit exceeded']);
    exit();
}

// Get request parameters
$method = $_SERVER['REQUEST_METHOD'];
$params = [];

if ($method === 'GET') {
    $params = $_GET;
} else {
    $input = file_get_contents('php://input');
    $params = json_decode($input, true) ?: [];
}

// Validate and sanitize input
$query = trim($params['query'] ?? '');
$category = trim($params['category'] ?? 'all');
$limit = min(max(intval($params['limit'] ?? 50), 1), 100);
$offset = max(intval($params['offset'] ?? 0), 0);

// Log search query
if (TRACK_SEARCH_QUERIES && !empty($query)) {
    logMessage("FAQ Search: '{$query}' from IP: {$clientIP}");
}

// Check cache first
$cacheKey = "faq_search_" . md5($query . $category . $limit . $offset);
$cachedResult = getFromCache($cacheKey);

if ($cachedResult !== null) {
    header('Content-Type: application/json');
    echo json_encode($cachedResult);
    exit();
}

try {
    // Load FAQ data
    $faqData = loadFAQData();
    
    // Perform search
    $results = searchFAQs($faqData, $query, $category, $limit, $offset);
    
    // Prepare response
    $response = [
        'success' => true,
        'query' => $query,
        'category' => $category,
        'total_results' => $results['total'],
        'showing_results' => count($results['items']),
        'results' => $results['items'],
        'suggestions' => $results['suggestions'] ?? [],
        'timestamp' => date('c')
    ];
    
    // Cache the result
    saveToCache($cacheKey, $response);
    
    // Send response
    header('Content-Type: application/json');
    echo json_encode($response);
    
} catch (Exception $e) {
    logMessage("FAQ Search Error: " . $e->getMessage(), 'ERROR');
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => DEBUG_MODE ? $e->getMessage() : 'Internal server error'
    ]);
}

/**
 * Load FAQ data from JSON file
 */
function loadFAQData() {
    if (!file_exists(FAQ_DATA_FILE)) {
        throw new Exception('FAQ data file not found');
    }
    
    $jsonData = file_get_contents(FAQ_DATA_FILE);
    $data = json_decode($jsonData, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON in FAQ data file');
    }
    
    return $data;
}

/**
 * Search FAQs based on query and filters
 */
function searchFAQs($faqData, $query, $category, $limit, $offset) {
    $allResults = [];
    
    foreach ($faqData['categories'] as $cat) {
        // Filter by category if specified
        if ($category !== 'all' && $cat['id'] !== $category) {
            continue;
        }
        
        foreach ($cat['questions'] as $question) {
            $score = calculateRelevanceScore($question, $query);
            
            if ($score > 0) {
                $allResults[] = [
                    'id' => $question['id'],
                    'category' => $cat['id'],
                    'category_name' => $cat['name'],
                    'question' => $question['question'],
                    'answer' => $question['answer'],
                    'score' => $score,
                    'highlighted_question' => highlightSearchTerms($question['question'], $query),
                    'highlighted_answer' => highlightSearchTerms(strip_tags($question['answer']), $query),
                    'snippet' => generateSnippet($question['answer'], $query)
                ];
            }
        }
    }
    
    // Sort by relevance score
    usort($allResults, function($a, $b) {
        return $b['score'] <=> $a['score'];
    });
    
    $total = count($allResults);
    $paginatedResults = array_slice($allResults, $offset, $limit);
    
    return [
        'total' => $total,
        'items' => $paginatedResults,
        'suggestions' => generateSuggestions($query, $allResults)
    ];
}

/**
 * Calculate relevance score for a question
 */
function calculateRelevanceScore($question, $query) {
    if (empty($query)) {
        return 1; // Return all results if no query
    }
    
    $score = 0;
    $queryLower = strtolower($query);
    $questionLower = strtolower($question['question']);
    $answerLower = strtolower(strip_tags($question['answer']));
    
    // Exact phrase match in question (highest score)
    if (strpos($questionLower, $queryLower) !== false) {
        $score += 100;
    }
    
    // Exact phrase match in answer
    if (strpos($answerLower, $queryLower) !== false) {
        $score += 50;
    }
    
    // Individual word matches
    $queryWords = explode(' ', $queryLower);
    $questionWords = explode(' ', $questionLower);
    $answerWords = explode(' ', $answerLower);
    
    foreach ($queryWords as $word) {
        if (strlen($word) < 3) continue; // Skip short words
        
        // Word match in question
        if (in_array($word, $questionWords)) {
            $score += 20;
        }
        
        // Word match in answer
        if (in_array($word, $answerWords)) {
            $score += 10;
        }
        
        // Partial word matches
        foreach ($questionWords as $qWord) {
            if (strpos($qWord, $word) !== false) {
                $score += 5;
            }
        }
    }
    
    return $score;
}

/**
 * Highlight search terms in text
 */
function highlightSearchTerms($text, $query) {
    if (empty($query)) {
        return $text;
    }
    
    $queryWords = explode(' ', $query);
    
    foreach ($queryWords as $word) {
        if (strlen($word) < 3) continue;
        
        $text = preg_replace(
            '/(' . preg_quote($word, '/') . ')/i',
            '<mark>$1</mark>',
            $text
        );
    }
    
    return $text;
}

/**
 * Generate snippet from answer
 */
function generateSnippet($answer, $query, $maxLength = 150) {
    $plainText = strip_tags($answer);
    
    if (strlen($plainText) <= $maxLength) {
        return $plainText;
    }
    
    if (empty($query)) {
        return substr($plainText, 0, $maxLength) . '...';
    }
    
    // Find the position of the query in the text
    $queryPos = stripos($plainText, $query);
    
    if ($queryPos !== false) {
        // Calculate start position to center the query
        $start = max(0, $queryPos - ($maxLength / 2));
        $snippet = substr($plainText, $start, $maxLength);
        
        // Add ellipsis if needed
        if ($start > 0) {
            $snippet = '...' . $snippet;
        }
        if (strlen($plainText) > $start + $maxLength) {
            $snippet = $snippet . '...';
        }
        
        return $snippet;
    }
    
    return substr($plainText, 0, $maxLength) . '...';
}

/**
 * Generate search suggestions
 */
function generateSuggestions($query, $allResults) {
    if (empty($query) || count($allResults) >= 5) {
        return [];
    }
    
    // Common FAQ topics for suggestions
    $commonTopics = [
        'pricing', 'cost', 'payment', 'packages',
        'training', 'coaching', 'preparation', 'timeline',
        'competition', 'pageant', 'experience', 'beginner',
        'online', 'virtual', 'sessions', 'support',
        'wardrobe', 'styling', 'makeup', 'interview',
        'runway', 'talent', 'confidence', 'age'
    ];
    
    $suggestions = [];
    
    foreach ($commonTopics as $topic) {
        if (stripos($topic, $query) !== false || levenshtein($query, $topic) <= 2) {
            $suggestions[] = $topic;
        }
    }
    
    return array_slice($suggestions, 0, 5);
}

/**
 * Track search analytics (if enabled)
 */
function trackSearchAnalytics($query, $resultsCount) {
    if (!TRACK_SEARCH_QUERIES) return;
    
    // This could be enhanced to send to Google Analytics or other analytics service
    $analyticsData = [
        'query' => $query,
        'results_count' => $resultsCount,
        'timestamp'
