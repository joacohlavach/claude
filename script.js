'use strict';

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Material cards toggle
document.querySelectorAll('.material-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('active');
  });
});

// Search interaction
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const searchHint = document.getElementById('searchHint');

const mockPoints = [
  { name: 'EcoVerde Palermo', distance: '320 m', accepts: ['Plástico', 'Vidrio', 'Papel'] },
  { name: 'Punto Verde Almagro', distance: '510 m', accepts: ['Papel', 'Metal', 'Cartón'] },
  { name: 'Reciclaje Caballito', distance: '780 m', accepts: ['Electrónicos', 'Plástico'] },
];

function showResult() {
  const address = searchInput.value.trim();
  if (!address) {
    searchHint.textContent = 'Por favor ingresá una dirección.';
    searchHint.style.color = '#ef4444';
    return;
  }
  searchHint.style.color = 'var(--green-600)';
  searchHint.textContent = '🔍 Buscando puntos cercanos…';

  setTimeout(() => {
    const point = mockPoints[Math.floor(Math.random() * mockPoints.length)];
    searchHint.textContent = `✅ Punto más cercano: ${point.name} — a ${point.distance} · Acepta: ${point.accepts.join(', ')}`;
  }, 900);
}

searchBtn.addEventListener('click', showResult);
searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') showResult(); });

locationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    searchHint.textContent = 'Tu navegador no soporta geolocalización.';
    searchHint.style.color = '#ef4444';
    return;
  }
  searchHint.style.color = 'var(--green-600)';
  searchHint.textContent = '📡 Obteniendo tu ubicación…';

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      searchInput.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      searchHint.textContent = '🔍 Buscando puntos cercanos…';
      setTimeout(() => {
        const point = mockPoints[Math.floor(Math.random() * mockPoints.length)];
        searchHint.textContent = `✅ Punto más cercano: ${point.name} — a ${point.distance} · Acepta: ${point.accepts.join(', ')}`;
      }, 900);
    },
    () => {
      searchHint.style.color = '#ef4444';
      searchHint.textContent = 'No se pudo obtener la ubicación. Ingresá la dirección manualmente.';
    }
  );
});

// Smooth scroll for anchor links (fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Intersection observer for fade-in animation
const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.step, .benefit-card, .material-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
