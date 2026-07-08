<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$dataDir = __DIR__ . '/data';
$dataFile = $dataDir . '/victory-messages.json';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['messages' => readMessages($dataFile)], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$payload = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON'], JSON_UNESCAPED_UNICODE);
    exit;
}

$name = trim((string)($payload['name'] ?? ''));
$message = trim((string)($payload['message'] ?? ''));
$name = trim(limitText($name !== '' ? $name : '无名阵师', 18));
$message = trim(limitText($message, 120));

if ($message === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Message required'], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!is_dir($dataDir) && !mkdir($dataDir, 0775, true) && !is_dir($dataDir)) {
    http_response_code(500);
    echo json_encode(['error' => 'Data directory unavailable'], JSON_UNESCAPED_UNICODE);
    exit;
}

$messages = readMessages($dataFile);
array_unshift($messages, [
    'name' => $name,
    'message' => $message,
    'createdAt' => gmdate('c'),
]);
$messages = array_slice($messages, 0, 100);

if (file_put_contents($dataFile, json_encode($messages, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Save failed'], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['messages' => $messages], JSON_UNESCAPED_UNICODE);

function readMessages(string $dataFile): array
{
    if (!is_file($dataFile)) return [];
    $content = file_get_contents($dataFile);
    if ($content === false || trim($content) === '') return [];
    $messages = json_decode($content, true);
    return is_array($messages) ? array_values(array_filter($messages, 'is_array')) : [];
}

function limitText(string $value, int $length): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $length, 'UTF-8');
    }
    return substr($value, 0, $length * 3);
}
