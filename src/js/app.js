if (document.querySelector('.ham-menu')) {
   document.querySelector('.ham-menu').addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('opened');
      document.querySelector('.nav').classList.toggle('opened');

      document.querySelector('.nav').classList.contains('opened') && window.innerWidth <= 768 ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = 'auto');
   });
}
