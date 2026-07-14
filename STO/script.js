/* ===== АВТОСЕРВИС ТАМБОВ — site logic ===== */
(function () {
  'use strict';

  /* --- Year --- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* --- Guard against mobile browsers restoring a scrolled bfcache snapshot
     (bounce back from another page) so the site never "opens" mid-scroll --- */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && !location.hash) window.scrollTo(0, 0);
  });

  /* --- Release hero-enter animation classes once finished, so the parallax
     below (which sets transform via inline style) is free to take over on
     .hero-figure, and the hero entrance never replays later --- */
  document.querySelectorAll('.hero-enter').forEach(function (el) {
    el.addEventListener('animationend', function () {
      el.classList.remove('hero-enter', 'hero-enter-2', 'hero-enter-3', 'hero-enter-4');
    });
  });

  /* --- Scroll reveal: handled by reveal.js (once, staggered), see index.html --- */

  /* --- Brands: show all / collapse --- */
  var brandsToggle = document.getElementById('brands-toggle');
  var brandsGrid = document.getElementById('brands-list');
  if (brandsToggle && brandsGrid) {
    brandsToggle.addEventListener('click', function () {
      var expanded = brandsGrid.classList.toggle('expanded');
      brandsToggle.setAttribute('aria-expanded', String(expanded));
      brandsToggle.textContent = expanded ? 'Свернуть список марок' : 'Показать все марки';
      if (!expanded) {
        brandsGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* --- Service card "Записаться": preselect service in booking form, scroll, focus --- */
  document.querySelectorAll('.service-cta[data-service]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var select = document.getElementById('booking-service');
      var value = btn.getAttribute('data-service');
      if (select) {
        var hasOption = Array.prototype.some.call(select.options, function (opt) {
          return opt.value === value;
        });
        if (hasOption) select.value = value;
      }
      var target = document.getElementById('booking');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var nameInput = document.querySelector('#booking-form input[name="name"]');
      if (nameInput) {
        window.setTimeout(function () { nameInput.focus(); }, 500);
      }
    });
  });

  /* --- Mobile menu --- */
  var burger = document.querySelector('.burger');
  var mobileNav = document.getElementById('mobile-nav');
  if (burger && mobileNav) {
    function closeMobileNav(returnFocus) {
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
      if (returnFocus) burger.focus();
    }
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMobileNav(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        closeMobileNav(true);
      }
    });
  }

  /* --- Header state, scroll progress bar, hero parallax (one shared rAF loop) --- */
  (function () {
    var header = document.querySelector('.site-header');
    var progress = document.getElementById('scroll-progress');
    var heroFigure = document.querySelector('.hero-figure');
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!header && !progress && !heroFigure) return;

    var ticking = false;
    function update() {
      var scrollY = window.scrollY;

      if (header) header.classList.toggle('is-scrolled', scrollY > 12);

      if (progress) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        progress.style.width = (max > 0 ? Math.min(100, (scrollY / max) * 100) : 0) + '%';
      }

      if (heroFigure && !prefersReduced) {
        var offset = Math.min(scrollY * 0.12, 40);
        heroFigure.style.transform = 'translateY(' + offset + 'px)';
      }

      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  })();

  /* --- Hero photo: subtle spring-based 3D tilt on mouse move (decorative,
     desktop-only). Applied to the <img>, not .hero-figure itself, so it never
     fights with the scroll parallax above (which owns .hero-figure's own
     transform via a plain inline style, outside Motion's tracked values). --- */
  (function () {
    var M = window.Motion;
    var figure = document.querySelector('.hero-figure');
    var img = figure ? figure.querySelector('img') : null;
    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!figure || !img || !M || typeof M.animate !== 'function' || prefersReduced || !canHover) return;

    var SPRING = { type: 'spring', stiffness: 150, damping: 18 };

    figure.addEventListener('mousemove', function (e) {
      var rect = figure.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      M.animate(img, { rotateY: px * 7, rotateX: py * -7 }, SPRING);
    });
    figure.addEventListener('mouseleave', function () {
      M.animate(img, { rotateY: 0, rotateX: 0 }, SPRING);
    });
  })();

  /* --- Scrollspy: highlight current section in nav --- */
  (function () {
    var sections = document.querySelectorAll('main section[id]');
    var navLinks = document.querySelectorAll('.nav a[href^="#"]');
    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  })();

  /* --- FAQ: smooth expand/collapse, only one item open at a time --- */
  (function () {
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
    if (!items.length) return;

    function closeItem(details) {
      var body = details.querySelector('.faq-body');
      if (!body || !details.hasAttribute('open')) return;
      body.style.height = body.scrollHeight + 'px';
      requestAnimationFrame(function () {
        body.style.height = '0px';
      });
      body.addEventListener('transitionend', function onEnd() {
        details.removeAttribute('open');
        body.style.height = '';
        body.removeEventListener('transitionend', onEnd);
      });
    }

    function openItem(details) {
      var body = details.querySelector('.faq-body');
      if (!body) return;
      details.setAttribute('open', '');
      body.style.height = '0px';
      requestAnimationFrame(function () {
        body.style.height = body.scrollHeight + 'px';
      });
      body.addEventListener('transitionend', function onEnd() {
        body.style.height = '';
        body.removeEventListener('transitionend', onEnd);
      });
    }

    items.forEach(function (details) {
      var summary = details.querySelector('summary');
      if (!summary) return;

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        var wasOpen = details.hasAttribute('open');

        items.forEach(function (other) {
          if (other !== details && other.hasAttribute('open')) closeItem(other);
        });

        if (wasOpen) {
          closeItem(details);
        } else {
          openItem(details);
        }
      });
    });
  })();

  /* --- Cookie consent --- */
  (function () {
    var KEY = 'avtoservis_cookie_consent';
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}

    function show() {
      banner.hidden = false;
      document.body.classList.add('cookie-visible');
    }
    function hide(value) {
      try { localStorage.setItem(KEY, value); } catch (e) {}
      banner.hidden = true;
      document.body.classList.remove('cookie-visible');
    }

    if (!saved) show();

    var acceptBtn = document.getElementById('cookie-accept');
    var declineBtn = document.getElementById('cookie-decline');
    if (acceptBtn) acceptBtn.addEventListener('click', function () { hide('accepted'); });
    if (declineBtn) declineBtn.addEventListener('click', function () { hide('declined'); });
  })();

  /* --- Phone mask (light) --- */
  function maskPhone(input) {
    input.addEventListener('input', function () {
      var d = input.value.replace(/\D/g, '');
      if (d.startsWith('8')) d = '7' + d.slice(1);
      if (!d.startsWith('7')) d = '7' + d;
      d = d.slice(0, 11);
      var out = '+7';
      if (d.length > 1) out += ' ' + d.slice(1, 4);
      if (d.length >= 5) out += ' ' + d.slice(4, 7);
      if (d.length >= 8) out += '-' + d.slice(7, 9);
      if (d.length >= 10) out += '-' + d.slice(9, 11);
      input.value = out;
    });
  }
  document.querySelectorAll('input[type="tel"]').forEach(maskPhone);

  /* --- Booking form --- */
  var bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    var submitBtn = document.getElementById('booking-submit');
    var submitBtnDefaultText = submitBtn ? submitBtn.textContent : '';
    var isSubmitting = false;

    function setFieldError(fieldEl, errorEl, message) {
      if (errorEl) errorEl.textContent = message || '';
      if (fieldEl) {
        if (message) fieldEl.setAttribute('aria-invalid', 'true');
        else fieldEl.removeAttribute('aria-invalid');
      }
    }

    function clearAllErrors() {
      ['name', 'phone', 'service', 'consent'].forEach(function (key) {
        setFieldError(document.getElementById('field-' + key) || document.getElementById('booking-service'), document.getElementById('error-' + key), '');
      });
    }

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (isSubmitting) return;

      var status = document.getElementById('booking-status');
      var nameField = document.getElementById('field-name');
      var phoneField = document.getElementById('field-phone');
      var serviceField = document.getElementById('booking-service');
      var consentField = document.getElementById('field-consent');

      var data = new FormData(bookingForm);
      var name = (data.get('name') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().replace(/\D/g, '');
      var service = data.get('service');
      var consent = data.get('consent');
      var comment = (data.get('comment') || '').toString().trim();

      clearAllErrors();
      status.textContent = '';
      status.className = 'form-status';

      var firstInvalid = null;
      if (!name) {
        setFieldError(nameField, document.getElementById('error-name'), 'Укажите ваше имя.');
        firstInvalid = firstInvalid || nameField;
      }
      if (phone.length < 11) {
        setFieldError(phoneField, document.getElementById('error-phone'), 'Введите корректный номер телефона.');
        firstInvalid = firstInvalid || phoneField;
      }
      if (!service) {
        setFieldError(serviceField, document.getElementById('error-service'), 'Выберите услугу.');
        firstInvalid = firstInvalid || serviceField;
      }
      if (!consent) {
        setFieldError(consentField, document.getElementById('error-consent'), 'Отметьте согласие на обработку персональных данных.');
        firstInvalid = firstInvalid || consentField;
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      isSubmitting = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляем…';
      }
      status.textContent = 'Отправляем заявку…';
      status.className = 'form-status';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'f7696330-8317-4d49-9d48-a73df4cc34ca',
          subject: 'Новая заявка с сайта — Автосервис Тамбов',
          from_name: 'Сайт Автосервис Тамбов',
          Имя: name,
          Телефон: '+' + phone,
          Услуга: service,
          Комментарий: comment || '—'
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          console.log('Web3Forms response:', res);
          if (res.success) {
            bookingForm.reset();
            status.textContent = 'Заявка принята! Мы перезвоним вам в рабочее время, чтобы подтвердить запись.';
            status.className = 'form-status ok';
          } else {
            status.textContent = 'Не удалось отправить заявку. Позвоните нам напрямую: +7 915 091-98-88.';
            status.className = 'form-status err';
          }
        })
        .catch(function (err) {
          console.error('Web3Forms error:', err);
          status.textContent = 'Не удалось отправить заявку. Позвоните нам напрямую: +7 915 091-98-88.';
          status.className = 'form-status err';
        })
        .finally(function () {
          isSubmitting = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtnDefaultText;
          }
        });
    });
  }

})();
