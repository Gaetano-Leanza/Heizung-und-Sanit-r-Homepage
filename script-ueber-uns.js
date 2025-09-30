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
      const amount = cardWidth * 3;
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

  // Modal-Funktionalität
  const modal = document.createElement('div');
  modal.className = 'certificate-modal';
  modal.innerHTML = '<img src="" alt="Zertifikat vergrößert">';
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('img');

  // Alle Karten clickable machen
  document.querySelectorAll('.card, .card1, .card2').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if(img && img.src) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Modal schließen beim Klick auf Hintergrund
  modal.addEventListener('click', (e) => {
    if(e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ESC-Taste zum Schließen
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();