<?php
// Fehlerbehandlung aktivieren
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Prüfen ob das Formular per POST gesendet wurde
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Formulardaten abrufen und bereinigen
    $vorname = htmlspecialchars(trim($_POST['vorname'] ?? ''));
    $nachname = htmlspecialchars(trim($_POST['nachname'] ?? ''));
    $telefon = htmlspecialchars(trim($_POST['telefon'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $mitteilung = htmlspecialchars(trim($_POST['mitteilung'] ?? ''));
    
    // Validierung
    $errors = [];
    
    if (empty($vorname) || !preg_match('/^[A-Za-zÄÖÜäöüß]{3,}$/', $vorname)) {
        $errors[] = "Ungültiger Vorname";
    }
    
    if (empty($nachname) || !preg_match('/^[A-Za-zÄÖÜäöüß]{3,}$/', $nachname)) {
        $errors[] = "Ungültiger Nachname";
    }
    
    if (empty($telefon) || !preg_match('/^[\d\s+\-]{6,}$/', $telefon)) {
        $errors[] = "Ungültige Telefonnummer";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Ungültige E-Mail-Adresse";
    }
    
    if (empty($mitteilung)) {
        $errors[] = "Mitteilung fehlt";
    }
    
    // Wenn keine Fehler, E-Mail versenden
    if (empty($errors)) {
        // WICHTIG: Verwende eine E-Mail-Adresse deiner Domain!
        // z.B. kontakt@deine-domain.de oder info@deine-domain.de
        $absender = "kontakt@leanza-hijab.store";
        $empfaenger = "info@hegau-haustechnik.de";
        
        $betreff = "Neue Kontaktanfrage von $vorname $nachname";
        
        $nachricht = "Neue Kontaktanfrage:

Vorname: $vorname
Nachname: $nachname
Telefon: $telefon
E-Mail: $email

Mitteilung:
$mitteilung
";
        
        // Header für United Domains optimiert
        $headers = "From: $absender\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        
        // E-Mail senden
        if (mail($empfaenger, $betreff, $nachricht, $headers)) {
            // Erfolg - Weiterleitung zur Danke-Seite
            header("Location: danke.html");
            exit();
        } else {
            echo "Fehler beim Versenden der E-Mail. Bitte versuche es später erneut.";
        }
    } else {
        // Fehler anzeigen
        echo "<h3>Folgende Fehler sind aufgetreten:</h3>";
        echo "<ul>";
        foreach ($errors as $error) {
            echo "<li>$error</li>";
        }
        echo "</ul>";
        echo '<a href="javascript:history.back()">Zurück zum Formular</a>';
    }
    
} else {
    // Wenn nicht per POST aufgerufen, zurück zur Startseite
    header("Location: index.html");
    exit();
}
?>