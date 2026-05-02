

/* ── 2. NAVBAR: shrink on scroll + active link highlight ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Active nav link
  const sections = document.querySelectorAll('section[id], div[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active-link');
  });
});


/* ── 3. INTERSECTION OBSERVER — scroll reveal ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => revealObs.observe(el));


/* ── 4. COUNTER ANIMATION ── */
function animateCounter(el, target, suffix = '', duration = 1800) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const value = Math.floor(eased * target);
    el.textContent = value.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const raw    = el.dataset.target;        // e.g. "350", "12000", "8.4", "97"
    const suffix = el.dataset.suffix || '';  // "+", "x", "%"
    const isFloat = raw.includes('.');

    if (isFloat) {
      // animate float
      let start = null;
      const target = parseFloat(raw);
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1800, 1);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = (eased * target).toFixed(1) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } else {
      animateCounter(el, parseInt(raw, 10), suffix);
    }
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));


/* ── 5. HERO TEXT SPLIT ANIMATION ── */
function splitAndAnimate(el) {
  if (!el) return;
  const lines = el.innerHTML.split('<br>');
  el.innerHTML = lines.map((line, li) =>
    line.split('').map((ch, ci) => {
      // preserve existing <span> wrappers
      if (ch === '<') return ch;
      const delay = (li * 100 + ci * 35) + 'ms';
      return ch === ' '
        ? ' '
        : `<span class="char" style="animation-delay:${delay}">${ch}</span>`;
    }).join('')
  ).join('<br>');
}
splitAndAnimate(document.querySelector('.hero h1'));


/* ── 6. PARALLAX on hero bg ── */
window.addEventListener('scroll', () => {
  const bg = document.querySelector('.hero-bg-img');
  if (bg) bg.style.transform = `scale(1.06) translateY(${window.scrollY * 0.18}px)`;
});


/* ── 7. MAGNETIC BUTTON EFFECT ── */
document.querySelectorAll('.btn-gold, .btn-outline-gold').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width  / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});


/* ── 8. SERVICE CARD TILT (3D perspective) ── */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .6s cubic-bezier(.25,.46,.45,.94)';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform .1s ease';
  });
});


/* ── 9. TESTIMONIAL CARD TILT ── */
document.querySelectorAll('.testi-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    card.style.transition = 'transform .1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .6s cubic-bezier(.25,.46,.45,.94)';
  });
});


/* ── 10. GOLD SHIMMER on section tags ── */
document.querySelectorAll('.section-tag').forEach(tag => {
  tag.style.backgroundImage = 'linear-gradient(90deg, #C9A84C 0%, #E8C97A 40%, #C9A84C 80%)';
  tag.style.backgroundSize  = '200%';
  tag.style.webkitBackgroundClip = 'text';
  tag.style.webkitTextFillColor  = 'transparent';
  tag.style.backgroundClip = 'text';
  tag.style.animation = 'shimmer 3s linear infinite';
});

const shimmerStyle = document.createElement('style');
shimmerStyle.textContent = `
  @keyframes shimmer { to { background-position: 200% center; } }
  .active-link { color: var(--gold) !important; }
  .active-link::after { transform: scaleX(1) !important; }
`;
document.head.appendChild(shimmerStyle);


/* ── 11. DASHBOARD BARS re-trigger on scroll ── */
const dashObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.cbar, .sparkline-bar').forEach(b => {
      b.style.animation = 'none';
      b.offsetHeight; // reflow
      b.style.animation = '';
    });
    dashObs.unobserve(e.target);
  });
}, { threshold: 0.3 });

const dashWrap = document.querySelector('.process-visual');
if (dashWrap) dashObs.observe(dashWrap);


/* ── 12. SMOOTH SCROLL for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ── 13. PAGE LOAD entrance animation ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .6s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});


/* ── 14. FOOTER links stagger ── */
const footerLinkObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('li').forEach((li, i) => {
      li.style.opacity = '0';
      li.style.transform = 'translateX(-14px)';
      setTimeout(() => {
        li.style.transition = 'opacity .5s ease, transform .5s ease';
        li.style.opacity = '1';
        li.style.transform = '';
      }, i * 60);
    });
    footerLinkObs.unobserve(e.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.footer-links').forEach(ul => footerLinkObs.observe(ul));

