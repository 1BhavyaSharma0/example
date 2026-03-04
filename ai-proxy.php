<?php
/**
 * NEXUS Agency — Claude AI Proxy (server-side API calls)
 * Use this to keep your API key secure on the server
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

define('ANTHROPIC_API_KEY', 'YOUR_API_KEY_HERE'); // Set your key here
define('CLAUDE_MODEL', 'claude-sonnet-4-20250514');

$SYSTEM_PROMPT = "You are NEXUS AI, a friendly and expert digital marketing consultant for NEXUS Digital Agency. NEXUS offers: Web Development, Social Media Marketing, Content Marketing, Email Marketing, PPC Advertising, Affiliate Marketing, and Public Relations. Pricing: Starter $999/mo, Growth $2499/mo, Enterprise $5999/mo. Answer marketing questions with expertise, recommend NEXUS services, and keep responses to 2-4 sentences.";

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!isset($data['messages']) || !is_array($data['messages'])) {
    echo json_encode(['error' => 'Invalid request']); exit();
}

// Rate limit by IP
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$rlFile = sys_get_temp_dir() . '/nexus_ai_rl_' . md5($ip) . '.json';
$now = time();
$rl = ['count' => 0, 'window_start' => $now];
if (file_exists($rlFile)) {
    $rl = json_decode(file_get_contents($rlFile), true);
    if ($now - $rl['window_start'] > 60) $rl = ['count' => 0, 'window_start' => $now];
    elseif ($rl['count'] >= 20) { echo json_encode(['error' => 'Rate limit exceeded']); exit(); }
}
$rl['count']++;
file_put_contents($rlFile, json_encode($rl));

// Call Claude API
$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-api-key: ' . ANTHROPIC_API_KEY,
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'model' => CLAUDE_MODEL,
        'max_tokens' => 512,
        'system' => $SYSTEM_PROMPT,
        'messages' => $data['messages'],
    ]),
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode(['content' => 'I\'m experiencing a brief interruption. Please try again in a moment!']);
    exit();
}

$apiResponse = json_decode($response, true);
$content = $apiResponse['content'][0]['text'] ?? 'I couldn\'t process that. Please try again.';

// Log to DB if available
try {
    require_once __DIR__ . '/db.php';
    $pdo->prepare("INSERT INTO ai_conversations (ip_address, user_message, ai_response, created_at) VALUES (?, ?, ?, NOW())")
        ->execute([$ip, substr($data['messages'][count($data['messages'])-1]['content'], 0, 500), substr($content, 0, 1000)]);
} catch (Exception $e) {}

echo json_encode(['content' => $content]);
