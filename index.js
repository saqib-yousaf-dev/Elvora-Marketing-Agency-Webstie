
  // Fade-up on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Navbar shrink
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    nav.style.padding = window.scrollY > 60 ? '10px 0' : '18px 0';
  });