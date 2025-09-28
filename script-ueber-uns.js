 // Setup: hook arrow buttons to the correct track, compute scroll amount and update disabled state.
  (function(){
    const rows = document.querySelectorAll('.row');

    function updateButtons(track, prevBtn, nextBtn){
      // small tolerance for float comparison
      const maxScroll = track.scrollWidth - track.clientWidth;
      const pos = Math.round(track.scrollLeft);
      prevBtn.disabled = pos <= 2;
      nextBtn.disabled = pos >= Math.round(maxScroll) - 2;
    }

    function makeScrollHandler(track, direction){
      return () => {
        // Scroll by 80% of visible width (keeps results predictable across screen sizes)
        const amount = Math.round(track.clientWidth * 0.8);
        track.scrollBy({ left: direction === 'next' ? amount : -amount, behavior: 'smooth' });
      };
    }

    rows.forEach(row => {
      const prevBtn = row.querySelector('[data-action="prev"]');
      const nextBtn = row.querySelector('[data-action="next"]');
      const trackId = prevBtn.getAttribute('aria-controls') || nextBtn.getAttribute('aria-controls');
      const track = document.getElementById(trackId);

      if(!track || !prevBtn || !nextBtn) return;

      // click handlers
      prevBtn.addEventListener('click', makeScrollHandler(track, 'prev'));
      nextBtn.addEventListener('click', makeScrollHandler(track, 'next'));

      // keyboard: allow left/right arrow when track or buttons are focused
      track.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({left: -Math.round(track.clientWidth * 0.8), behavior:'smooth'}); }
        if(e.key === 'ArrowRight'){ e.preventDefault(); track.scrollBy({left:  Math.round(track.clientWidth * 0.8), behavior:'smooth'}); }
      });

      // Update disabled state on scroll
      track.addEventListener('scroll', () => updateButtons(track, prevBtn, nextBtn), { passive: true });

      // initial update (in case content width <= clientWidth)
      window.addEventListener('load', () => updateButtons(track, prevBtn, nextBtn));
      // also on resize recalc
      window.addEventListener('resize', () => updateButtons(track, prevBtn, nextBtn));
    });
  })();