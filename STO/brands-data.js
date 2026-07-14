/**
 * Марки автомобилей, с которыми работает автосервис.
 * Единый источник данных для блока «Марки авто» (см. index.html, #brands-list).
 * Статическая разметка в index.html сгенерирована из этого массива —
 * при добавлении/замене марки редактируйте этот файл и логотип в assets/car-brands/,
 * затем пересоберите список <li> (см. STO/tools/build-brands.js).
 *
 * @typedef {Object} CarBrand
 * @property {string} code - короткий код марки для бейджа-заглушки без логотипа
 * @property {string} name - отображаемое название марки
 * @property {string|null} logo - относительный путь к локальному файлу логотипа (svg/png) или null
 * @property {string} alt - alt-текст логотипа
 */

/** @type {CarBrand[]} */
window.CAR_BRANDS = [
  { code: 'TO', name: 'Toyota', logo: 'assets/car-brands/toyota.svg', alt: 'Логотип Toyota' },
  { code: 'KI', name: 'Kia', logo: 'assets/car-brands/kia.svg', alt: 'Логотип Kia' },
  { code: 'HY', name: 'Hyundai', logo: 'assets/car-brands/hyundai.svg', alt: 'Логотип Hyundai' },
  { code: 'VW', name: 'Volkswagen', logo: 'assets/car-brands/volkswagen.svg', alt: 'Логотип Volkswagen' },
  { code: 'SK', name: 'Skoda', logo: 'assets/car-brands/skoda.svg', alt: 'Логотип Skoda' },
  { code: 'RE', name: 'Renault', logo: 'assets/car-brands/renault.svg', alt: 'Логотип Renault' },
  { code: 'NI', name: 'Nissan', logo: 'assets/car-brands/nissan.svg', alt: 'Логотип Nissan' },
  { code: 'ВАЗ', name: 'Lada (ВАЗ)', logo: 'assets/car-brands/lada.png', alt: 'Логотип Lada' },
  { code: 'BMW', name: 'BMW', logo: 'assets/car-brands/bmw.svg', alt: 'Логотип BMW' },
  { code: 'AU', name: 'Audi', logo: 'assets/car-brands/audi.svg', alt: 'Логотип Audi' },
  { code: 'FO', name: 'Ford', logo: 'assets/car-brands/ford.svg', alt: 'Логотип Ford' },
  { code: 'MA', name: 'Mazda', logo: 'assets/car-brands/mazda.svg', alt: 'Логотип Mazda' },
  { code: 'MI', name: 'Mitsubishi', logo: 'assets/car-brands/mitsubishi.svg', alt: 'Логотип Mitsubishi' },
  { code: 'HO', name: 'Honda', logo: 'assets/car-brands/honda.svg', alt: 'Логотип Honda' },
  { code: 'LE', name: 'Lexus', logo: 'assets/car-brands/lexus.svg', alt: 'Логотип Lexus' },
  { code: 'VO', name: 'Volvo', logo: 'assets/car-brands/volvo.svg', alt: 'Логотип Volvo' },
  { code: 'CV', name: 'Chevrolet', logo: 'assets/car-brands/chevrolet.svg', alt: 'Логотип Chevrolet' },
  { code: 'PE', name: 'Peugeot', logo: 'assets/car-brands/peugeot.svg', alt: 'Логотип Peugeot' },
  { code: 'OP', name: 'Opel', logo: 'assets/car-brands/opel.png', alt: 'Логотип Opel' },
  { code: 'SU', name: 'Subaru', logo: 'assets/car-brands/subaru.svg', alt: 'Логотип Subaru' },
  { code: 'SZ', name: 'Suzuki', logo: 'assets/car-brands/suzuki.svg', alt: 'Логотип Suzuki' },
  { code: 'IN', name: 'Infiniti', logo: 'assets/car-brands/infiniti.svg', alt: 'Логотип Infiniti' },
  { code: 'JE', name: 'Jeep', logo: 'assets/car-brands/jeep.svg', alt: 'Логотип Jeep' },
  { code: 'DA', name: 'Datsun', logo: 'assets/car-brands/datsun.png', alt: 'Логотип Datsun' },
  { code: 'УАЗ', name: 'УАЗ', logo: 'assets/car-brands/uaz.png', alt: 'Логотип УАЗ' },
  { code: 'GE', name: 'Geely', logo: 'assets/car-brands/geely.png', alt: 'Логотип Geely' },
  { code: 'CH', name: 'Chery', logo: 'assets/car-brands/chery.svg', alt: 'Логотип Chery' },
  { code: 'HA', name: 'Haval', logo: 'assets/car-brands/haval.png', alt: 'Логотип Haval' },
  { code: 'CN', name: 'Changan', logo: 'assets/car-brands/changan.png', alt: 'Логотип Changan' },
  { code: 'EX', name: 'Exeed', logo: 'assets/car-brands/exeed.png', alt: 'Логотип Exeed' },
  { code: 'OM', name: 'Omoda', logo: 'assets/car-brands/omoda.svg', alt: 'Логотип Omoda' },
  { code: 'JAC', name: 'JAC', logo: 'assets/car-brands/jac.png', alt: 'Логотип JAC' },
  { code: 'TA', name: 'Tank', logo: null, alt: 'Tank' },
  { code: 'JT', name: 'Jetour', logo: 'assets/car-brands/jetour.png', alt: 'Логотип Jetour' },
  { code: 'EV', name: 'Evolute', logo: null, alt: 'Evolute' }
];
