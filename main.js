// ===== NEXUS DIGITAL AGENCY — MAIN JS =====

document.addEventListener('DOMContentLoaded', () => {

  // ===== LOADER =====
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('done');
    document.body.style.overflow = 'auto';
    animateCounters();
  }, 2000);
  document.body.style.overflow = 'hidden';

  // ===== CUSTOM CURSOR =====
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .service-card, .portfolio-item, .filter-btn, .slider-btn, .quick-btn').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovered'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovered'));
  });

  // ===== NAVBAR =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
  });

  // ===== HAMBURGER =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== BACK TO TOP =====
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.service-card, .portfolio-item, .pricing-card, .testimonial-card, .about-grid > *, .contact-grid > *, .section-header, .value-item, .contact-item');
  reveals.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revealObserver.observe(el));

  // ===== COUNTER ANIMATION =====
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        counter.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, 16);
    });
  }

  // ===== PORTFOLIO FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      portfolioItems.forEach(item => {
        const cat = item.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          setTimeout(() => { item.style.opacity = '1'; item.style.transition = 'opacity 0.4s ease'; }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ===== TESTIMONIAL SLIDER =====
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const cards = document.querySelectorAll('.testimonial-card');
  let currentSlide = 0;
  const visibleCount = window.innerWidth < 768 ? 1 : 3;
  const totalSlides = Math.ceil(cards.length / visibleCount);

  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  function goToSlide(index) {
    currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${currentSlide * cardWidth * visibleCount}px)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  document.getElementById('prevBtn').addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('nextBtn').addEventListener('click', () => {
    goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
  });

  // Auto-play
  setInterval(() => {
    goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0);
  }, 5000);

  // ===== PRICING TOGGLE =====
  const pricingToggle = document.getElementById('pricingToggle');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');
  let isAnnual = false;

  pricingToggle.addEventListener('click', () => {
    isAnnual = !isAnnual;
    pricingToggle.classList.toggle('on', isAnnual);
    monthlyLabel.classList.toggle('active', !isAnnual);
    annualLabel.classList.toggle('active', isAnnual);
    document.querySelectorAll('.monthly-price').forEach(el => el.classList.toggle('hidden', isAnnual));
    document.querySelectorAll('.annual-price').forEach(el => el.classList.toggle('hidden', !isAnnual));
  });

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      company: formData.get('company') || '',
      services: formData.getAll('services[]').join(', '),
      budget: formData.get('budget') || '',
      message: formData.get('message') || ''
    };

    try {
      // Send to PHP backend
      const response = await fetch('php/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // Show success (works even without backend in demo)
      contactForm.style.display = 'none';
      formSuccess.classList.remove('hidden');
    } catch (err) {
      // Show success in demo mode
      contactForm.style.display = 'none';
      formSuccess.classList.remove('hidden');
    }
  });

  // ===== CHAT ENTER KEY =====
  document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // ===== NEWSLETTER =====
  document.querySelector('.newsletter-form button').addEventListener('click', () => {
    const input = document.querySelector('.newsletter-form input');
    if (input.value && input.value.includes('@')) {
      input.value = '✓ Subscribed!';
      input.disabled = true;
    }
  });

});
