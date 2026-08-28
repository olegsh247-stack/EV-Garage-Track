// Данные коммерческого электротранспорта (грузовики, фургоны, рефрижераторы)
// из Китая, грузоподъёмностью 1.0–3.5 тонны. Формат гибкий: бренд → модель →
// версия (Trim). Порядок полей в Trim примерно соответствует логике показа
// характеристик на странице модели: сначала грузовые параметры, потом кузов,
// батарея и запас хода, двигатель, зарядка, габариты и шасси, эксплуатация,
// гарантия и (для рефрижераторов) холодильная установка.
//
// ВНИМАНИЕ: значения ориентировочные, требуют подтверждения по официальным
// спецификациям производителя перед публикацией реальных цен и характеристик.

export type BodyType = "van" | "board" | "refrigerator";

export const BODY_TYPE_LABELS: Record<BodyType, string> = {
  van: "Фургон",
  board: "Бортовой",
  refrigerator: "Рефрижератор",
};

export type ChargingConnector = "GB-T" | "CCS2";

export type LicenseCategory = "B" | "C";

// Холодильная установка — только для рефрижераторов
export type Refrigerator = {
  brand: string; // производитель установки, напр. "Thermo King"
  type: string; // "автономная" | "прямого охлаждения" и т.п.
  tempMin: number; // нижняя граница диапазона, °C
  tempMax: number; // верхняя граница диапазона, °C
};

export type Trim = {
  slug: string; // для URL версии
  name: string; // отображаемое название версии
  priceFrom: number; // ориентировочная цена «под ключ» в рублях
  priceCny?: number; // цена в юанях, если известна

  // Грузовые характеристики
  payloadKg: number; // грузоподъёмность, кг
  gvwKg: number; // полная масса (GVW), кг
  curbWeightKg: number; // снаряжённая масса, кг

  // Батарея и запас хода
  rangeKm: number; // запас хода, км
  batteryKwh: number; // ёмкость батареи, кВт·ч
  batteryType: string; // тип батареи, напр. "LFP"
  consumptionKwh: number; // расход с грузом, кВт·ч/100 км

  // Двигатель
  motorPowerKw: number; // мощность двигателя, кВт
  motorPowerHp: number; // мощность двигателя, л.с.
  motorModel?: string; // модель/индекс двигателя

  // Зарядка
  chargingConnector: ChargingConnector; // тип разъёма
  chargingSpeedKw: number; // мощность зарядки, кВт
  fastCharge: string; // время быстрой зарядки, напр. "1.5 ч (20→80%)"

  // Габариты (внешние)
  lengthMm: number;
  widthMm: number;
  heightMm: number;

  // Кузов (грузовой отсек)
  cargoLengthMm: number;
  cargoWidthMm: number;
  cargoHeightMm: number;
  cargoVolumeM3: number; // объём кузова, м³
  loadHeightMm: number; // погрузочная высота, мм
  doorType: string; // тип открывания дверей кузова

  // Шасси / оси
  axleLoadFront: number; // нагрузка на переднюю ось, кг
  axleLoadRear: number; // нагрузка на заднюю ось, кг
  turningRadiusM: number; // радиус разворота, м
  groundClearanceMm: number; // дорожный просвет, мм

  // Эксплуатация
  licenseCategory: LicenseCategory; // категория прав

  // Гарантия
  batteryWarrantyYears: number;
  batteryWarrantyKm: number;
  warrantyYears: number;
  warrantyKm: number;

  // Холодильная установка — только для рефрижераторов, иначе null
  refrigerator?: Refrigerator | null;

  highlight?: string; // короткая фраза о ключевой особенности
};

export type Model = {
  slug: string;
  name: string;
  tagline: string;
  bodyType: BodyType;
  image?: string; // путь к фото/плейсхолдеру модели
  description: string;
  trims: Trim[];
};

export type Brand = {
  slug: string;
  name: string;
  country: string;
  description: string;
  accent: string; // акцентный цвет бренда
  logo: string; // короткая текстовая метка
  models: Model[];
};

// Общий максимум для шкалы запаса хода на карточках
export const RANGE_SCALE_MAX = 350;

// Раздел характеристик — сгруппированные строки для страницы модели.
export type SpecRow = { label: string; value: string };
export type SpecSection = { title: string; rows: SpecRow[] };

function formatTempRange(min: number, max: number): string {
  const fmt = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  return `${fmt(min)}…${fmt(max)} °C`;
}

export function specSections(model: Model, trim: Trim): SpecSection[] {
  const sections: SpecSection[] = [];

  sections.push({
    title: "Грузовые характеристики",
    rows: [
      { label: "Грузоподъёмность", value: `${trim.payloadKg} кг` },
      { label: "Полная масса", value: `${trim.gvwKg} кг` },
      { label: "Снаряжённая масса", value: `${trim.curbWeightKg} кг` },
    ],
  });

  sections.push({
    title: "Кузов",
    rows: [
      { label: "Тип кузова", value: BODY_TYPE_LABELS[model.bodyType] },
      {
        label: "Внутренние размеры (Д×Ш×В)",
        value: `${trim.cargoLengthMm} × ${trim.cargoWidthMm} × ${trim.cargoHeightMm} мм`,
      },
      { label: "Объём кузова", value: `${trim.cargoVolumeM3} м³` },
      { label: "Погрузочная высота", value: `${trim.loadHeightMm} мм` },
      { label: "Открывание дверей", value: trim.doorType },
    ],
  });

  sections.push({
    title: "Батарея и запас хода",
    rows: [
      { label: "Запас хода", value: `${trim.rangeKm} км` },
      {
        label: "Батарея",
        value: `${trim.batteryKwh} кВт·ч (${trim.batteryType})`,
      },
      {
        label: "Расход с грузом",
        value: `${trim.consumptionKwh} кВт·ч/100 км`,
      },
    ],
  });

  const motorRows: SpecRow[] = [
    {
      label: "Мощность двигателя",
      value: `${trim.motorPowerHp} л.с. (${trim.motorPowerKw} кВт)`,
    },
  ];
  if (trim.motorModel) {
    motorRows.push({ label: "Модель двигателя", value: trim.motorModel });
  }
  sections.push({ title: "Двигатель", rows: motorRows });

  sections.push({
    title: "Зарядка",
    rows: [
      { label: "Тип разъёма", value: trim.chargingConnector },
      { label: "Мощность зарядки", value: `${trim.chargingSpeedKw} кВт` },
      { label: "Быстрая зарядка", value: trim.fastCharge },
    ],
  });

  sections.push({
    title: "Габариты и шасси",
    rows: [
      {
        label: "Длина / Ширина / Высота",
        value: `${trim.lengthMm} / ${trim.widthMm} / ${trim.heightMm} мм`,
      },
      {
        label: "Нагрузка на ось (перед/зад)",
        value: `${trim.axleLoadFront} / ${trim.axleLoadRear} кг`,
      },
      { label: "Радиус разворота", value: `${trim.turningRadiusM} м` },
      { label: "Дорожный просвет", value: `${trim.groundClearanceMm} мм` },
    ],
  });

  sections.push({
    title: "Эксплуатация",
    rows: [{ label: "Категория прав", value: trim.licenseCategory }],
  });

  sections.push({
    title: "Гарантия",
    rows: [
      {
        label: "На батарею",
        value: `${trim.batteryWarrantyYears} лет / ${trim.batteryWarrantyKm.toLocaleString("ru-RU")} км`,
      },
      {
        label: "Общая",
        value: `${trim.warrantyYears} года / ${trim.warrantyKm.toLocaleString("ru-RU")} км`,
      },
    ],
  });

  if (trim.refrigerator) {
    const r = trim.refrigerator;
    sections.push({
      title: "Холодильная установка",
      rows: [
        { label: "Производитель", value: r.brand },
        { label: "Тип", value: r.type },
        {
          label: "Диапазон температур",
          value: formatTempRange(r.tempMin, r.tempMax),
        },
      ],
    });
  }

  return sections;
}

// Плоский список характеристик — для страницы сравнения.
export function fullSpecRows(model: Model, trim: Trim): SpecRow[] {
  return specSections(model, trim).flatMap((s) => s.rows);
}

export const brands: Brand[] = [
  {
    slug: "byd",
    name: "BYD",
    country: "Китай",
    accent: "#E62129",
    logo: "BYD",
    description:
      "Крупнейший производитель электротранспорта в Китае. Собственные батареи Blade (LFP) и полный модельный ряд коммерческих фургонов и грузовиков.",
    models: [
      {
        slug: "byd-t5",
        name: "BYD T5",
        tagline: "Городской развозной фургон 1.5 т",
        bodyType: "van",
        image: "/images/trucks/byd-t5.svg",
        description:
          "Лёгкий электрический фургон для городской доставки. Компактные габариты, права категории B и батарея Blade для стабильного пробега в режиме «старт-стоп».",
        trims: [
          {
            slug: "standart",
            name: "Стандарт",
            priceFrom: 3_200_000,
            priceCny: 105_000,
            payloadKg: 1500,
            gvwKg: 4200,
            curbWeightKg: 2700,
            rangeKm: 200,
            batteryKwh: 72.6,
            batteryType: "LFP (Blade)",
            consumptionKwh: 30,
            motorPowerKw: 100,
            motorPowerHp: 136,
            motorModel: "BYD TZ180",
            chargingConnector: "GB-T",
            chargingSpeedKw: 60,
            fastCharge: "1.2 ч (20→80%)",
            lengthMm: 5495,
            widthMm: 1720,
            heightMm: 2360,
            cargoLengthMm: 3300,
            cargoWidthMm: 1620,
            cargoHeightMm: 1720,
            cargoVolumeM3: 9.2,
            loadHeightMm: 720,
            doorType: "Распашные задние + сдвижная боковая",
            axleLoadFront: 1600,
            axleLoadRear: 2600,
            turningRadiusM: 6.1,
            groundClearanceMm: 160,
            licenseCategory: "B",
            batteryWarrantyYears: 5,
            batteryWarrantyKm: 150000,
            warrantyYears: 3,
            warrantyKm: 100000,
            refrigerator: null,
            highlight: "Батарея Blade и права категории B",
          },
        ],
      },
      {
        slug: "byd-t7",
        name: "BYD T7",
        tagline: "Закрытый фургон полной массой до 7.5 т",
        bodyType: "van",
        image: "/images/trucks/byd-t7.svg",
        description:
          "Средний закрытый фургон для межгородской и регулярной городской логистики. Грузоподъёмность 3.5 тонны, большой объём кузова и быстрая зарядка.",
        trims: [
          {
            slug: "standart",
            name: "Стандарт",
            priceFrom: 5_900_000,
            priceCny: 179_000,
            payloadKg: 3500,
            gvwKg: 7490,
            curbWeightKg: 3990,
            rangeKm: 230,
            batteryKwh: 140.7,
            batteryType: "LFP (Blade)",
            consumptionKwh: 55,
            motorPowerKw: 150,
            motorPowerHp: 204,
            motorModel: "BYD TZ220",
            chargingConnector: "GB-T",
            chargingSpeedKw: 100,
            fastCharge: "1.5 ч (20→80%)",
            lengthMm: 7000,
            widthMm: 2100,
            heightMm: 3050,
            cargoLengthMm: 4500,
            cargoWidthMm: 1950,
            cargoHeightMm: 2100,
            cargoVolumeM3: 18.4,
            loadHeightMm: 1050,
            doorType: "Распашные задние 270°",
            axleLoadFront: 3100,
            axleLoadRear: 4400,
            turningRadiusM: 8.2,
            groundClearanceMm: 175,
            licenseCategory: "C",
            batteryWarrantyYears: 5,
            batteryWarrantyKm: 200000,
            warrantyYears: 3,
            warrantyKm: 120000,
            refrigerator: null,
            highlight: "Объём кузова 18.4 м³ и зарядка 100 кВт",
          },
        ],
      },
    ],
  },
  {
    slug: "dongfeng",
    name: "Dongfeng",
    country: "Китай",
    accent: "#0F5FAB",
    logo: "DF",
    description:
      "Один из крупнейших автопроизводителей Китая. Широкая линейка электрических бортовых грузовиков и шасси для коммерческого применения.",
    models: [
      {
        slug: "ev350",
        name: "Dongfeng EV350",
        tagline: "Бортовой грузовик 3.5 т",
        bodyType: "board",
        image: "/images/trucks/dongfeng-ev350.svg",
        description:
          "Электрический бортовой грузовик для перевозки палетированных и негабаритных грузов. Открытая платформа, высокая грузоподъёмность и запас хода для городской работы.",
        trims: [
          {
            slug: "standart",
            name: "Стандарт",
            priceFrom: 5_400_000,
            priceCny: 164_000,
            payloadKg: 3500,
            gvwKg: 7500,
            curbWeightKg: 4000,
            rangeKm: 260,
            batteryKwh: 141,
            batteryType: "LFP",
            consumptionKwh: 52,
            motorPowerKw: 140,
            motorPowerHp: 190,
            motorModel: "Dongfeng DM140",
            chargingConnector: "GB-T",
            chargingSpeedKw: 90,
            fastCharge: "1.6 ч (20→80%)",
            lengthMm: 6800,
            widthMm: 2200,
            heightMm: 2500,
            cargoLengthMm: 4300,
            cargoWidthMm: 2100,
            cargoHeightMm: 600,
            cargoVolumeM3: 5.4,
            loadHeightMm: 1150,
            doorType: "Откидные борта (3 стороны)",
            axleLoadFront: 3000,
            axleLoadRear: 4500,
            turningRadiusM: 8.5,
            groundClearanceMm: 190,
            licenseCategory: "C",
            batteryWarrantyYears: 5,
            batteryWarrantyKm: 200000,
            warrantyYears: 3,
            warrantyKm: 120000,
            refrigerator: null,
            highlight: "Запас хода 260 км и откидные борта",
          },
        ],
      },
      {
        slug: "df5ev",
        name: "Dongfeng DF5EV",
        tagline: "Бортовой грузовик 2 т",
        bodyType: "board",
        image: "/images/trucks/dongfeng-df5ev.svg",
        description:
          "Средний бортовой электрогрузовик 2 тонны для регулярной городской доставки. Баланс грузоподъёмности, запаса хода и стоимости владения.",
        trims: [
          {
            slug: "standart",
            name: "Стандарт",
            priceFrom: 4_100_000,
            priceCny: 125_000,
            payloadKg: 2000,
            gvwKg: 4495,
            curbWeightKg: 2495,
            rangeKm: 240,
            batteryKwh: 96,
            batteryType: "LFP",
            consumptionKwh: 40,
            motorPowerKw: 110,
            motorPowerHp: 150,
            motorModel: "Dongfeng DM110",
            chargingConnector: "GB-T",
            chargingSpeedKw: 80,
            fastCharge: "1.3 ч (20→80%)",
            lengthMm: 5995,
            widthMm: 2000,
            heightMm: 2300,
            cargoLengthMm: 4200,
            cargoWidthMm: 1900,
            cargoHeightMm: 550,
            cargoVolumeM3: 4.4,
            loadHeightMm: 1000,
            doorType: "Откидные борта (3 стороны)",
            axleLoadFront: 1800,
            axleLoadRear: 2700,
            turningRadiusM: 7.0,
            groundClearanceMm: 180,
            licenseCategory: "B",
            batteryWarrantyYears: 5,
            batteryWarrantyKm: 150000,
            warrantyYears: 3,
            warrantyKm: 100000,
            refrigerator: null,
            highlight: "Права категории B при 2 тоннах груза",
          },
        ],
      },
    ],
  },
  {
    slug: "jac",
    name: "JAC",
    country: "Китай",
    accent: "#C8102E",
    logo: "JAC",
    description:
      "JAC Motors — производитель лёгкого коммерческого транспорта с большим опытом в электрофургонах для последней мили.",
    models: [
      {
        slug: "iev6e",
        name: "JAC iEV6E",
        tagline: "Компактный фургон 1 т для последней мили",
        bodyType: "van",
        image: "/images/trucks/jac-iev6e.svg",
        description:
          "Малый электрический фургон для доставки в плотной городской застройке. Минимальный радиус разворота, права категории B и низкая стоимость эксплуатации.",
        trims: [
          {
            slug: "standart",
            name: "Стандарт",
            priceFrom: 2_450_000,
            priceCny: 75_000,
            payloadKg: 1000,
            gvwKg: 2500,
            curbWeightKg: 1500,
            rangeKm: 250,
            batteryKwh: 41.5,
            batteryType: "LFP",
            consumptionKwh: 17,
            motorPowerKw: 50,
            motorPowerHp: 68,
            motorModel: "JAC TZ160",
            chargingConnector: "GB-T",
            chargingSpeedKw: 40,
            fastCharge: "0.8 ч (20→80%)",
            lengthMm: 4500,
            widthMm: 1620,
            heightMm: 2000,
            cargoLengthMm: 2700,
            cargoWidthMm: 1500,
            cargoHeightMm: 1350,
            cargoVolumeM3: 5.5,
            loadHeightMm: 620,
            doorType: "Распашные задние + сдвижная боковая",
            axleLoadFront: 1100,
            axleLoadRear: 1400,
            turningRadiusM: 5.2,
            groundClearanceMm: 155,
            licenseCategory: "B",
            batteryWarrantyYears: 6,
            batteryWarrantyKm: 150000,
            warrantyYears: 3,
            warrantyKm: 100000,
            refrigerator: null,
            highlight: "Радиус разворота 5.2 м и расход 17 кВт·ч",
          },
        ],
      },
      {
        slug: "n55-ev",
        name: "JAC N55 EV",
        tagline: "Закрытый фургон 2 т",
        bodyType: "van",
        image: "/images/trucks/jac-n55-ev.svg",
        description:
          "Электрический закрытый фургон среднего класса. Просторный кузов и запас хода для комбинированной городской и пригородной логистики.",
        trims: [
          {
            slug: "standart",
            name: "Стандарт",
            priceFrom: 4_350_000,
            priceCny: 132_000,
            payloadKg: 2000,
            gvwKg: 4495,
            curbWeightKg: 2495,
            rangeKm: 255,
            batteryKwh: 106,
            batteryType: "LFP",
            consumptionKwh: 42,
            motorPowerKw: 120,
            motorPowerHp: 163,
            motorModel: "JAC TZ200",
            chargingConnector: "GB-T",
            chargingSpeedKw: 80,
            fastCharge: "1.4 ч (20→80%)",
            lengthMm: 6100,
            widthMm: 2000,
            heightMm: 2750,
            cargoLengthMm: 4100,
            cargoWidthMm: 1900,
            cargoHeightMm: 1950,
            cargoVolumeM3: 15.2,
            loadHeightMm: 950,
            doorType: "Распашные задние 180°",
            axleLoadFront: 1900,
            axleLoadRear: 2600,
            turningRadiusM: 7.4,
            groundClearanceMm: 170,
            licenseCategory: "C",
            batteryWarrantyYears: 6,
            batteryWarrantyKm: 200000,
            warrantyYears: 3,
            warrantyKm: 120000,
            refrigerator: null,
            highlight: "Объём кузова 15.2 м³",
          },
        ],
      },
    ],
  },
  {
    slug: "foton",
    name: "Foton",
    country: "Китай",
    accent: "#003DA5",
    logo: "FT",
    description:
      "Foton Motor — специализированный производитель грузовиков. Серия Aumark хорошо известна на рынке лёгких коммерческих машин.",
    models: [
      {
        slug: "aumark-ev",
        name: "Foton Aumark EV",
        tagline: "Закрытый фургон 3.5 т",
        bodyType: "van",
        image: "/images/trucks/foton-aumark-ev.svg",
        description:
          "Электрический закрытый фургон полной массой до 7.5 тонн. Максимальный объём кузова серии Aumark для регулярной магистральной доставки по городу.",
        trims: [
          {
            slug: "standart",
            name: "Стандарт",
            priceFrom: 5_700_000,
            priceCny: 173_000,
            payloadKg: 3500,
            gvwKg: 7490,
            curbWeightKg: 3990,
            rangeKm: 250,
            batteryKwh: 145,
            batteryType: "LFP",
            consumptionKwh: 54,
            motorPowerKw: 150,
            motorPowerHp: 204,
            motorModel: "Foton TZ230",
            chargingConnector: "GB-T",
            chargingSpeedKw: 100,
            fastCharge: "1.5 ч (20→80%)",
            lengthMm: 7100,
            widthMm: 2200,
            heightMm: 3100,
            cargoLengthMm: 4700,
            cargoWidthMm: 2050,
            cargoHeightMm: 2150,
            cargoVolumeM3: 20.7,
            loadHeightMm: 1080,
            doorType: "Распашные задние + сдвижная боковая",
            axleLoadFront: 3100,
            axleLoadRear: 4400,
            turningRadiusM: 8.4,
            groundClearanceMm: 180,
            licenseCategory: "C",
            batteryWarrantyYears: 5,
            batteryWarrantyKm: 200000,
            warrantyYears: 3,
            warrantyKm: 120000,
            refrigerator: null,
            highlight: "Максимальный объём кузова — 20.7 м³",
          },
        ],
      },
    ],
  },
  {
    slug: "wuling",
    name: "Wuling",
    country: "Китай",
    accent: "#E4002B",
    logo: "WL",
    description:
      "Wuling — лидер по компактному коммерческому транспорту в Китае. Микрогрузовики и фургоны для сверхплотной городской доставки.",
    models: [
      {
        slug: "ev100",
        name: "Wuling EV100",
        tagline: "Микрогрузовик 1 т",
        bodyType: "van",
        image: "/images/trucks/wuling-ev100.svg",
        description:
          "Компактный электрический микрогрузовик для узких улиц и дворов. Права категории B, минимальный расход и лёгкое маневрирование.",
        trims: [
          {
            slug: "standart",
            name: "Стандарт",
            priceFrom: 1_950_000,
            priceCny: 60_000,
            payloadKg: 1000,
            gvwKg: 2300,
            curbWeightKg: 1300,
            rangeKm: 180,
            batteryKwh: 38,
            batteryType: "LFP",
            consumptionKwh: 16,
            motorPowerKw: 50,
            motorPowerHp: 68,
            motorModel: "Wuling TZ130",
            chargingConnector: "GB-T",
            chargingSpeedKw: 40,
            fastCharge: "0.9 ч (20→80%)",
            lengthMm: 4200,
            widthMm: 1600,
            heightMm: 1950,
            cargoLengthMm: 2600,
            cargoWidthMm: 1480,
            cargoHeightMm: 1300,
            cargoVolumeM3: 5.0,
            loadHeightMm: 600,
            doorType: "Распашные задние + сдвижная боковая",
            axleLoadFront: 1000,
            axleLoadRear: 1300,
            turningRadiusM: 5.0,
            groundClearanceMm: 150,
            licenseCategory: "B",
            batteryWarrantyYears: 5,
            batteryWarrantyKm: 120000,
            warrantyYears: 3,
            warrantyKm: 100000,
            refrigerator: null,
            highlight: "Самая доступная модель каталога",
          },
        ],
      },
    ],
  },
  {
    slug: "dfac",
    name: "DFAC",
    country: "Китай",
    accent: "#1D4E89",
    logo: "DFC",
    description:
      "Dongfeng Automobile Co. (DFAC) — подразделение лёгких коммерческих грузовиков Dongfeng, включая рефрижераторы для перевозки продуктов.",
    models: [
      {
        slug: "ev31t",
        name: "DFAC EV31T",
        tagline: "Рефрижератор 3.5 т",
        bodyType: "refrigerator",
        image: "/images/trucks/dfac-ev31t.svg",
        description:
          "Электрический рефрижератор для перевозки скоропортящихся грузов. Автономная холодильная установка с диапазоном до -18 °C и изотермический кузов.",
        trims: [
          {
            slug: "standart",
            name: "Стандарт",
            priceFrom: 6_400_000,
            priceCny: 195_000,
            payloadKg: 3500,
            gvwKg: 7500,
            curbWeightKg: 4000,
            rangeKm: 220,
            batteryKwh: 141,
            batteryType: "LFP",
            consumptionKwh: 58,
            motorPowerKw: 150,
            motorPowerHp: 204,
            motorModel: "DFAC DM150",
            chargingConnector: "GB-T",
            chargingSpeedKw: 100,
            fastCharge: "1.5 ч (20→80%)",
            lengthMm: 7000,
            widthMm: 2200,
            heightMm: 3050,
            cargoLengthMm: 4400,
            cargoWidthMm: 2000,
            cargoHeightMm: 2000,
            cargoVolumeM3: 17.6,
            loadHeightMm: 1100,
            doorType: "Распашные задние 270° с термоуплотнением",
            axleLoadFront: 3100,
            axleLoadRear: 4400,
            turningRadiusM: 8.3,
            groundClearanceMm: 180,
            licenseCategory: "C",
            batteryWarrantyYears: 5,
            batteryWarrantyKm: 200000,
            warrantyYears: 3,
            warrantyKm: 120000,
            refrigerator: {
              brand: "Thermo King",
              type: "автономная",
              tempMin: -18,
              tempMax: 12,
            },
            highlight: "Автономная холодильная установка -18…+12 °C",
          },
        ],
      },
    ],
  },
  {
    slug: "changan",
    name: "Changan",
    country: "Китай",
    accent: "#005BAC",
    logo: "CA",
    description:
      "Changan — один из старейших автопроизводителей Китая. Серия Star включает компактные электрические фургоны для городской логистики.",
    models: [
      {
        slug: "star-ev",
        name: "Changan Star EV",
        tagline: "Фургон 1.5 т",
        bodyType: "van",
        image: "/images/trucks/changan-star-ev.svg",
        description:
          "Электрический городской фургон 1.5 тонны. Оптимален для средних объёмов доставки: права категории B, удобная погрузка и хороший запас хода.",
        trims: [
          {
            slug: "standart",
            name: "Стандарт",
            priceFrom: 2_900_000,
            priceCny: 88_000,
            payloadKg: 1500,
            gvwKg: 3500,
            curbWeightKg: 2000,
            rangeKm: 210,
            batteryKwh: 64,
            batteryType: "LFP",
            consumptionKwh: 28,
            motorPowerKw: 85,
            motorPowerHp: 116,
            motorModel: "Changan TZ170",
            chargingConnector: "GB-T",
            chargingSpeedKw: 60,
            fastCharge: "1.1 ч (20→80%)",
            lengthMm: 5100,
            widthMm: 1680,
            heightMm: 2280,
            cargoLengthMm: 3100,
            cargoWidthMm: 1580,
            cargoHeightMm: 1650,
            cargoVolumeM3: 8.1,
            loadHeightMm: 680,
            doorType: "Распашные задние + сдвижная боковая",
            axleLoadFront: 1500,
            axleLoadRear: 2000,
            turningRadiusM: 5.8,
            groundClearanceMm: 160,
            licenseCategory: "B",
            batteryWarrantyYears: 5,
            batteryWarrantyKm: 150000,
            warrantyYears: 3,
            warrantyKm: 100000,
            refrigerator: null,
            highlight: "1.5 т груза при правах категории B",
          },
        ],
      },
    ],
  },
];

export function getBrand(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export function getModel(brandSlug: string, modelSlug: string) {
  const brand = getBrand(brandSlug);
  const model = brand?.models.find((m) => m.slug === modelSlug);
  return brand && model ? { brand, model } : undefined;
}

export function getTrim(brandSlug: string, modelSlug: string, trimSlug: string) {
  const found = getModel(brandSlug, modelSlug);
  const trim = found?.model.trims.find((t) => t.slug === trimSlug);
  return found && trim ? { ...found, trim } : undefined;
}

// Самая доступная версия модели — используется как «цена от» на карточках.
export function baseTrim(model: Model) {
  return [...model.trims].sort((a, b) => a.priceFrom - b.priceFrom)[0];
}

export function allModelsFlat() {
  return brands.flatMap((b) => b.models.map((m) => ({ brand: b, model: m })));
}

export type RatingMetric = "range" | "payload" | "cargoVolume" | "price";

// Топ-N моделей по параметру — для рейтинговых блоков на главной.
export function topModelsBy(metric: RatingMetric, count = 3) {
  const entries = brands.flatMap((b) =>
    b.models.map((m) => ({ brand: b, model: m, trim: baseTrim(m) }))
  );

  const sorted = [...entries].sort((a, b) => {
    switch (metric) {
      case "range":
        return b.trim.rangeKm - a.trim.rangeKm;
      case "payload":
        return b.trim.payloadKg - a.trim.payloadKg;
      case "cargoVolume":
        return b.trim.cargoVolumeM3 - a.trim.cargoVolumeM3;
      case "price":
      default:
        return a.trim.priceFrom - b.trim.priceFrom;
    }
  });

  return sorted.slice(0, count);
}

// Похожие модели из других брендов, ближайшие по цене.
export function similarTrims(
  excludeModelSlug: string,
  priceFrom: number,
  count = 3
) {
  const all = brands.flatMap((b) =>
    b.models
      .filter((m) => m.slug !== excludeModelSlug)
      .flatMap((m) => m.trims.map((t) => ({ brand: b, model: m, trim: t })))
  );
  return all
    .sort(
      (a, b) =>
        Math.abs(a.trim.priceFrom - priceFrom) -
        Math.abs(b.trim.priceFrom - priceFrom)
    )
    .slice(0, count);
}
