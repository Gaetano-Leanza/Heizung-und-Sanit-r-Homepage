  function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const burger = document.getElementById("burger");

    navLinks.classList.toggle("show");

    if (navLinks.classList.contains("show")) {
      burger.innerHTML = "&times;"; // ✖
      burger.style.fontSize = "40px"; // 🔹 Größeres X
    } else {
      burger.innerHTML = "&#9776;"; // ☰
      burger.style.fontSize = "36px"; // 🔹 Zurück zur Normalgröße
    }
  }

  // Banner nur anzeigen, wenn noch keine Entscheidung gespeichert ist
  if (!localStorage.getItem('cookieConsent')) {
    document.getElementById('cookie-banner').style.display = "block";
  }

  // Akzeptieren
  document.getElementById('cookie-accept').addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookie-banner').style.display = "none";
    
    // Hier kannst du Scripts laden, die Cookies setzen dürfen:
    // loadAnalytics();
  });

  // Ablehnen
  document.getElementById('cookie-decline').addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookie-banner').style.display = "none";
  });