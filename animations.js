// ===== NEXUS ANIMATIONS JS =====

document.addEventListener('DOMContentLoaded', () => {

  // ===== PARALLAX HERO ORBS =====
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    const orbs = document.querySelectorAll('.hero-orb');
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.5;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  // ===== TILT CARDS =====
  document.querySelectorAll('.service-card, .pricing-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===== SECTION HEADER ANIMATION =====
  const sectionHeaders = document.querySelectorAll('.section-header, .about-content, .contact-info');
  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(24px)';
          setTimeout(() => {
            child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 120);
        });
        headerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  sectionHeaders.forEach(el => headerObserver.observe(el));

  // ===== MINI CHART ANIMATION =====
  const miniChartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.bar');
        bars.forEach((bar, i) => {
          const targetHeight = bar.style.height;
          bar.style.height = '0%';
          setTimeout(() => {
            bar.style.transition = 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.height = targetHeight;
          }, i * 100 + 300);
        });
        miniChartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const miniChart = document.querySelector('.mini-chart');
  if (miniChart) miniChartObserver.observe(miniChart);

  // ===== ABOUT CARD FLOAT ANIMATION =====
  const aboutFloats = document.querySelectorAll('.about-card-float');
  aboutFloats.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 800 + i * 300);
  });

  // ===== MARQUEE PAUSE ON HOVER =====
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  // ===== MAGNETIC BUTTONS =====
  document.querySelectorAll('.btn-hero-primary, .btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ===== SCROLL PROGRESS BAR =====
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; z-index: 9999;
    background: linear-gradient(90deg, #e8ff47, #00d4ff);
    transition: width 0.1s linear; width: 0%;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });

  // ===== GLITCH EFFECT ON LOGO HOVER =====
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('mouseenter', () => {
      navLogo.style.animation = 'glitch 0.3s infinite';
    });
    navLogo.addEventListener('mouseleave', () => {
      navLogo.style.animation = '';
    });
  }

});
