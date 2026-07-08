<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

session_set_cookie_params([
    'lifetime' => 60 * 60 * 24 * 30,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

$dataDir = __DIR__ . '/data';
$usersFile = $dataDir . '/users.json';
$invitesFile = $dataDir . '/invite-codes.json';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$action = (string)($_GET['action'] ?? '');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'status') {
    echo json_encode(['user' => currentUser($usersFile)], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Method not allowed');
}

$payload = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($payload)) {
    fail(400, 'Invalid JSON');
}

if ($action === 'register') {
    ensureDataDir($dataDir);
    $phone = normalizePhone((string)($payload['phone'] ?? ''));
    $password = (string)($payload['password'] ?? '');
    $nickname = trim(limitText((string)($payload['nickname'] ?? ''), 18));
    $inviteCode = strtoupper(trim((string)($payload['inviteCode'] ?? '')));

    if (!isValidPhone($phone)) fail(422, '手机号格式不正确');
    if (strlen($password) < 6 || strlen($password) > 72) fail(422, '密码至少 6 位');
    if ($inviteCode === '') fail(422, '需要邀请码');
    if ($nickname === '') $nickname = '阵师' . substr($phone, -4);

    $users = readJsonList($usersFile);
    foreach ($users as $user) {
        if (($user['phone'] ?? '') === $phone) fail(409, '手机号已注册');
    }

    $invites = readJsonList($invitesFile);
    $inviteIndex = findInviteIndex($invites, $inviteCode);
    if ($inviteIndex < 0 || !empty($invites[$inviteIndex]['usedAt'])) {
        fail(403, '邀请码无效或已使用');
    }

    $now = gmdate('c');
    $ip = clientIp();
    $id = bin2hex(random_bytes(12));
    $user = [
        'id' => $id,
        'phone' => $phone,
        'nickname' => $nickname,
        'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
        'registeredIp' => $ip,
        'lastLoginIp' => $ip,
        'createdAt' => $now,
        'lastLoginAt' => $now,
        'inviteCode' => $inviteCode,
    ];
    $users[] = $user;
    $invites[$inviteIndex]['usedAt'] = $now;
    $invites[$inviteIndex]['usedBy'] = $id;
    writeJsonList($usersFile, $users);
    writeJsonList($invitesFile, $invites);
    $_SESSION['user_id'] = $id;
    echo json_encode(['user' => publicUser($user)], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($action === 'login') {
    $phone = normalizePhone((string)($payload['phone'] ?? ''));
    $password = (string)($payload['password'] ?? '');
    $users = readJsonList($usersFile);
    foreach ($users as $index => $user) {
        if (($user['phone'] ?? '') !== $phone) continue;
        if (!password_verify($password, (string)($user['passwordHash'] ?? ''))) break;
        $users[$index]['lastLoginIp'] = clientIp();
        $users[$index]['lastLoginAt'] = gmdate('c');
        writeJsonList($usersFile, $users);
        $_SESSION['user_id'] = (string)$user['id'];
        echo json_encode(['user' => publicUser($users[$index])], JSON_UNESCAPED_UNICODE);
        exit;
    }
    fail(401, '手机号或密码不正确');
}

if ($action === 'logout') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool)$params['secure'], (bool)$params['httponly']);
    }
    session_destroy();
    echo json_encode(['user' => null], JSON_UNESCAPED_UNICODE);
    exit;
}

fail(404, 'Unknown action');

function currentUser(string $usersFile): ?array
{
    $userId = (string)($_SESSION['user_id'] ?? '');
    if ($userId === '') return null;
    foreach (readJsonList($usersFile) as $user) {
        if ((string)($user['id'] ?? '') === $userId) return publicUser($user);
    }
    unset($_SESSION['user_id']);
    return null;
}

function publicUser(array $user): array
{
    return [
        'id' => (string)($user['id'] ?? ''),
        'phoneTail' => substr((string)($user['phone'] ?? ''), -4),
        'nickname' => (string)($user['nickname'] ?? '无名阵师'),
        'createdAt' => (string)($user['createdAt'] ?? ''),
        'lastLoginAt' => (string)($user['lastLoginAt'] ?? ''),
    ];
}

function findInviteIndex(array $invites, string $code): int
{
    foreach ($invites as $index => $invite) {
        if (strtoupper((string)($invite['code'] ?? '')) === $code) return $index;
    }
    return -1;
}

function normalizePhone(string $phone): string
{
    return preg_replace('/\D+/', '', $phone) ?? '';
}

function isValidPhone(string $phone): bool
{
    return preg_match('/^1[3-9]\d{9}$/', $phone) === 1;
}

function clientIp(): string
{
    $forwarded = (string)($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '');
    if ($forwarded !== '') {
        $first = trim(explode(',', $forwarded)[0]);
        if ($first !== '') return limitText($first, 45);
    }
    return limitText((string)($_SERVER['REMOTE_ADDR'] ?? ''), 45);
}

function ensureDataDir(string $dataDir): void
{
    if (!is_dir($dataDir) && !mkdir($dataDir, 0775, true) && !is_dir($dataDir)) {
        fail(500, 'Data directory unavailable');
    }
}

function readJsonList(string $file): array
{
    if (!is_file($file)) return [];
    $content = file_get_contents($file);
    if ($content === false || trim($content) === '') return [];
    $data = json_decode($content, true);
    return is_array($data) ? array_values(array_filter($data, 'is_array')) : [];
}

function writeJsonList(string $file, array $data): void
{
    $dir = dirname($file);
    ensureDataDir($dir);
    if (file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX) === false) {
        fail(500, 'Save failed');
    }
}

function limitText(string $value, int $length): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $length, 'UTF-8');
    }
    return substr($value, 0, $length * 3);
}

function fail(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
