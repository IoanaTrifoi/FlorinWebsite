document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if (burger) {
    burger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ---------- Fade-up on scroll ---------- */
  const items = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));

  /* ---------- Gold dust particles (hero only) ---------- */
  const canvas = document.getElementById('dust-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 10 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      r: 1 + Math.random() * 2.5,
      speed: 0.3 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.3,
      opacity: 0.2 + Math.random() * 0.4
    }));

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,160,82,${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxContent = lightbox.querySelector('.ph');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        lightboxContent.textContent = item.querySelector('.ph').textContent;
        lightbox.classList.add('open');
      });
    });
    lightbox.querySelector('.lightbox-close').addEventListener('click', () =>
      lightbox.classList.remove('open')
    );
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }

  /* ---------- Placeholder availability calendar ---------- */
  const calGrid = document.getElementById('calendar-grid');
  if (calGrid) {
    const dayNames = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'];
    dayNames.forEach(d => {
      const el = document.createElement('div');
      el.className = 'day head';
      el.textContent = d;
      calGrid.appendChild(el);
    });
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < startOffset; i++) {
      const el = document.createElement('div');
      el.className = 'day';
      calGrid.appendChild(el);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const el = document.createElement('div');
      const isPast = new Date(year, month, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const randomUnavailable = !isPast && (d % 5 === 0 || d % 7 === 0);
      el.className = 'day ' + (isPast ? '' : randomUnavailable ? 'unavailable' : 'available');
      el.textContent = d;
      if (!isPast && !randomUnavailable) {
        el.addEventListener('click', () => {
          document.getElementById('event-date').value = `${d}.${month + 1}.${year}`;
          document.getElementById('reservation-form').scrollIntoView({ behavior: 'smooth' });
        });
      }
      calGrid.appendChild(el);
    }
  }

  /* ---------- Forms (placeholder submit) ---------- */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-success');
      if (msg) {
        msg.style.display = 'block';
        form.reset();
      }
    });
  });

  /* ---------- Sticky mobile CTA ---------- */
  const stickyCta = document.querySelector('.sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) stickyCta.classList.add('show');
      else stickyCta.classList.remove('show');
    });
  }
});
