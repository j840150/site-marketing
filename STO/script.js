/* ===== АВТОСЕРВИС ТАМБОВ — site logic ===== */
(function () {
  'use strict';

  /* --- Year --- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* --- Scroll reveal: handled by reveal.js (once, staggered), see index.html --- */

  /* --- Mobile menu --- */
  var burger = document.querySelector('.burger');
  var mobileNav = document.getElementById('mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });
  }

  /* --- Header state on scroll --- */
  (function () {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
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

  /* --- FAQ: smooth expand/collapse --- */
  (function () {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (details) {
      var summary = details.querySelector('summary');
      var body = details.querySelector('.faq-body');
      if (!summary || !body) return;

      summary.addEventListener('click', function (e) {
        e.preventDefault();

        if (details.hasAttribute('open')) {
          body.style.height = body.scrollHeight + 'px';
          requestAnimationFrame(function () {
            body.style.height = '0px';
          });
          body.addEventListener('transitionend', function onEnd() {
            details.removeAttribute('open');
            body.style.height = '';
            body.removeEventListener('transitionend', onEnd);
          });
        } else {
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
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('booking-status');
      var data = new FormData(bookingForm);
      var name = (data.get('name') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().replace(/\D/g, '');
      var service = data.get('service');
      var consent = data.get('consent');

      if (!name) {
        status.textContent = 'Укажите ваше имя.';
        status.className = 'form-status err';
        return;
      }
      if (phone.length < 11) {
        status.textContent = 'Введите корректный номер телефона.';
        status.className = 'form-status err';
        return;
      }
      if (!service) {
        status.textContent = 'Выберите услугу.';
        status.className = 'form-status err';
        return;
      }
      if (!consent) {
        status.textContent = 'Отметьте согласие на обработку персональных данных.';
        status.className = 'form-status err';
        return;
      }

      var comment = (data.get('comment') || '').toString().trim();

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
        });
    });
  }

})();
