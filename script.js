/* ============================================================
   JMD AUTO CARE — Main JavaScript
   ============================================================ */

'use strict';

// ── Navbar scroll effect ──────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile hamburger menu ─────────────────────────────────────
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu      = document.getElementById('nav-menu');

hamburgerBtn.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburgerBtn.setAttribute('aria-expanded', isOpen);

  // Animate hamburger → X
  const spans = hamburgerBtn.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close menu when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    const spans = hamburgerBtn.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// ── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Scroll reveal animations ──────────────────────────────────
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ── Stagger children of grid containers ──────────────────────
function staggerChildren(parentSelector, childSelector, baseDelay = 0.1) {
  document.querySelectorAll(parentSelector).forEach(parent => {
    parent.querySelectorAll(childSelector).forEach((child, i) => {
      if (!child.style.transitionDelay) {
        child.style.transitionDelay = `${baseDelay * i}s`;
      }
    });
  });
}

staggerChildren('.services-grid', '.service-card', 0.08);
staggerChildren('.testimonials-grid', '.testimonial-card', 0.08);
staggerChildren('.packages-grid', '.package-card', 0.1);
staggerChildren('.why-grid', '.why-card', 0.08);

// ── Counter animation for hero stats ─────────────────────────
function animateCounter(el, target, suffix = '', duration = 1800) {
  const start     = performance.now();
  const startVal  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(startVal + eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Observe hero stats
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const statNumbers = heroStats.querySelectorAll('.stat-number');
      const data = [
        { target: 2.1, suffix: 'K+', isFloat: true },
        { target: 8,   suffix: '+',  isFloat: false },
        { target: 5,   suffix: '★',  isFloat: false },
        { target: 50,  suffix: '+',  isFloat: false },
      ];
      statNumbers.forEach((el, i) => {
        if (data[i]) {
          if (data[i].isFloat) {
            // Special case for 2.1K+
            let start = performance.now();
            const duration = 1800;
            function updateFloat(now) {
              const p = Math.min((now - start) / duration, 1);
              const e = 1 - Math.pow(1 - p, 3);
              const v = (e * 2.1).toFixed(1);
              el.innerHTML = v + '<span>' + data[i].suffix + '</span>';
              if (p < 1) requestAnimationFrame(updateFloat);
            }
            requestAnimationFrame(updateFloat);
          } else {
            // Save original HTML (has <span> inside)
            const span = el.querySelector('span');
            const spanContent = span ? span.outerHTML : '';
            animateCounter({ set: (v) => { el.innerHTML = v + spanContent; } }, data[i].target, '', 1800);
            // Override for simple integers
            let s = performance.now();
            const dur = 1800;
            function updateInt(now) {
              const p = Math.min((now - s) / dur, 1);
              const ee = 1 - Math.pow(1 - p, 3);
              const v = Math.floor(ee * data[i].target);
              el.innerHTML = v + '<span>' + data[i].suffix + '</span>';
              if (p < 1) requestAnimationFrame(updateInt);
            }
            requestAnimationFrame(updateInt);
          }
        }
      });
      statsObserver.unobserve(heroStats);
    }
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

// ── Contact form submission ───────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();

  const form    = document.getElementById('enquiry-form') || document.getElementById('booking-form');
  const success = document.getElementById('form-success');
  const btn     = document.getElementById('form-submit-btn');

  const name    = (document.getElementById('form-name')?.value || '').trim();
  const phone   = (document.getElementById('form-phone')?.value || '').trim();
  const message = (document.getElementById('form-message')?.value || '').trim();

  // Require name and phone at minimum
  if (!name || !phone) {
    shakeElement(btn);
    return;
  }

  // Build the WhatsApp message
  const waText = encodeURIComponent(
    `Hello JMD Auto Care! 👋\n\n` +
    `From: ${name}\n` +
    `Ph no: ${phone}\n` +
    (message ? `Message: ${message}` : '')
  );

  const waLink = `https://wa.me/917005299902?text=${waText}`;

  // Show success state instantly
  if (form)    form.style.display    = 'none';
  if (success) success.style.display = 'block';

  // Redirect to WhatsApp — works on both mobile and desktop
  window.location.href = waLink;
}

// Shake animation for invalid form
function shakeElement(el) {
  el.style.animation = 'none';
  el.style.transform = 'translateX(0)';

  let count = 0;
  const interval = setInterval(() => {
    count++;
    el.style.transform = count % 2 === 0 ? 'translateX(0)' : `translateX(${count % 4 === 1 ? -8 : 8}px)`;
    if (count >= 8) {
      clearInterval(interval);
      el.style.transform = '';
    }
  }, 60);
}

// ── Service card hover glow ───────────────────────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

// ── Active nav link highlight on scroll ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--text-primary)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Ticker duplication for seamless loop ─────────────────────
// Already handled via CSS, but ensure smooth restart
const ticker = document.querySelector('.ticker-track');
if (ticker) {
  // Pause on hover
  ticker.parentElement.addEventListener('mouseenter', () => {
    ticker.style.animationPlayState = 'paused';
  });
  ticker.parentElement.addEventListener('mouseleave', () => {
    ticker.style.animationPlayState = 'running';
  });
}

// ── Lazy load images ─────────────────────────────────────────
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

// ── Page load animation ───────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '1';

  // Trigger hero animations immediately
  document.querySelectorAll('.hero-content > *').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.1}s`;
  });
});

// ── Dynamic year in footer ────────────────────────────────────
const yearSpan = document.querySelector('.footer-copyright span');
// Already hardcoded but update if needed
