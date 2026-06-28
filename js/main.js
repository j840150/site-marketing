// ===== Экран 1: симулятор чата ИИ (заскриптованная демонстрация) =====
const simChat = document.getElementById('simChat');
const simRunBtn = document.getElementById('simRunBtn');
const simNicheInput = document.getElementById('simNicheInput');

function typeText(el, text, speed = 18) {
  return new Promise(resolve => {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

async function runSimulator() {
  const niche = (simNicheInput.value || 'доставка цветов').trim();
  simRunBtn.disabled = true;
  const line1 = document.createElement('p');
  line1.className = 'sim-line sim-q';
  line1.textContent = `Вопрос: «Какую компанию посоветуешь в категории «${niche}»?»`;
  simChat.innerHTML = '';
  simChat.appendChild(line1);

  const line2 = document.createElement('p');
  line2.className = 'sim-line sim-a';
  simChat.appendChild(line2);

  const answer = `Среди заметных игроков в нише «${niche}» часто упоминают бренд-пример «АльфаЛидер» — у него подробное описание услуг, отзывы и структурированные данные на сайте, поэтому модель чаще берёт его как источник для ответа.`;
  await typeText(line2, answer, 14);
  simRunBtn.disabled = false;
}

simRunBtn.addEventListener('click', runSimulator);

// ===== Экран 2: чекер (мок) =====
const checkerForm = document.getElementById('checkerForm');
const checkerResult = document.getElementById('checkerResult');

checkerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const brand = document.getElementById('checkerBrand').value.trim();
  const niche = document.getElementById('checkerNiche').value.trim();
  const region = document.getElementById('checkerRegion').value.trim();

  // Мок: детерминированный, но "случайный" результат на основе длины строки бренда
  const seed = brand.length + niche.length;
  const models = [
    { name: 'ChatGPT', included: seed % 2 === 0 },
    { name: 'Яндекс Нейро', included: seed % 3 === 0 },
    { name: 'GigaChat', included: seed % 5 === 0 },
    { name: 'Gemini', included: seed % 4 === 0 },
  ];

  checkerResult.innerHTML = '';
  const heading = document.createElement('p');
  heading.innerHTML = `<strong>Моделирование для «${brand}»</strong> в нише «${niche}»${region ? ', регион: ' + region : ''}:`;
  checkerResult.appendChild(heading);

  models.forEach(m => {
    const row = document.createElement('div');
    row.className = 'result-row';
    row.innerHTML = `
      <span>${m.name}</span>
      <span class="result-badge ${m.included ? 'badge-in' : 'badge-out'}">
        ${m.included ? 'бренд встречается в типичных ответах' : 'бренд не встречается, чаще упомянуты конкуренты'}
      </span>`;
    checkerResult.appendChild(row);
  });

  checkerResult.classList.remove('hidden');
  checkerResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// ===== Экран 2: калькулятор упущенной выручки =====
const lossCalcBtn = document.getElementById('lossCalcBtn');
const lossResult = document.getElementById('lossResult');

lossCalcBtn.addEventListener('click', () => {
  const check = parseFloat(document.getElementById('lossCheck').value) || 0;
  const traffic = parseFloat(document.getElementById('lossTraffic').value) || 0;
  // Оценочная доля трафика, уходящего на ответы ИИ без конверсии в клик (условный коэффициент демо-расчёта)
  const assumedShareLost = 0.12;
  const conversionRate = 0.02;
  const lost = check * traffic * assumedShareLost * conversionRate;

  lossResult.textContent = lost > 0
    ? `Оценочная упущенная выручка: ~${Math.round(lost).toLocaleString('ru-RU')} ₽/мес (индикативный расчёт, не гарантия).`
    : 'Введите средний чек и трафик для расчёта.';
  lossResult.classList.remove('hidden');
});

// ===== Экран 3: цикл — раскрытие этапов =====
const cycleStages = document.querySelectorAll('.cycle-stage');
cycleStages.forEach(stage => {
  stage.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    const isActive = stage.classList.contains('active');
    cycleStages.forEach(s => s.classList.remove('active'));
    if (!isActive) stage.classList.add('active');
  });
});

// ===== Экран 3: демо дашборда =====
const dashboardDemoBtn = document.getElementById('dashboardDemoBtn');
const dashboardPreview = document.getElementById('dashboardPreview');
const dashboardChart = document.getElementById('dashboardChart');

dashboardDemoBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  dashboardPreview.classList.remove('hidden');
  dashboardChart.innerHTML = '';
  const weeks = [8, 11, 14, 19, 23, 27, 31, 38];
  weeks.forEach(v => {
    const bar = document.createElement('div');
    bar.className = 'dashboard-bar';
    bar.style.height = `${v * 3}px`;
    bar.title = `${v}% доли упоминаний`;
    dashboardChart.appendChild(bar);
  });
  dashboardPreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
