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

    // Datei-Upload verarbeiten
    $dateien = [];
    $erlaubte_typen = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    $max_dateigroesse = 5 * 1024 * 1024; // 5 MB

    if (isset($_FILES['dateien']) && !empty($_FILES['dateien']['name'][0])) {
        foreach ($_FILES['dateien']['tmp_name'] as $key => $tmp_name) {
            if ($_FILES['dateien']['error'][$key] === UPLOAD_ERR_OK) {
                $datei_name = $_FILES['dateien']['name'][$key];
                $datei_typ = $_FILES['dateien']['type'][$key];
                $datei_groesse = $_FILES['dateien']['size'][$key];
                
                // Validierung der Datei
                if (!in_array($datei_typ, $erlaubte_typen)) {
                    $errors[] = "Ungültiger Dateityp: $datei_name";
                    continue;
                }
                
                if ($datei_groesse > $max_dateigroesse) {
                    $errors[] = "Datei zu groß: $datei_name (max. 5 MB)";
                    continue;
                }
                
                // Datei einlesen
                $datei_inhalt = file_get_contents($tmp_name);
                $dateien[] = [
                    'name' => $datei_name,
                    'type' => $datei_typ,
                    'content' => $datei_inhalt
                ];
            }
        }
    }

    // Wenn keine Fehler, E-Mail versenden
    if (empty($errors)) {
        $absender = "kontakt@hegau-haustechnik.de";
        $empfaenger = "info@hegau-haustechnik.de";
        $betreff = "Neue Bewerbung von $vorname $nachname";

        // Boundary für Multipart-E-Mail
        $boundary = md5(time());

        // Header für E-Mail mit Anhängen
        $headers = "From: $absender\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

        // E-Mail-Body beginnen
        $nachricht = "--$boundary\r\n";
        $nachricht .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $nachricht .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        
        $nachricht .= "Neue Bewerbung:\n\n";
        $nachricht .= "Vorname: $vorname\n";
        $nachricht .= "Nachname: $nachname\n";
        $nachricht .= "Telefon: $telefon\n";
        $nachricht .= "E-Mail: $email\n\n";
        
        if (count($dateien) > 0) {
            $nachricht .= "Anzahl hochgeladener Dateien: " . count($dateien) . "\n\n";
        }

        // Anhänge hinzufügen
        foreach ($dateien as $datei) {
            $datei_inhalt_encoded = chunk_split(base64_encode($datei['content']));
            
            $nachricht .= "--$boundary\r\n";
            $nachricht .= "Content-Type: {$datei['type']}; name=\"{$datei['name']}\"\r\n";
            $nachricht .= "Content-Transfer-Encoding: base64\r\n";
            $nachricht .= "Content-Disposition: attachment; filename=\"{$datei['name']}\"\r\n\r\n";
            $nachricht .= $datei_inhalt_encoded . "\r\n";
        }

        // Boundary abschließen
        $nachricht .= "--$boundary--";

        // E-Mail senden
        if (mail($empfaenger, $betreff, $nachricht, $headers)) {
            // Erfolg - Modal anzeigen
            echo '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bewerbung gesendet</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .modal {
            background: white;
            width: 310px;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .success-icon {
            width: 60px;
            height: 60px;
            background-color: #51b9ea;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px;
        }
        
        .success-icon::after {
            content: "✓";
            color: white;
            font-size: 36px;
            font-weight: bold;
        }
        
        .modal h2 {
            color: #333;
            margin-bottom: 10px;
            font-size: 22px;
        }
        
        .modal p {
            color: #666;
            margin-bottom: 25px;
            line-height: 1.5;
        }
        
        .modal button {
            background-color: #51b9ea;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        
        .modal button:hover {
            background-color: #39a5d5;
    </style>
</head>
<body>
    <div class="modal-overlay">
        <div class="modal">
            <div class="success-icon"></div>
            <h2>Erfolgreich versendet!</h2>
            <p>Vielen Dank für Ihre Bewerbung. Wir werden uns schnellstmöglich bei Ihnen melden.</p>
            <button onclick="window.history.back()">Zurück</button>
        </div>
    </div>
</body>
</html>';
            exit();
        } else {
            echo '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fehler</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .modal {
            background: white;
            width: 310px;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            text-align: center;
        }
        
        .error-icon {
            width: 60px;
            height: 60px;
            background-color: #f44336;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px;
        }
        
        .error-icon::after {
            content: "✕";
            color: white;
            font-size: 36px;
            font-weight: bold;
        }
        
        .modal h2 {
            color: #333;
            margin-bottom: 10px;
            font-size: 22px;
        }
        
        .modal p {
            color: #666;
            margin-bottom: 25px;
            line-height: 1.5;
        }
        
        .modal button {
            background-color: #51b9ea;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        
        .modal button:hover {
            background-color: #39a5d5;
        }
    </style>
</head>
<body>
    <div class="modal-overlay">
        <div class="modal">
            <div class="error-icon"></div>
            <h2>Fehler beim Versenden</h2>
            <p>Die E-Mail konnte nicht versendet werden. Bitte versuchen Sie es später erneut.</p>
            <button onclick="window.history.back()">Zurück</button>
        </div>
    </div>
</body>
</html>';
            exit();
        }
    } else {
        // Fehler anzeigen
        echo '<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validierungsfehler</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .modal {
            background: white;
            width: 310px;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            text-align: center;
        }
        
        .error-icon {
            width: 60px;
            height: 60px;
            background-color: #ff9800;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto 20px;
        }
        
        .error-icon::after {
            content: "!";
            color: white;
            font-size: 36px;
            font-weight: bold;
        }
        
        .modal h2 {
            color: #333;
            margin-bottom: 15px;
            font-size: 22px;
        }
        
        .modal ul {
            text-align: left;
            margin-bottom: 25px;
            padding-left: 20px;
        }
        
        .modal li {
            color: #666;
            margin-bottom: 8px;
            line-height: 1.4;
        }
        
        .modal button {
            background-color: #ff9800;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        
        .modal button:hover {
            background-color: #e68900;
        }
    </style>
</head>
<body>
    <div class="modal-overlay">
        <div class="modal">
            <div class="error-icon"></div>
            <h2>Validierungsfehler</h2>
            <ul>';
        foreach ($errors as $error) {
            echo "<li>" . htmlspecialchars($error) . "</li>";
        }
        echo '</ul>
            <button onclick="window.history.back()">Zurück</button>
        </div>
    </div>
</body>
</html>';
        exit();
    }

} else {
    // Wenn nicht per POST aufgerufen, zurück zur Startseite
    header("Location: index.html");
    exit();
}
?>