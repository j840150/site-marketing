// ===== Утилита: детерминированный псевдослучайный хэш =====
function seedHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
function seededRandom(seedStr) {
  let seed = seedHash(seedStr) || 1;
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}
function todayStamp() {
  return new Date().toLocaleDateString('ru-RU');
}

// ===== Burger menu =====
const burger = document.getElementById('burgerBtn');
const mobileNav = document.getElementById('mobileNav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    mobileNav.classList.toggle('open', !expanded);
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('open');
    });
  });
}

// ===== Экран 1: симулятор чата ИИ =====
const simChat = document.getElementById('simChat');
const simRunBtn = document.getElementById('simRunBtn');
const simNicheInput = document.getElementById('simNicheInput');

const DEMO_BRANDS = [
  { kw: ['цвет', 'flower'], brand: 'БукетСтудио' },
  { kw: ['ипотек', 'кредит', 'банк'], brand: 'ФинЛидер' },
  { kw: ['бухгалт', 'учёт', 'учет'], brand: 'УчётПро' },
  { kw: ['застрой', 'недвиж', 'квартир'], brand: 'СтройГород' },
  { kw: ['юрист', 'право', 'адвокат'], brand: 'ПравоЦентр' },
  { kw: ['стоматолог', 'клиник', 'медиц'], brand: 'МедиЛайн' },
];
function demoBrandForNiche(niche) {
  const low = niche.toLowerCase();
  for (const item of DEMO_BRANDS) {
    if (item.kw.some(k => low.includes(k))) return item.brand;
  }
  return 'Бренд-Пример';
}

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
  const demoBrand = demoBrandForNiche(niche);
  simRunBtn.disabled = true;

  simChat.textContent = '';
  const line1 = document.createElement('p');
  line1.className = 'sim-line sim-q';
  line1.textContent = `Вопрос: «Какую компанию посоветуешь в категории «${niche}»?»`;
  simChat.appendChild(line1);

  const line2 = document.createElement('p');
  line2.className = 'sim-line sim-a';
  simChat.appendChild(line2);

  const answer = `Среди заметных игроков в нише «${niche}» часто упоминают демонстрационный бренд-пример «${demoBrand}» — у него подробное описание услуг, отзывы и структурированные данные на сайте, поэтому модель чаще берёт его как источник для ответа.`;
  await typeText(line2, answer, 14);
  simRunBtn.disabled = false;
}

if (simRunBtn) simRunBtn.addEventListener('click', runSimulator);

// ===== Экран 2: чекер видимости (мок, детерминированный) =====
const checkerForm = document.getElementById('checkerForm');
const checkerResult = document.getElementById('checkerResult');
const checkerError = document.getElementById('checkerError');

const MODEL_NAMES = ['ChatGPT', 'Яндекс Нейро', 'GigaChat', 'Gemini'];
const COMPETITOR_POOL = ['Лидер-Маркет', 'ТопСервис', 'ПроРешение', 'ГлавСнаб', 'ЭкспертГрупп', 'НоваЛайн'];
const QUERY_TEMPLATES = [
  'Какую компанию посоветуешь в категории «{niche}»?',
  'Лучшие варианты «{niche}» в {region}',
  'Сравни решения для «{niche}»',
  'Кому доверяют клиенты в сфере «{niche}»?',
  'Топ исполнителей по запросу «{niche}»',
];

function buildCheckerResult(brand, niche, region) {
  const seedStr = `${brand}|${niche}|${region}`;
  const rand = seededRandom(seedStr);

  const models = MODEL_NAMES.map(name => {
    const r = rand();
    let status = 'out';
    if (r > 0.66) status = 'in';
    else if (r > 0.4) status = 'low';
    return { name, status };
  });

  const includedCount = models.filter(m => m.status === 'in').length;

  const competitors = [];
  const compPool = [...COMPETITOR_POOL];
  const compCount = 2 + Math.floor(rand() * 2);
  for (let i = 0; i < compCount && compPool.length; i++) {
    const idx = Math.floor(rand() * compPool.length);
    competitors.push(compPool.splice(idx, 1)[0]);
  }

  const missingQueries = QUERY_TEMPLATES
    .map(t => t.replace('{niche}', niche).replace('{region}', region || 'вашем регионе'))
    .filter(() => rand() > 0.35)
    .slice(0, 4);

  return { models, includedCount, competitors, missingQueries };
}

function renderCheckerResult(brand, niche, region, data) {
  checkerResult.textContent = '';

  const summary = document.createElement('div');
  summary.className = 'result-summary';
  const summaryItems = [
    { label: 'Бренд', value: brand },
    { label: 'Ниша', value: niche },
    { label: 'Встречается из 4 моделей', value: `${data.includedCount} из 4` },
  ];
  summaryItems.forEach(item => {
    const box = document.createElement('div');
    box.className = 'result-summary-item';
    const lab = document.createElement('span');
    lab.className = 'label';
    lab.textContent = item.label;
    const val = document.createElement('span');
    val.className = 'value';
    val.textContent = item.value;
    box.appendChild(lab);
    box.appendChild(val);
    summary.appendChild(box);
  });
  checkerResult.appendChild(summary);

  const meta = document.createElement('p');
  meta.className = 'result-meta';
  meta.textContent = `Дата моделирования: ${todayStamp()}${region ? ' · регион: ' + region : ''}. Индикативная симуляция, не реальная выдача нейросетей.`;
  checkerResult.appendChild(meta);

  const modelsBlock = document.createElement('div');
  modelsBlock.className = 'result-models';
  data.models.forEach(m => {
    const row = document.createElement('div');
    row.className = 'result-row';
    const head = document.createElement('div');
    head.className = 'result-row-head';
    const name = document.createElement('span');
    name.className = 'result-row-model';
    name.textContent = m.name;
    const badge = document.createElement('span');
    const map = {
      in: ['badge-in', 'бренд встречается в типичных ответах'],
      low: ['badge-low', 'встречается редко / неустойчиво'],
      out: ['badge-out', 'бренд не встречается, упомянуты конкуренты'],
    };
    const [cls, text] = map[m.status];
    badge.className = `result-badge ${cls}`;
    badge.textContent = text;
    head.appendChild(name);
    head.appendChild(badge);
    row.appendChild(head);
    modelsBlock.appendChild(row);
  });
  checkerResult.appendChild(modelsBlock);

  if (data.competitors.length) {
    const compBlock = document.createElement('div');
    compBlock.className = 'result-block';
    const h4 = document.createElement('h4');
    h4.textContent = 'Кто чаще упоминается вместо вас (демо-конкуренты)';
    compBlock.appendChild(h4);
    const list = document.createElement('div');
    list.className = 'competitor-list';
    data.competitors.forEach(c => {
      const chip = document.createElement('span');
      chip.className = 'competitor-chip';
      chip.textContent = c;
      list.appendChild(chip);
    });
    compBlock.appendChild(list);
    checkerResult.appendChild(compBlock);
  }

  if (data.missingQueries.length) {
    const qBlock = document.createElement('div');
    qBlock.className = 'result-block';
    const h4 = document.createElement('h4');
    h4.textContent = 'Запросы, где бренд вероятно отсутствует';
    qBlock.appendChild(h4);
    const ul = document.createElement('ul');
    ul.className = 'missing-queries';
    data.missingQueries.forEach(q => {
      const li = document.createElement('li');
      li.textContent = q;
      ul.appendChild(li);
    });
    qBlock.appendChild(ul);
    checkerResult.appendChild(qBlock);
  }

  const ctaBlock = document.createElement('div');
  ctaBlock.className = 'result-cta';
  const ctaP = document.createElement('p');
  ctaP.textContent = 'Хотите полную диагностику с реальными запросами вашей ниши?';
  ctaBlock.appendChild(ctaP);
  checkerResult.appendChild(ctaBlock);

  checkerResult.classList.remove('hidden');
  const leadBlock = document.getElementById('leadBlock');
  if (leadBlock) leadBlock.classList.remove('hidden');
  checkerResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

if (checkerForm) {
  checkerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const brand = document.getElementById('checkerBrand').value.trim();
    const niche = document.getElementById('checkerNiche').value.trim();
    const region = document.getElementById('checkerRegion').value.trim();

    if (checkerError) checkerError.classList.add('hidden');

    if (!brand || !niche) {
      if (checkerError) {
        checkerError.textContent = 'Заполните поля «Бренд» и «Ниша», чтобы запустить моделирование.';
        checkerError.classList.remove('hidden');
      }
      checkerResult.classList.add('hidden');
      return;
    }

    const data = buildCheckerResult(brand, niche, region);
    renderCheckerResult(brand, niche, region, data);
  });
}

// ===== Лид-форма =====
const leadForm = document.getElementById('leadForm');
const leadSuccess = document.getElementById('leadSuccess');
if (leadForm) {
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const consent = document.getElementById('leadConsent');
    if (!consent.checked) return;
    leadForm.classList.add('hidden');
    if (leadSuccess) {
      leadSuccess.textContent = 'Заявка принята (демо-форма, отправка на сервер не настроена). Мы свяжемся с вами в реальной версии сайта.';
      leadSuccess.classList.remove('hidden');
    }
  });
}

// ===== Экран 2: калькулятор упущенной выручки =====
const lossCalcBtn = document.getElementById('lossCalcBtn');
const lossResult = document.getElementById('lossResult');

if (lossCalcBtn) {
  lossCalcBtn.addEventListener('click', () => {
    const check = parseFloat(document.getElementById('lossCheck').value) || 0;
    const traffic = parseFloat(document.getElementById('lossTraffic').value) || 0;
    const assumedShareLost = 0.12;
    const conversionRate = 0.02;
    const lost = check * traffic * assumedShareLost * conversionRate;

    lossResult.textContent = lost > 0
      ? `Оценочная упущенная выручка: ~${Math.round(lost).toLocaleString('ru-RU')} ₽/мес (индикативный расчёт на демонстрационных допущениях, не гарантия и не аудит).`
      : 'Введите средний чек и трафик для расчёта.';
    lossResult.classList.remove('hidden');
  });
}

// ===== Экран 3: демо дашборда =====
const dashboardDemoBtn = document.getElementById('dashboardDemoBtn');
const dashboardPreview = document.getElementById('dashboardPreview');
const dashboardChart = document.getElementById('dashboardChart');

if (dashboardDemoBtn) {
  dashboardDemoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dashboardPreview.classList.remove('hidden');
    dashboardChart.textContent = '';
    const weeks = [8, 11, 14, 19, 23, 27, 31, 38];
    weeks.forEach(v => {
      const bar = document.createElement('div');
      bar.className = 'dashboard-bar';
      bar.style.height = `${v * 3}px`;
      bar.title = `${v}% доли упоминаний (демо-данные)`;
      dashboardChart.appendChild(bar);
    });
    dashboardPreview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
