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
$profilesFile = $dataDir . '/player-data.json';
const DECK_MIN = 30;
const DECK_MAX = 50;
const DECK_MAX_COPIES = 3;
const DECK_MIN_EYE = 1;
const DECK_MIN_PER_ELEMENT = 3;
const DECK_ELEMENTS = ['wood', 'fire', 'earth', 'metal', 'water'];

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

if ($action === 'playerStatus') {
    $userId = currentUserIdRaw($usersFile);
    if ($userId === '') fail(401, '需要先登录');
    $profiles = readProfiles($profilesFile);
    $profile = ensurePlayerProfile($profiles, $userId, $payload);
    writeProfiles($profilesFile, $profiles);
    echo json_encode(['profile' => publicPlayerProfile($profile)], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($action === 'awardVictory') {
    $userId = currentUserIdRaw($usersFile);
    if ($userId === '') fail(401, '需要先登录');
    $profiles = readProfiles($profilesFile);
    $profile = ensurePlayerProfile($profiles, $userId, $payload);
    $profile['stones'] = max(0, (int)($profile['stones'] ?? 0)) + 100;
    $profile['wins'] = max(0, (int)($profile['wins'] ?? 0)) + 1;
    $profile['updatedAt'] = gmdate('c');
    $profiles[$userId] = $profile;
    writeProfiles($profilesFile, $profiles);
    echo json_encode(['profile' => publicPlayerProfile($profile), 'reward' => 100], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($action === 'buyBooster') {
    $userId = currentUserIdRaw($usersFile);
    if ($userId === '') fail(401, '需要先登录');
    $profiles = readProfiles($profilesFile);
    $profile = ensurePlayerProfile($profiles, $userId, $payload);
    $cards = $payload['cards'] ?? [];
    if (!is_array($cards) || count($cards) !== 5) fail(422, '卡包必须包含 5 张卡');
    if ((int)($profile['stones'] ?? 0) < 100) fail(422, '灵石不足');

    $profile['stones'] = (int)$profile['stones'] - 100;
    foreach ($cards as $card) {
        $key = playerCardKey($card);
        if ($key === '') fail(422, '卡牌数据不完整');
        $profile['collection'][$key] = max(0, (int)($profile['collection'][$key] ?? 0)) + 1;
    }
    $profile['packsOpened'] = max(0, (int)($profile['packsOpened'] ?? 0)) + 1;
    $profile['updatedAt'] = gmdate('c');
    $profiles[$userId] = $profile;
    writeProfiles($profilesFile, $profiles);
    echo json_encode(['profile' => publicPlayerProfile($profile), 'cards' => $cards], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($action === 'saveDeck') {
    $userId = currentUserIdRaw($usersFile);
    if ($userId === '') fail(401, '需要先登录');
    $profiles = readProfiles($profilesFile);
    $profile = ensurePlayerProfile($profiles, $userId, $payload);
    $deck = normalizeCountMap($payload['deck'] ?? []);
    $issues = validateDeck($deck, is_array($profile['collection'] ?? null) ? $profile['collection'] : []);
    if ($issues) fail(422, implode('；', $issues));
    $profile['deck'] = $deck;
    $profile['updatedAt'] = gmdate('c');
    $profiles[$userId] = $profile;
    writeProfiles($profilesFile, $profiles);
    echo json_encode(['profile' => publicPlayerProfile($profile)], JSON_UNESCAPED_UNICODE);
    exit;
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

function currentUserIdRaw(string $usersFile): string
{
    $userId = (string)($_SESSION['user_id'] ?? '');
    if ($userId === '') return '';
    foreach (readJsonList($usersFile) as $user) {
        if ((string)($user['id'] ?? '') === $userId) return $userId;
    }
    unset($_SESSION['user_id']);
    return '';
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

function ensurePlayerProfile(array &$profiles, string $userId, array $payload): array
{
    $profile = is_array($profiles[$userId] ?? null) ? $profiles[$userId] : [];
    $changed = false;
    if (!isset($profile['stones'])) {
        $profile['stones'] = 100;
        $changed = true;
    }
    if (!isset($profile['wins'])) {
        $profile['wins'] = 0;
        $changed = true;
    }
    if (!isset($profile['packsOpened'])) {
        $profile['packsOpened'] = 0;
        $changed = true;
    }
    if (!isset($profile['collection']) || !is_array($profile['collection']) || count($profile['collection']) === 0) {
        $initialCards = $payload['initialCards'] ?? [];
        $collection = [];
        if (is_array($initialCards)) {
            foreach ($initialCards as $card) {
                $key = playerCardKey($card);
                if ($key !== '') $collection[$key] = ($collection[$key] ?? 0) + 1;
            }
        }
        $profile['collection'] = $collection;
        $profile['createdAt'] = (string)($profile['createdAt'] ?? gmdate('c'));
        $changed = true;
    }
    if (!isset($profile['deck']) || !is_array($profile['deck']) || count($profile['deck']) === 0) {
        $defaultDeck = normalizeCountMap($payload['defaultDeck'] ?? []);
        $collection = is_array($profile['collection'] ?? null) ? $profile['collection'] : [];
        $issues = validateDeck($defaultDeck, $collection);
        $profile['deck'] = $issues ? buildFallbackDeck($collection) : $defaultDeck;
        $changed = true;
    }
    if ($changed) {
        $profile['updatedAt'] = gmdate('c');
        $profiles[$userId] = $profile;
    }
    return $profile;
}

function playerCardKey($card): string
{
    if (!is_array($card)) return '';
    $element = preg_replace('/[^a-z]/', '', (string)($card['element'] ?? ''));
    $name = trim((string)($card['name'] ?? ''));
    if ($element === '' || $name === '') return '';
    return $element . ':' . limitText($name, 40);
}

function normalizeCountMap($map): array
{
    if (!is_array($map)) return [];
    $normalized = [];
    foreach ($map as $key => $count) {
        $safeKey = trim((string)$key);
        if (!preg_match('/^[a-z]+:.+$/', $safeKey)) continue;
        $amount = max(0, (int)$count);
        if ($amount > 0) $normalized[$safeKey] = $amount;
    }
    return $normalized;
}

function validateDeck(array $deck, array $collection): array
{
    $issues = [];
    $total = array_sum(array_map('intval', $deck));
    if ($total < DECK_MIN) $issues[] = '卡组至少 ' . DECK_MIN . ' 张';
    if ($total > DECK_MAX) $issues[] = '卡组最多 ' . DECK_MAX . ' 张';
    $eyeCount = 0;
    $elementCounts = array_fill_keys(DECK_ELEMENTS, 0);
    foreach ($deck as $key => $count) {
        $amount = (int)$count;
        $owned = (int)($collection[$key] ?? 0);
        if ($owned <= 0) $issues[] = '包含未拥有卡牌';
        if ($amount > $owned) $issues[] = '卡组数量超过收藏';
        if ($amount > DECK_MAX_COPIES) $issues[] = '同名最多 ' . DECK_MAX_COPIES . ' 张';
        [$element, $name] = explode(':', (string)$key, 2);
        if (in_array($element, DECK_ELEMENTS, true)) $elementCounts[$element] += $amount;
        if (strpos($name, '玄门') !== false || strpos($name, '朝元') !== false || strpos($name, '剑台') !== false || strpos($name, '灵坛') !== false || strpos($name, '水府') !== false) {
            $eyeCount += $amount;
        }
    }
    if ($eyeCount < DECK_MIN_EYE) $issues[] = '阵眼至少 ' . DECK_MIN_EYE . ' 张';
    foreach (DECK_ELEMENTS as $element) {
        if (($elementCounts[$element] ?? 0) < DECK_MIN_PER_ELEMENT) {
            $issues[] = $element . ' 系至少 ' . DECK_MIN_PER_ELEMENT . ' 张';
        }
    }
    return array_values(array_unique($issues));
}

function buildFallbackDeck(array $collection): array
{
    $deck = [];
    foreach ($collection as $key => $count) {
        if (array_sum($deck) >= DECK_MIN) break;
        $deck[$key] = min((int)$count, DECK_MAX_COPIES, DECK_MIN - array_sum($deck));
    }
    return $deck;
}

function publicPlayerProfile(array $profile): array
{
    return [
        'stones' => max(0, (int)($profile['stones'] ?? 0)),
        'wins' => max(0, (int)($profile['wins'] ?? 0)),
        'packsOpened' => max(0, (int)($profile['packsOpened'] ?? 0)),
        'collection' => is_array($profile['collection'] ?? null) ? $profile['collection'] : [],
        'deck' => is_array($profile['deck'] ?? null) ? $profile['deck'] : [],
        'updatedAt' => (string)($profile['updatedAt'] ?? ''),
    ];
}

function readProfiles(string $file): array
{
    if (!is_file($file)) return [];
    $content = file_get_contents($file);
    if ($content === false || trim($content) === '') return [];
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function writeProfiles(string $file, array $data): void
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
