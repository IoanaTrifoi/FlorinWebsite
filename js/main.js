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

  /* ---------- Filterable groups (gallery + menu cocktails/packages) ---------- */
  function setupFilterGroup(filterBtnsSel, itemsSel) {
    const filterBtns = document.querySelectorAll(filterBtnsSel);
    const items = document.querySelectorAll(itemsSel);
    if (!filterBtns.length || !items.length) return { filterBtns, items };
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        items.forEach(item => {
          const show = !filter || filter === 'all' || item.dataset.category === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
    return { filterBtns, items };
  }

  const galleryGroup = setupFilterGroup('#gallery-filters .filter-btn', '.gallery-item');
  setupFilterGroup('#menu-filters .filter-btn', '.cocktail-card, .package-card');
  const galleryItems = galleryGroup.items || document.querySelectorAll('.gallery-item');

  /* ---------- Lightbox (with prev/next navigation over visible items) ---------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxContent = lightbox.querySelector('.ph');
    let currentIndex = -1;

    const visibleItems = () =>
      Array.from(galleryItems).filter(item => item.style.display !== 'none');

    const showAt = (index) => {
      const visible = visibleItems();
      if (!visible.length) return;
      currentIndex = (index + visible.length) % visible.length;
      lightboxContent.innerHTML = visible[currentIndex].querySelector('.ph').innerHTML;
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const visible = visibleItems();
        showAt(visible.indexOf(item));
        lightbox.classList.add('open');
      });
    });

    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    if (prevBtn) prevBtn.addEventListener('click', () => showAt(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showAt(currentIndex + 1));

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

  /* ---------- Column hover hero (click to scroll to anchor) ---------- */
  document.querySelectorAll('.col-hero-item[data-target]').forEach(item => {
    item.addEventListener('click', (e) => {
      const target = item.dataset.target;
      if (target.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Scroll-controlled video hero ---------- */
  document.querySelectorAll('.scroll-video-hero').forEach(section => {
    const video = section.querySelector('video');
    const overlay = section.querySelector('.video-overlay-content');
    if (!video) return;

    let duration = 0;
    video.addEventListener('loadedmetadata', () => { duration = video.duration || 0; });

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

      if (duration) video.currentTime = progress * duration;

      if (overlay) {
        let opacity;
        if (progress < 0.2) opacity = progress / 0.2;
        else if (progress > 0.8) opacity = (1 - progress) / 0.2;
        else opacity = 1;
        overlay.style.opacity = opacity;
        overlay.classList.toggle('in-view', opacity > 0.05);
      }
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    });
    update();
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
