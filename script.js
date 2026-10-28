/* ============================================================
   SDN 3 WAY GALIH — Interaksi website
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Navbar: shadow saat scroll ---------- */
  var navbar = document.getElementById('navbar');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    navbar.classList.toggle('scrolled', y > 10);
    backToTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Hamburger menu (mobile) ---------- */
  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', function () {
    var open = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Tutup menu setelah link diklik (mobile)
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Tandai menu aktif saat scroll (hanya homepage) ---------- */
  var sections = ['beranda', 'profil', 'program', 'berita', 'galeri', 'ppdb', 'kontak'];
  var hasSections = sections.some(function (id) { return document.getElementById(id); });
  var navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    if (!hasSections) return; // halaman sub: biarkan class active manual di HTML
    var current = 'beranda';
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 140) current = id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Animated counters (statistik) ---------- */
  var counters = document.querySelectorAll('.counter');
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1600;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // easing: easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Tabs berita ---------- */
  var tabs = document.querySelectorAll('#newsTabs .tab');
  var cards = document.querySelectorAll('#newsGrid .news-card');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      var filter = tab.getAttribute('data-filter');
      cards.forEach(function (card) {
        var show = filter === 'all' || card.getAttribute('data-cat') === filter;
        card.classList.toggle('hidden-card', !show);
      });
    });
  });

  // Tombol "Muat Lebih Banyak" — contoh interaksi (bisa dihubungkan ke CMS)
  var loadMoreBtn = document.getElementById('loadMore');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      this.textContent = 'Memuat...';
      var btn = this;
      setTimeout(function () {
        btn.textContent = 'Tidak ada berita lainnya';
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'default';
      }, 800);
    });
  }

  /* ---------- Accordion FAQ ---------- */
  var accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(function (item) {
    var head = item.querySelector('.accordion-head');
    var body = item.querySelector('.accordion-body');
    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // Tutup semua, buka yang diklik (mode single-open)
      accordionItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.accordion-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Buka item FAQ pertama secara default
  if (accordionItems.length > 0) {
    accordionItems[0].classList.add('open');
    var firstBody = accordionItems[0].querySelector('.accordion-body');
    firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
  }

  /* ---------- Lightbox galeri ---------- */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lightboxCaption = document.getElementById('lightboxCaption');
    document.querySelectorAll('.gallery-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var label = item.querySelector('span');
        lightboxCaption.textContent = label ? label.textContent : '';
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.addEventListener('click', function () {
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Form kontak ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var success = document.getElementById('formSuccess');
      if (success) success.classList.add('show');
      contactForm.reset();
      setTimeout(function () {
        if (success) success.classList.remove('show');
      }, 5000);
    });
  }
})();
