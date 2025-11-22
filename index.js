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

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Script gestartet");

  // Test ob localStorage verfügbar ist
  try {
    localStorage.setItem("test", "testWert");
    localStorage.removeItem("test");
    console.log("✅ localStorage ist verfügbar");
  } catch (e) {
    console.error("❌ localStorage ist NICHT verfügbar:", e);
  }

  // Aktuellen Status prüfen
  const currentConsent = localStorage.getItem("cookieConsent");
  console.log("📊 Aktueller cookieConsent-Status:", currentConsent);

  // Banner nur anzeigen, wenn noch keine Entscheidung gespeichert ist
  if (!currentConsent) {
    console.log(
      "ℹ️ Keine Cookie-Entscheidung gefunden - Banner wird angezeigt"
    );
    const banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.style.display = "block";
      console.log("✅ Banner angezeigt");
    } else {
      console.error("❌ Banner-Element nicht gefunden!");
    }
  } else {
    console.log("ℹ️ Cookie-Entscheidung bereits vorhanden:", currentConsent);
  }

  // Akzeptieren
  const acceptBtn = document.getElementById("cookie-accept");
  if (acceptBtn) {
    console.log("✅ Accept-Button gefunden");
    acceptBtn.addEventListener("click", function () {
      console.log("🟢 Accept-Button wurde geklickt");

      try {
        localStorage.setItem("cookieConsent", "accepted");
        const saved = localStorage.getItem("cookieConsent");
        console.log("💾 localStorage gespeichert:", saved);

        if (saved === "accepted") {
          console.log("✅ Speichern erfolgreich bestätigt");
        } else {
          console.error(
            "❌ Speichern fehlgeschlagen - Wert stimmt nicht überein"
          );
        }
      } catch (e) {
        console.error("❌ Fehler beim Speichern:", e);
      }

      const banner = document.getElementById("cookie-banner");
      if (banner) {
        banner.style.display = "none";
        console.log("✅ Banner ausgeblendet");
      }

      loadMap();
    });
  } else {
    console.error("❌ Accept-Button nicht gefunden!");
  }

  // Ablehnen
  const declineBtn = document.getElementById("cookie-decline");
  if (declineBtn) {
    console.log("✅ Decline-Button gefunden");
    declineBtn.addEventListener("click", function () {
      console.log("🔴 Decline-Button wurde geklickt");

      try {
        localStorage.setItem("cookieConsent", "declined");
        const saved = localStorage.getItem("cookieConsent");
        console.log("💾 localStorage gespeichert:", saved);

        if (saved === "declined") {
          console.log("✅ Speichern erfolgreich bestätigt");
        } else {
          console.error(
            "❌ Speichern fehlgeschlagen - Wert stimmt nicht überein"
          );
        }
      } catch (e) {
        console.error("❌ Fehler beim Speichern:", e);
      }

      const banner = document.getElementById("cookie-banner");
      if (banner) {
        banner.style.display = "none";
        console.log("✅ Banner ausgeblendet");
      }
    });
  } else {
    console.error("❌ Decline-Button nicht gefunden!");
  }

  // Map nur laden wenn bereits vorher zugestimmt wurde
  if (localStorage.getItem("cookieConsent") === "accepted") {
    console.log("🗺️ Cookie bereits akzeptiert - Karte wird geladen");
    loadMap();
  }

  function loadMap() {
    console.log("🗺️ loadMap() aufgerufen");
    const placeholder = document.getElementById("map-placeholder");

    if (!placeholder) {
      console.log(
        "ℹ️ Map-Placeholder nicht auf dieser Seite vorhanden (normal wenn nicht auf kontakt.html)"
      );
      return; // Einfach beenden, kein Fehler
    }

    console.log("✅ Map-Placeholder gefunden");

    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "450";
    iframe.style.border = "0";
    iframe.loading = "lazy";
    iframe.setAttribute("allowfullscreen", "");
    iframe.src =
      "https://maps.google.com/maps?q=Karl-Schneider-Stra%C3%9Fe+78224+Singen&z=17&output=embed";

    placeholder.replaceWith(iframe);
    console.log("✅ Karte wurde geladen");
  }
});
