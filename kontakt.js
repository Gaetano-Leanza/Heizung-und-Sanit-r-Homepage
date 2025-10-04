document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("kontaktformular");

  // Alle Input- und Textarea-Felder auswählen
  const fields = form.querySelectorAll("input, textarea");

  fields.forEach((field) => {
    const error = field.parentElement.querySelector(".error-message");

    // Prüfen, sobald das Feld verlassen wird
    field.addEventListener("blur", () => {
      if (!field.checkValidity()) {
        error.classList.add("visible");
      } else {
        error.classList.remove("visible");
      }
    });

    // Optional: beim Tippen die Meldung live ausblenden
    field.addEventListener("input", () => {
      if (field.checkValidity()) {
        error.classList.remove("visible");
      }
    });
  });

  // Absenden weiterhin validieren
  form.addEventListener("submit", function (e) {
    let valid = true;

    fields.forEach((field) => {
      const error = field.parentElement.querySelector(".error-message");
      if (!field.checkValidity()) {
        error.classList.add("visible");
        valid = false;
      }
    });

    if (!valid) e.preventDefault(); // Formular nicht absenden
  });
});
