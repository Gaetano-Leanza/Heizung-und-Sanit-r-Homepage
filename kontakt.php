<?php
// === 1. Sicherheit: nur POST-Anfragen akzeptieren ===
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Ungültige Anfrage.");
}

// === 2. Eingabedaten abholen und bereinigen ===
$vorname   = trim($_POST["vorname"] ?? "");
$nachname  = trim($_POST["nachname"] ?? "");
$telefon   = trim($_POST["telefon"] ?? "");
$email     = trim($_POST["email"] ?? "");
$mitteilung = trim($_POST["mitteilung"] ?? "");
$captchaResponse = $_POST["g-recaptcha-response"] ?? "";

// === 3. Validierung ===
$errors = [];

if (strlen($vorname) < 3)        $errors[] = "Vorname ist zu kurz.";
if (strlen($nachname) < 3)       $errors[] = "Nachname ist zu kurz.";
if (!preg_match("/^[\d\s+\-]{6,}$/", $telefon)) $errors[] = "Telefonnummer ist ungültig.";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "E-Mail ist ungültig.";
if (strlen($mitteilung) < 5)     $errors[] = "Mitteilung ist zu kurz.";

// === 4. reCAPTCHA prüfen ===
// ⚠️ Ersetze den Platzhalter durch deinen echten Secret Key
$secretKey = "DEIN-SECRET-KEY";

if (empty($captchaResponse)) {
    $errors[] = "Bitte bestätige, dass du kein Roboter bist.";
} else {
    $verify = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret=" .
        urlencode($secretKey) . "&response=" . urlencode($captchaResponse)
    );
    $captchaData = json_decode($verify);
    if (empty($captchaData->success)) {
        $errors[] = "Die reCAPTCHA-Überprüfung ist fehlgeschlagen.";
    }
}

// === 5. Fehler prüfen ===
if (!empty($errors)) {
    http_response_code(400);
    echo "<h3>Fehler:</h3><ul>";
    foreach ($errors as $err) {
        echo "<li>" . htmlspecialchars($err) . "</li>";
    }
    echo "</ul><p><a href='javascript:history.back()'>Zurück</a></p>";
    exit;
}

// === 6. Wenn alles ok ist: Mail versenden oder speichern ===
// Hier kannst du die Daten weiterverarbeiten – z. B. per E-Mail senden

$empfaenger = "deine@mailadresse.de"; // <– hier deine E-Mail-Adresse eintragen
$betreff = "Neue Kontaktanfrage von $vorname $nachname";
$nachricht = "
Vorname: $vorname
Nachname: $nachname
Telefon: $telefon
E-Mail: $email

Mitteilung:
$mitteilung
";

$headers = "From: $email\r\nReply-To: $email\r\n";

if (mail($empfaenger, $betreff, $nachricht, $headers)) {
    echo "<h2>Vielen Dank, $vorname!</h2>";
    echo "<p>Deine Nachricht wurde erfolgreich gesendet.</p>";
} else {
    http_response_code(500);
    echo "<p>Fehler beim Senden der Nachricht. Bitte versuche es später erneut.</p>";
}
?>
