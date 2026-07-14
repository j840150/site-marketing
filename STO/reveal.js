/* Автосервис Тамбов — анимации при прокрутке.
   html.js уже проставлен инлайн-скриптом в <head>, до отрисовки страницы.
   Без JS (или без Motion) всё остаётся видимым (см. html.js-правила в styles.css).

   Когда доступна Motion (window.Motion, self-hosted vendor/motion.min.js):
   элементы получают пружинную анимацию (Motion.animate + spring) — более
   «живое» ощущение, чем плоский cubic-bezier. Класс .in при этом всё равно
   добавляется — часть эффектов (линия процесса, подчёркивание eyebrow)
   завязана на CSS через html.js .in, а Motion не умеет анимировать псевдоэлементы.

   Если Motion недоступна (сеть/CDN подвела) — используется CSS-фолбэк:
   классы .in просто переключают уже готовые CSS-transition в styles.css.

   Два режима:
   - one-shot: .stagger (сетки карточек), .eyebrow, [data-reveal] без
     data-reveal-repeat — анимация один раз, элемент больше не отслеживается.
   - repeat: [data-reveal-repeat] — крупные секционные блоки, анимация
     повторяется при входе/выходе из viewport в обе стороны прокрутки. */
(function () {
  var M = window.Motion;
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canUseMotion = !prefersReduced && !!(M && typeof M.inView === 'function' && typeof M.animate === 'function');

  var staggerGroups = document.querySelectorAll('.stagger');
  var singles = document.querySelectorAll('.eyebrow, [data-reveal]:not([data-reveal-repeat])');
  var repeatItems = document.querySelectorAll('[data-reveal-repeat]');

  function showAll(list) {
    list.forEach(function (el) { el.classList.add('in'); });
  }

  if (prefersReduced || !('IntersectionObserver' in window)) {
    showAll(staggerGroups);
    showAll(singles);
    showAll(repeatItems);
    return;
  }

  var SPRING = { type: 'spring', duration: 0.7, bounce: 0.16 };
  var SPRING_FAST = { type: 'spring', duration: 0.5, bounce: 0.14 };

  if (canUseMotion) {
    /* Target Motion's own tracked shorthand properties (x/y/scale), never the
       raw `transform` string — Motion reads the current computed translate/scale
       from the CSS starting state automatically, animating each component with
       spring physics. Animating transform:'none' directly produces a degenerate
       matrix because Motion can't interpolate a keyword against a matrix. */
    staggerGroups.forEach(function (group) {
      M.inView(group, function () {
        group.classList.add('in');
        var children = Array.prototype.slice.call(group.children);
        M.animate(children, { opacity: 1, x: 0, y: 0, scale: 1 }, {
          type: 'spring', duration: 0.7, bounce: 0.16, delay: M.stagger(0.06)
        });
      }, { margin: '0px 0px -8% 0px', amount: 0.15 });
    });

    singles.forEach(function (el) {
      M.inView(el, function () {
        el.classList.add('in');
        if (el.hasAttribute('data-reveal')) {
          M.animate(el, { opacity: 1, x: 0, y: 0, scale: 1 }, SPRING_FAST);
        }
      }, { margin: '0px 0px -8% 0px', amount: 0.15 });
    });

    repeatItems.forEach(function (el) {
      M.inView(el, function () {
        el.classList.add('in');
        M.animate(el, { opacity: 1, x: 0, y: 0, scale: 1 }, SPRING);
        return function () {
          el.classList.remove('in');
          M.animate(el, { opacity: 0 }, { duration: 0.25 });
        };
      }, { margin: '-5% 0px -12% 0px', amount: 0.15 });
    });
    return;
  }

  /* Motion failed to load (e.g. blocked network) — CSS-driven fallback,
     identical behaviour to the original IntersectionObserver version. */
  var onceObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  staggerGroups.forEach(function (el) { onceObserver.observe(el); });
  singles.forEach(function (el) { onceObserver.observe(el); });

  var repeatObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      } else if (entry.boundingClientRect.top > 0) {
        entry.target.classList.remove('in');
      }
    });
  }, { threshold: 0.15, rootMargin: '-5% 0px -12% 0px' });
  repeatItems.forEach(function (el) { repeatObserver.observe(el); });
})();
