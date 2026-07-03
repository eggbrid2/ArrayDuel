<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

$configPath = getenv('ARRAY_DUEL_AI_CONFIG') ?: '/www/server/arrayduel-ai-config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'AI config missing'], JSON_UNESCAPED_UNICODE);
    exit;
}

$config = require $configPath;
$apiKey = trim((string)($config['api_key'] ?? ''));
$baseUrl = rtrim((string)($config['base_url'] ?? 'https://cloud.omnimind.com.cn/'), '/');
$defaultModel = (string)($config['model'] ?? 'gpt-5.5');

if ($apiKey === '') {
    http_response_code(500);
    echo json_encode(['error' => 'AI key missing'], JSON_UNESCAPED_UNICODE);
    exit;
}

$rawBody = file_get_contents('php://input') ?: '';
$payload = json_decode($rawBody, true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON'], JSON_UNESCAPED_UNICODE);
    exit;
}

$payload['model'] = trim((string)($payload['model'] ?? '')) ?: $defaultModel;
$payload['stream'] = false;
$endpoint = endsWith($baseUrl, '/chat/completions')
    ? $baseUrl
    : (endsWith($baseUrl, '/v1') ? $baseUrl . '/chat/completions' : $baseUrl . '/v1/chat/completions');

[$status, $body] = proxyJson($endpoint, $apiKey, json_encode($payload, JSON_UNESCAPED_UNICODE));
http_response_code($status);
echo $body;

function proxyJson(string $endpoint, string $apiKey, string $body): array
{
    if (function_exists('curl_init')) {
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey,
            ],
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_TIMEOUT => 45,
        ]);
        $result = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($result === false || $status === 0) {
            return [502, json_encode(['error' => 'AI gateway request failed', 'detail' => $error], JSON_UNESCAPED_UNICODE)];
        }
        return [$status, (string)$result];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\nAuthorization: Bearer {$apiKey}\r\n",
            'content' => $body,
            'timeout' => 45,
            'ignore_errors' => true,
        ],
    ]);
    $result = file_get_contents($endpoint, false, $context);
    $status = 502;
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $match)) {
        $status = (int)$match[1];
    }
    return [$status, $result === false ? json_encode(['error' => 'AI gateway request failed'], JSON_UNESCAPED_UNICODE) : $result];
}

function endsWith(string $value, string $suffix): bool
{
    $length = strlen($suffix);
    if ($length === 0) return true;
    return substr($value, -$length) === $suffix;
}
