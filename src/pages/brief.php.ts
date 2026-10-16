import type { APIRoute } from 'astro';
import config from '../../site.config.mjs';

/*
  Generates /brief.php — the brief-form handler for PHP hosting (Hostinger).
  It emails the brief (with attached files) to contact.email and answers:
   - JSON {ok:true} for fetch() requests from the page (Accept: application/json)
   - a redirect to /thanks/ for plain no-JS form posts.
  Settings come from site.config.mjs at build time; nothing secret is stored here.
*/
export const GET: APIRoute = () => {
  const to = config.contact.email;
  const brand = config.brand.name;
  const maxBytes = config.form.maxTotalMB * 1024 * 1024;
  const host = config.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const php = `<?php
// Generated at build time from src/pages/brief.php.ts — edit that file, not this one.
declare(strict_types=1);

$TO = ${JSON.stringify(to)};
$BRAND = ${JSON.stringify(brand)};
$FROM = 'noreply@' . preg_replace('/^www\\./', '', $_SERVER['HTTP_HOST'] ?? ${JSON.stringify(host)});
$MAX_BYTES = ${maxBytes};
$ALLOWED = ['stl','step','stp','obj','3mf','svg','dxf','ai','pdf','jpg','jpeg','png'];

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
function done(bool $ok, string $msg, int $code = 200): void {
  global $wantsJson;
  if ($wantsJson) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode(['ok' => $ok, 'error' => $ok ? null : $msg]);
  } elseif ($ok) {
    header('Location: /thanks/', true, 303);
  } else {
    http_response_code($code);
    header('Content-Type: text/plain; charset=utf-8');
    echo $msg;
  }
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') done(false, 'Method not allowed', 405);
if ($TO === '') done(false, 'Form recipient is not configured', 503);
// Honeypot: bots fill hidden fields. Pretend success.
if (!empty($_POST['bot-field'])) done(true, '');

$clean = fn($v) => trim(str_replace(["\\r", "\\n"], ' ', (string)$v));
$name = $clean($_POST['name'] ?? '');
$email = $clean($_POST['email'] ?? '');
$desc = trim((string)($_POST['description'] ?? ''));
if ($name === '' || $desc === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($_POST['consent'])) {
  done(false, 'Missing required fields', 422);
}

$fields = [
  'Name' => $name, 'Email' => $email, 'Phone' => $_POST['phone'] ?? '', 'Company' => $_POST['company'] ?? '',
  'Stage' => $_POST['stage'] ?? '', 'Needs' => implode(', ', (array)($_POST['needs'] ?? [])),
  'Dimensions' => $_POST['dimensions'] ?? '', 'Quantity' => $_POST['quantity'] ?? '',
  'Desired date' => $_POST['desired-date'] ?? '', 'Budget' => $_POST['budget'] ?? '',
  'NDA' => $_POST['nda'] ?? '', 'Sent from' => $_POST['source-page'] ?? '',
];
$text = "New project brief\\n\\n";
foreach ($fields as $k => $v) { $text .= str_pad($k . ':', 14) . (is_string($v) ? trim($v) : '') . "\\n"; }
$text .= "\\nDescription:\\n" . $desc . "\\n";

// Attachments
$files = [];
$total = 0;
foreach ($_FILES as $f) {
  if (!is_array($f) || ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
  if ($f['error'] !== UPLOAD_ERR_OK) done(false, 'Upload failed', 400);
  $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
  if (!in_array($ext, $ALLOWED, true)) done(false, 'File type not allowed', 415);
  $total += (int)$f['size'];
  if ($total > $MAX_BYTES) done(false, 'Files too large', 413);
  $files[] = ['name' => preg_replace('/[^A-Za-z0-9._ -]/', '_', basename($f['name'])), 'data' => file_get_contents($f['tmp_name'])];
}

$boundary = 'b' . bin2hex(random_bytes(12));
$headers = [
  'From: ' . $BRAND . ' <' . $FROM . '>',
  'Reply-To: ' . $name . ' <' . $email . '>',
  'MIME-Version: 1.0',
  'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
];
$body = "--$boundary\\r\\nContent-Type: text/plain; charset=UTF-8\\r\\nContent-Transfer-Encoding: 8bit\\r\\n\\r\\n" . $text . "\\r\\n";
foreach ($files as $f) {
  $body .= "--$boundary\\r\\nContent-Type: application/octet-stream; name=\\"{$f['name']}\\"\\r\\n"
    . "Content-Transfer-Encoding: base64\\r\\nContent-Disposition: attachment; filename=\\"{$f['name']}\\"\\r\\n\\r\\n"
    . chunk_split(base64_encode($f['data'])) . "\\r\\n";
}
$body .= "--$boundary--";

$subject = '=?UTF-8?B?' . base64_encode('New brief: ' . $name) . '?=';
$ok = mail($TO, $subject, $body, implode("\\r\\n", $headers), '-f' . $FROM);
done($ok, $ok ? '' : 'Mail could not be sent', $ok ? 200 : 500);
`;
  return new Response(php, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
