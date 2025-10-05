   document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('open');
        const content = item.querySelector('.accordion-content');
        content.classList.toggle('open');
      });
    });