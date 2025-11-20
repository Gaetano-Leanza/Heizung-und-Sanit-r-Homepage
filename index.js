document.addEventListener("DOMContentLoaded", function () {

  function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const burger = document.getElementById("burger");

    navLinks.classList.toggle("show");

    if (navLinks.classList.contains("show")) {
      burger.innerHTML = "&times;";
      burger.style.fontSize = "40px";
    } else {
      burger.innerHTML = "&#9776;";
      burger.style.fontSize = "36px";
    }
  }

  // Banner nur anzeigen, wenn noch keine Entscheidung gespeichert ist
  if (!localStorage.getItem("cookieConsent")) {
    const banner = document.getElementById("cookie-banner");
    if (banner) banner.style.display = "block";
  }

  // Akzeptieren
  const acceptBtn = document.getElementById("cookie-accept");
  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("cookieConsent", "accepted");
      document.getElementById("cookie-banner").style.display = "none";
      loadMap();
    });
  }

  // Ablehnen
  const declineBtn = document.getElementById("cookie-decline");
  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      localStorage.setItem("cookieConsent", "declined");
      document.getElementById("cookie-banner").style.display = "none";
    });
  }

  // Map nur laden wenn bereits vorher zugestimmt wurde
  if (localStorage.getItem("cookieConsent") === "accepted") {
    loadMap();
  }

  function loadMap() {
    const placeholder = document.getElementById("map-placeholder");
    if (!placeholder) return;

    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "450";
    iframe.style.border = "0";
    iframe.loading = "lazy";
    iframe.setAttribute("allowfullscreen", "");
    iframe.src =
      "https://maps.google.com/maps?q=Karl-Schneider-Stra%C3%9Fe+78224+Singen&z=17&output=embed";

    placeholder.replaceWith(iframe);
  }

});
