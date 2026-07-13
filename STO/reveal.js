/* Автосервис Тамбов — анимации при прокрутке.
   html.js уже проставлен инлайн-скриптом в <head>, до отрисовки страницы.
   Без JS всё остаётся видимым (см. правила html.js ... в styles.css).

   Два режима:
   - one-shot: .stagger (сетки карточек), .eyebrow, [data-reveal] без
     data-reveal-repeat — анимация один раз, элемент больше не отслеживается
     (чтобы интерфейс не мерцал на мелких повторяющихся блоках).
   - repeat: [data-reveal-repeat] — крупные секционные блоки, анимация
     повторяется при входе/выходе из viewport в обе стороны прокрутки. */
(function () {
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var onceItems = document.querySelectorAll('.stagger, .eyebrow, [data-reveal]:not([data-reveal-repeat])');
  var repeatItems = document.querySelectorAll('[data-reveal-repeat]');

  function showAll(list) {
    list.forEach(function (el) { el.classList.add('in'); });
  }

  if (prefersReduced || !('IntersectionObserver' in window)) {
    showAll(onceItems);
    showAll(repeatItems);
    return;
  }

  var onceObserver = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  onceItems.forEach(function (el) { onceObserver.observe(el); });

  var repeatObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      } else if (entry.boundingClientRect.top > 0) {
        // ушёл вниз за пределы экрана — сбрасываем, чтобы при обратной
        // прокрутке анимация сыграла снова; при уходе вверх не трогаем
        entry.target.classList.remove('in');
      }
    });
  }, { threshold: 0.15, rootMargin: '-5% 0px -12% 0px' });
  repeatItems.forEach(function (el) { repeatObserver.observe(el); });
})();
