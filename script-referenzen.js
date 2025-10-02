(function(){
  const rows = document.querySelectorAll('.row');

  function updateButtons(track, prevBtn, nextBtn){
    // Buttons bleiben aktiv (Endlos-Scroll)
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  // robuste Gap-Ermittlung (fallbacks für verschiedene Browser)
  function getGap(track){
    const cs = getComputedStyle(track);
    // try several properties, then parseFloat, fallback 0
    const gapStr =
      cs.getPropertyValue('gap') ||
      cs.getPropertyValue('column-gap') ||
      cs.getPropertyValue('grid-column-gap') ||
      cs.getPropertyValue('grid-gap') ||
      cs.getPropertyValue('row-gap') ||
      '0px';
    return parseFloat(gapStr) || 0;
  }

  // scroll handler, springt immer genau 3 Karten (mit Wrap-around)
  function makeScrollHandler(track, direction){
    return () => {
      const items = Array.from(track.querySelectorAll('.card, .card1, .card2'));
      if(items.length === 0) return;

      // Breite einer Karte (inkl. Padding/Border) + gap
      const item = items[0];
      const itemWidth = item.offsetWidth; // includes padding/border
      const gap = getGap(track);
      const step = itemWidth + gap;

      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      const currentScroll = track.scrollLeft;

      // index der aktuell links sichtbaren Karte (runden verhindert kleine floating point-Fehler)
      let currentIndex = Math.round(currentScroll / step);

      if(direction === 'next') {
        const desiredIndex = currentIndex + 3;

        // Wenn desiredIndex weiter rechts als möglich ist -> wrap to start
        if(desiredIndex * step > maxScroll + 1) {
          // Endlos: zurück an den Anfang
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const newScroll = desiredIndex * step;
          track.scrollTo({ left: Math.max(0, Math.min(newScroll, maxScroll)), behavior: 'smooth' });
        }
      } else {
        const desiredIndex = currentIndex - 3;

        // Wenn wir vor dem Anfang wären -> wrap to last possible aligned position (rechtes Ende)
        if(desiredIndex < 0) {
          // rechte Ausrichtung: letzter Index, der noch links ausgerichtet werden kann
          const lastIndex = Math.floor(maxScroll / step);
          track.scrollTo({ left: lastIndex * step, behavior: 'smooth' });
        } else {
          const newScroll = desiredIndex * step;
          track.scrollTo({ left: Math.max(0, Math.min(newScroll, maxScroll)), behavior: 'smooth' });
        }
      }
    };
  }

  rows.forEach(row => {
    const prevBtn = row.querySelector('[data-action="prev"]');
    const nextBtn = row.querySelector('[data-action="next"]');
    const trackId = (prevBtn && prevBtn.getAttribute('aria-controls')) || (nextBtn && nextBtn.getAttribute('aria-controls'));
    const track = trackId ? document.getElementById(trackId) : null;

    if(!track || !prevBtn || !nextBtn) return;

    prevBtn.addEventListener('click', makeScrollHandler(track, 'prev'));
    nextBtn.addEventListener('click', makeScrollHandler(track, 'next'));

    track.addEventListener('scroll', () => updateButtons(track, prevBtn, nextBtn), { passive: true });

    window.addEventListener('load', () => updateButtons(track, prevBtn, nextBtn));
    window.addEventListener('resize', () => updateButtons(track, prevBtn, nextBtn));
  });

  /* ---------- Modal-Teil (unchanged) ---------- */
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

  function showPrevCard() {
    currentCardIndex = (currentCardIndex - 1 + allCards.length) % allCards.length;
    updateModal(currentCardIndex);
  }

  function showNextCard() {
    currentCardIndex = (currentCardIndex + 1) % allCards.length;
    updateModal(currentCardIndex);
  }

  document.querySelectorAll('.card, .card1, .card2').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      currentRow = card.closest('.row');
      if(!currentRow) return;
      allCards = Array.from(currentRow.querySelectorAll('.card, .card1, .card2'));
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

  modalPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevCard(); });
  modalNextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextCard(); });

  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

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
