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