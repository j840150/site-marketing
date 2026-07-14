/* Автосервис Тамбов — появление блоков при прокрутке.
   html.js уже проставлен инлайн-скриптом в <head>, до отрисовки страницы.
   Без JS всё остаётся видимым (см. html.js-правила в styles.css).

   Только opacity, без transform: содержимое ничего не сдвигает и не
   масштабирует, просто проявляется на своём законном месте в layout.
   Раз это предопределённый one-shot переход (не жест, не прерываемое
   перетаскивание), CSS-transition — то, что нужно: он идёт вне главного
   потока и не проседает, даже если в это время догружается контент.
   Motion (пружины) оставлен только для декоративного наклона фото в hero
   (см. script.js) — там это единственный оправданный случай для JS-анимации.

   Один режим: one-shot. Сработал один раз при входе в viewport — элемент
   остаётся видимым навсегда (включая [data-reveal-repeat]: раньше эти
   крупные блоки гасли при выходе из viewport и появлялись заново при
   возврате, но на мобильном инерционный скролл заставлял элемент несколько
   раз подряд пересекать границу срабатывания за один свайп — это читалось
   как мерцание. Атрибут data-reveal-repeat оставлен в разметке для
   совместимости, но трактуется как обычный data-reveal). */
(function () {
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var staggerGroups = document.querySelectorAll('.stagger');
  var singles = document.querySelectorAll('.eyebrow, .section-title, [data-reveal], [data-reveal-repeat]');

  function showAll(list) {
    list.forEach(function (el) { el.classList.add('in'); });
  }

  if (prefersReduced || !('IntersectionObserver' in window)) {
    showAll(staggerGroups);
    showAll(singles);
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

  staggerGroups.forEach(function (el) { onceObserver.observe(el); });
  singles.forEach(function (el) { onceObserver.observe(el); });
})();
