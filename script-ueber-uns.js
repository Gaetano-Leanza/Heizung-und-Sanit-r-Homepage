(function(){
  const rows = document.querySelectorAll('.row');

  function updateButtons(track, prevBtn, nextBtn){
    // Buttons sind bei Endlos-Scrolling immer aktiv
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  function makeScrollHandler(track, direction){
    return () => {
      const card = track.querySelector('.card, .card1, .card2');
      if(!card) return;

      const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card).marginRight, 10);
      const amount = cardWidth * 1;
      const maxScroll = track.scrollWidth - track.clientWidth;
      const currentScroll = track.scrollLeft;

      if(direction === 'next') {
        // Prüfe ob wir nah am Ende sind BEVOR wir scrollen
        if(currentScroll + amount >= maxScroll - 5) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: amount, behavior: 'smooth' });
        }
      } else {
        // Prüfe ob wir nah am Anfang sind BEVOR wir scrollen
        if(currentScroll - amount <= 5) {
          track.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: -amount, behavior: 'smooth' });
        }
      }
    };
  }

  rows.forEach(row => {
    const prevBtn = row.querySelector('[data-action="prev"]');
    const nextBtn = row.querySelector('[data-action="next"]');
    const trackId = prevBtn.getAttribute('aria-controls') || nextBtn.getAttribute('aria-controls');
    const track = document.getElementById(trackId);

    if(!track || !prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', makeScrollHandler(track, 'prev'));
    nextBtn.addEventListener('click', makeScrollHandler(track, 'next'));

    track.addEventListener('scroll', () => updateButtons(track, prevBtn, nextBtn), { passive: true });

    window.addEventListener('load', () => updateButtons(track, prevBtn, nextBtn));
    window.addEventListener('resize', () => updateButtons(track, prevBtn, nextBtn));
  });

  // Modal-Funktionalität mit Navigation
  const modal = document.createElement('div');
  modal.className = 'certificate-modal';
  modal.innerHTML = `
    <button class="modal-nav-btn modal-prev" aria-label="Vorheriges Zertifikat">‹</button>
    <img src="" alt="Zertifikat vergrößert">
    <button class="modal-nav-btn modal-next" aria-label="Nächstes Zertifikat">›</button>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('img');
  const modalPrevBtn = modal.querySelector('.modal-prev');
  const modalNextBtn = modal.querySelector('.modal-next');
  
  let allCards = [];
  let currentCardIndex = 0;
  let currentRow = null;

  // Funktion zum Aktualisieren des Modals
  function updateModal(index) {
    if(allCards.length === 0) return;
    
    currentCardIndex = index;
    const card = allCards[currentCardIndex];
    const img = card.querySelector('img');
    
    if(img && img.src) {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
    }
  }

  // Navigation zur vorherigen Card
  function showPrevCard() {
    currentCardIndex = (currentCardIndex - 1 + allCards.length) % allCards.length;
    updateModal(currentCardIndex);
  }

  // Navigation zur nächsten Card
  function showNextCard() {
    currentCardIndex = (currentCardIndex + 1) % allCards.length;
    updateModal(currentCardIndex);
  }

  // Alle Karten clickable machen
  document.querySelectorAll('.card, .card1, .card2').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      // Finde die Row dieser Card
      currentRow = card.closest('.row');
      if(!currentRow) return;

      // Sammle alle Cards aus dieser Row
      allCards = Array.from(currentRow.querySelectorAll('.card, .card1, .card2'));
      
      // Finde den Index der geklickten Card
      currentCardIndex = allCards.indexOf(card);
      
      const img = card.querySelector('img');
      if(img && img.src) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Event-Listener für Modal-Navigation
  modalPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevCard();
  });

  modalNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextCard();
  });

  // Modal schließen beim Klick auf Hintergrund
  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Tastatur-Navigation
  document.addEventListener('keydown', (e) => {
    if(modal.classList.contains('active')) {
      if(e.key === 'Escape') {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      } else if(e.key === 'ArrowLeft') {
        showPrevCard();
      } else if(e.key === 'ArrowRight') {
        showNextCard();
      }
    }
  });
})();

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