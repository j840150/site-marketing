/* Автосервис Тамбов — появление блоков при прокрутке.
   Работает с классами .reveal / .reveal.in, которые уже есть в styles.css.
   Ничего не меняет в script.js — подключается отдельным <script> тегом. */
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Если у пользователя отключена анимация в системе — просто показываем всё сразу
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      // появляется, когда блок входит в область видимости,
      // и снова скрывается, если полностью уйдёт из неё —
      // так анимация повторяется и при прокрутке вниз, и вверх
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      } else if (entry.boundingClientRect.top > 0) {
        // сбрасываем только когда блок ушёл ВНИЗ за пределы экрана
        // (не когда прокрутили дальше него вверх по странице) —
        // так при обратной прокрутке он снова красиво появится
        entry.target.classList.remove('in');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -8% 0px'
  });

  items.forEach(function (el) { observer.observe(el); });
})();
