<?php
/**
 * NEXUS Agency — Contact Form Handler
 * Saves leads to MySQL database + sends email notification
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

define('DB_HOST', 'localhost');
define('DB_USER', 'nexus_user');
define('DB_PASS', 'your_secure_password');
define('DB_NAME', 'nexus_agency');
define('NOTIFY_EMAIL', 'leads@nexusagency.io');
define('FROM_EMAIL', 'noreply@nexusagency.io');

function jsonResponse($success, $message, $data = []) {
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $data));
    exit();
}
function sanitize($str) { return htmlspecialchars(strip_tags(trim($str)), ENT_QUOTES, 'UTF-8'); }

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: $_POST;

$name     = sanitize($data['name'] ?? '');
$email    = sanitize($data['email'] ?? '');
$phone    = sanitize($data['phone'] ?? '');
$company  = sanitize($data['company'] ?? '');
$services = sanitize($data['services'] ?? '');
$budget   = sanitize($data['budget'] ?? '');
$message  = sanitize($data['message'] ?? '');
$ip       = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

if (empty($name) || strlen($name) < 2) jsonResponse(false, 'Please provide a valid name.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonResponse(false, 'Please provide a valid email address.');

// Rate limiting
$rlFile = sys_get_temp_dir() . '/nexus_rl_' . md5($ip) . '.json';
$now = time();
$rl = ['count' => 0, 'window_start' => $now];
if (file_exists($rlFile)) {
    $rl = json_decode(file_get_contents($rlFile), true);
    if ($now - $rl['window_start'] > 3600) $rl = ['count' => 0, 'window_start' => $now];
    elseif ($rl['count'] >= 5) jsonResponse(false, 'Too many submissions. Please try again later.');
}
$rl['count']++;
file_put_contents($rlFile, json_encode($rl));

$leadId = null;
try {
    $pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $stmt = $pdo->prepare("INSERT INTO leads (name, email, phone, company, services_interested, budget_range, message, ip_address, source, created_at) VALUES (:name, :email, :phone, :company, :services, :budget, :message, :ip, :source, NOW())");
    $stmt->execute([':name'=>$name, ':email'=>$email, ':phone'=>$phone, ':company'=>$company, ':services'=>$services, ':budget'=>$budget, ':message'=>$message, ':ip'=>$ip, ':source'=>sanitize($_SERVER['HTTP_REFERER'] ?? 'direct')]);
    $leadId = $pdo->lastInsertId();
    $pdo->prepare("INSERT INTO activity_log (lead_id, action, description, created_at) VALUES (?, 'lead_created', ?, NOW())")->execute([$leadId, "New lead from {$email}"]);
} catch (PDOException $e) {
    error_log('NEXUS DB Error: ' . $e->getMessage());
}

// Notification email
$headers = "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: NEXUS Agency <".FROM_EMAIL.">\r\nReply-To: {$email}\r\n";
mail(NOTIFY_EMAIL, "New Lead: {$name} from {$company}", "<h2>New Lead #{$leadId}</h2><p><b>Name:</b> {$name}<br><b>Email:</b> {$email}<br><b>Phone:</b> {$phone}<br><b>Company:</b> {$company}<br><b>Services:</b> {$services}<br><b>Budget:</b> {$budget}<br><b>Message:</b> {$message}</p>", $headers);

// Auto-reply
$arHeaders = "MIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\nFrom: NEXUS Agency <".FROM_EMAIL.">\r\n";
mail($email, "We received your message — NEXUS Agency", "<p>Hi {$name}, thank you for reaching out to NEXUS! Our team will get back to you within 2 business hours.</p>", $arHeaders);

jsonResponse(true, 'Message sent successfully!', ['lead_id' => $leadId, 'timestamp' => date('c')]);
