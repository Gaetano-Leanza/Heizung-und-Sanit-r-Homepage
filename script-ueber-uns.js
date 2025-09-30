(function(){
  const rows = document.querySelectorAll('.row');

  function updateButtons(track, prevBtn, nextBtn){
    const maxScroll = track.scrollWidth - track.clientWidth;
    const pos = Math.round(track.scrollLeft);
    prevBtn.disabled = pos <= 2;
    nextBtn.disabled = pos >= Math.round(maxScroll) - 2;
  }

  function makeScrollHandler(track, direction){
    return () => {
      const card = track.querySelector('.card, .card1, .card2');
      if(!card) return;

      const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card).marginRight, 10);
      const amount = cardWidth * 3; // immer 3 Karten scrollen
      track.scrollBy({ 
        left: direction === 'next' ? amount : -amount, 
        behavior: 'smooth' 
      });
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
})();
