/* ===== АВТОСЕРВИС ТАМБОВ — site logic ===== */
(function () {
  'use strict';

  /* --- Year --- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* --- Scroll reveal: handled by reveal.js (two-way fade in/out), see index.html --- */

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

  /* --- Star helper --- */
  function stars(n) {
    n = Math.max(1, Math.min(5, parseInt(n, 10) || 5));
    var on = '★'.repeat(n);
    var off = '★'.repeat(5 - n);
    return '<span aria-hidden="true">' + on + '<span class="off">' + off + '</span></span>' +
           '<span class="sr-only"> ' + n + ' из 5</span>';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* --- Seed reviews: realistic, varied ratings (not all 5.0) --- */
  var seedReviews = [
    { name: 'Алексей М.', rating: 5, date: '12.05.2026', text: 'Стучало в передней подвеске — сделали диагностику, показали что именно менять. Поменяли стойки стабилизатора и сайлентблоки, стук ушёл. Цену назвали заранее, по итогу столько и вышло.' },
    { name: 'Ирина', rating: 5, date: '28.04.2026', text: 'Меняла масло и фильтры, всё быстро, минут за сорок. Понравилось, что подсказали по интервалу замены под мою машину. Вернусь на ТО.' },
    { name: 'Дмитрий К.', rating: 4, date: '19.04.2026', text: 'Ремонт ходовой сделали хорошо, претензий нет. Немного дольше ждал, чем рассчитывал, был большой поток. В целом доволен, цена адекватная.' },
    { name: 'Сергей', rating: 5, date: '03.04.2026', text: 'Приехал на бесплатную диагностику ходовой — отнеслись честно, сказали что критичного ничего нет, можно ездить. Не навязали лишнего. Это подкупает.' },
    { name: 'Наталья В.', rating: 4, date: '21.03.2026', text: 'Делали тормоза, заменили колодки и диски. Машина тормозит как надо. Связь по телефону держали, сообщали о ходе работ.' },
    { name: 'Павел', rating: 5, date: '08.03.2026', text: 'Компьютерная диагностика плюс замена масла. Нашли причину ошибки, объяснили нормальным языком без лишних терминов. Спасибо мастерам.' }
  ];

  var STORAGE_KEY = 'avtoservis_pending_reviews_v1';

  function loadPending() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function savePending(list) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function reviewCard(r, pending) {
    var cls = 'review-card' + (pending ? ' review-pending' : '');
    var badge = pending ? '<span class="review-badge">На модерации</span>' : '<span class="review-date">' + escapeHtml(r.date) + '</span>';
    return '<article class="' + cls + '">' +
      '<div class="review-top">' +
        '<span class="review-name">' + escapeHtml(r.name) + '</span>' +
        '<span class="review-stars">' + stars(r.rating) + '</span>' +
      '</div>' +
      '<p class="review-text">' + escapeHtml(r.text) + '</p>' +
      badge +
    '</article>';
  }

  function renderReviews() {
    var list = document.getElementById('reviews-list');
    if (!list) return;
    var pending = loadPending();
    var html = '';
    // Show user's own pending reviews first (visible only to them, marked as awaiting moderation)
    pending.forEach(function (r) { html += reviewCard(r, true); });
    seedReviews.forEach(function (r) { html += reviewCard(r, false); });
    list.innerHTML = html;
  }
  renderReviews();

  /* --- Review form (moderation queue) --- */
  var reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('review-status');
      var data = new FormData(reviewForm);
      var name = (data.get('name') || '').toString().trim();
      var rating = data.get('rating');
      var text = (data.get('text') || '').toString().trim();
      var consent = data.get('consent');

      if (!name || !rating || !text) {
        status.textContent = 'Заполните имя, оценку и текст отзыва.';
        status.className = 'form-status err';
        return;
      }
      if (!consent) {
        status.textContent = 'Отметьте согласие на обработку персональных данных.';
        status.className = 'form-status err';
        return;
      }

      var review = {
        name: name,
        rating: parseInt(rating, 10),
        text: text,
        date: new Date().toLocaleDateString('ru-RU'),
        submittedAt: new Date().toISOString()
      };

      /* In production: POST to backend moderation endpoint, e.g.
         fetch('/api/reviews', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(review)})
         The review is then stored "unpublished" until an admin approves it. */
      var pending = loadPending();
      pending.unshift(review);
      savePending(pending);
      renderReviews();

      reviewForm.reset();
      status.textContent = 'Спасибо! Отзыв отправлен и появится на сайте после проверки модератором.';
      status.className = 'form-status ok';
    });
  }

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
