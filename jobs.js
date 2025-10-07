   document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('open');
        const content = item.querySelector('.accordion-content');
        content.classList.toggle('open');
      });
    });

    document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("kontaktformular");
  const fields = form.querySelectorAll("input, textarea");

  fields.forEach((field) => {
    const error = field.parentElement.querySelector(".error-message");

    field.addEventListener("blur", () => {
      if (!field.checkValidity()) {
        error.classList.add("visible");
      } else {
        error.classList.remove("visible");
      }
    });

    field.addEventListener("input", () => {
      if (field.checkValidity()) {
        error.classList.remove("visible");
      }
    });
  });

  form.addEventListener("submit", function (e) {
    let valid = true;

    fields.forEach((field) => {
      const error = field.parentElement.querySelector(".error-message");
      if (!field.checkValidity()) {
        error.classList.add("visible");
        valid = false;
      }
    });

    if (!valid) e.preventDefault();
  });
});

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
