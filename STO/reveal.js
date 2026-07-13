/* Автосервис Тамбов — появление блоков (и карточек внутри них) при прокрутке.
   Работает с классом .stagger, см. styles.css. Анимация запускается один раз:
   после появления элемент перестаёт отслеживаться. */
(function () {
  var items = document.querySelectorAll('.stagger');
  if (!items.length) return;

  // Если у пользователя отключена анимация в системе — просто показываем всё сразу
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px'
  });

  items.forEach(function (el) { observer.observe(el); });
})();
