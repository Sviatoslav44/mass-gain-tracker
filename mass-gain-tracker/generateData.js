const fs = require('fs');

const mdContent = fs.readFileSync('/home/ubuntu/.openclaw/media/inbound/PLAN_UPDATED_24apr_2jul---f4c954e2-be06-4f78-b412-c03f27c9ded2.md', 'utf-8');

// Recipe mappings
const recipes = {
  "Завтрак": {
    "Овсянка": {
      "ingredients": ["Овсянка 120 г", "Молоко 300 мл", "Яйца 4 шт", "Арахисовая паста 25 г", "Банан 1 шт"],
      "instructions": ["1. Насыпьте 120 г овсянки в тарелку.", "2. Залейте горячим молоком (300 мл) и дайте настояться или варите 3-5 минут.", "3. Пожарьте 4 яйца на сковороде до готовности.", "4. Добавьте в кашу 25 г арахисовой пасты.", "5. Нарежьте банан кружочками и добавьте сверху."]
    },
    "Омлет": {
      "ingredients": ["Яйца 5 шт", "Сыр 40 г", "Хлеб тостовый 2 шт", "Масло сливочное 10 г", "Молоко 300 мл", "Банан 1 шт"],
      "instructions": ["1. Разбейте 5 яиц в миску, добавьте соль и взбейте вилкой.", "2. Вылейте яичную смесь на разогретую сковороду.", "3. За минуту до готовности посыпьте омлет 40 г тертого сыра.", "4. Подсушите 2 тоста и намажьте их сливочным маслом.", "5. Подавайте с кружкой молока и бананом."]
    },
    "Блины": {
      "ingredients": ["Овсянка 120 г", "Яйца 3 шт", "Молоко 250 мл", "Мёд 2 ст.л.", "Банан 1 шт"],
      "instructions": ["1. Измельчите 120 г овсянки в блендере до состояния муки.", "2. Добавьте 3 яйца и немного молока, смешайте до однородной массы.", "3. Выпекайте блины на разогретой сковороде с двух сторон.", "4. Готовые блины полейте 2 столовыми ложками мёда.", "5. Подавайте с нарезанным бананом и оставшимся молоком."]
    }
  },
  "Обед": {
    "Дома": {
      "ingredients": ["Гарнир (рис/гречка/картофель) 140-350 г", "Мясо (курица/говядина) 250 г", "Овощи свежие 150 г", "Масло оливковое 1 ст.л."],
      "instructions": ["1. Отмерьте нужное количество выбранного гарнира (например, 140 г риса).", "2. Отварите гарнир в подсоленной воде до готовности.", "3. Нарежьте 250 г мяса кусочками и обжарьте на сковороде или запеките.", "4. Нарежьте свежие овощи для салата.", "5. Заправьте салат 1 столовой ложкой оливкового масла и подавайте с основным блюдом."]
    }
  },
  "Ужин": {
    "Рис": {
      "ingredients": ["Рис 140 г", "Курица/рыба 250 г", "Овощи 150 г", "Масло оливковое 1 ст.л.", "Хлеб 1 кусок", "Сыр 30 г"],
      "instructions": ["1. Промойте 140 г риса и отварите до готовности.", "2. Замаринуйте 250 г курицы или рыбы в любимых специях.", "3. Запекайте мясо в духовке при 180°C около 20 минут.", "4. Нарежьте овощи и заправьте 1 ст.л. оливкового масла.", "5. Подавайте блюдо с куском хлеба и 30 г сыра."]
    },
    "Макароны": {
      "ingredients": ["Макароны 140 г", "Говяжий фарш 250 г", "Томатная паста 2 ст.л.", "Овощи 150 г", "Масло оливковое 1 ст.л.", "Хлеб 1 кусок", "Сыр 30 г"],
      "instructions": ["1. Отварите 140 г макарон в кипящей подсоленной воде до состояния аль-денте.", "2. Обжарьте 250 г говяжьего фарша на сковороде до изменения цвета.", "3. Добавьте к фаршу 2 ст.л. томатной пасты, соль, специи и немного воды, тушите 5 минут.", "4. Смешайте готовые макароны с мясным соусом.", "5. Подавайте с салатом, заправленным оливковым маслом, и куском хлеба с 30 г сыра."]
    },
    "Картофель": {
      "ingredients": ["Картофель 400 г", "Курица 250 г", "Овощи 150 г", "Масло оливковое 1 ст.л.", "Хлеб 1 кусок", "Сыр 30 г"],
      "instructions": ["1. Очистите 400 г картофеля и нарежьте крупными дольками.", "2. Смешайте картофель со специями и запекайте в духовке 30 минут при 200°C.", "3. Обжарьте или запеките 250 г курицы до готовности.", "4. Нарежьте свежие овощи и заправьте 1 ст.л. оливкового масла.", "5. Подавайте горячий картофель с курицей, салатом и бутербродом с сыром."]
    },
    "Гречка": {
      "ingredients": ["Гречка 130 г", "Свинина/говядина 250 г", "Овощи 150 г", "Масло оливковое 1 ст.л.", "Хлеб 1 кусок", "Сыр 30 г"],
      "instructions": ["1. Промойте 130 г гречневой крупы и отварите до мягкости.", "2. Нарежьте 250 г нежирной свинины или говядины небольшими кусочками.", "3. Обжарьте мясо на сковороде со специями до полной готовности.", "4. Приготовьте салат из 150 г свежих овощей, заправьте 1 ст.л. оливкового масла.", "5. Подавайте гречку с мясом, салатом и куском хлеба с 30 г сыра."]
    }
  },
  "Перед сном": {
    "Протеин": {
      "ingredients": ["Протеин 1 скуп (30 г)", "Молоко 400 мл", "Овсянка 50 г", "Банан 1 шт"],
      "instructions": ["1. Подготовьте блендер для коктейля.", "2. Налейте в чашу блендера 400 мл молока.", "3. Добавьте 1 мерную ложку протеина и 50 г овсянки.", "4. Очистите банан, разломайте на кусочки и добавьте к остальным ингредиентам.", "5. Взбейте коктейль на высокой скорости до однородной консистенции."]
    },
    "Творог": {
      "ingredients": ["Творог 300 г", "Мёд 1 ст.л.", "Орехи 40 г", "Банан 1 шт"],
      "instructions": ["1. Выложите 300 г творога в глубокую тарелку.", "2. Добавьте к творогу 1 столовую ложку мёда.", "3. Отмерьте 40 г любимых орехов (грецкие, миндаль или фундук).", "4. Очистите банан и нарежьте его кружочками.", "5. Тщательно перемешайте все ингредиенты перед употреблением."]
    }
  },
  "Протеин": {
    "ingredients": ["Протеин 1 скуп (30 г)", "Вода 250-300 мл"],
    "instructions": ["1. Возьмите чистый спортивный шейкер.", "2. Налейте в него 250-300 мл чистой воды.", "3. Добавьте 1 мерную ложку протеина.", "4. Плотно закройте крышку шейкера.", "5. Интенсивно взболтайте в течение 15-20 секунд до растворения комочков."]
  }
};

function getRecipe(mealName, items) {
  if (mealName.includes('Завтрак')) {
    if (items.includes('Омлет')) return recipes['Завтрак']['Омлет'];
    if (items.includes('Блины')) return recipes['Завтрак']['Блины'];
    return recipes['Завтрак']['Овсянка'];
  }
  if (mealName.includes('Обед')) {
    if (mealName.includes('Restopolis')) return null;
    return recipes['Обед']['Дома'];
  }
  if (mealName.includes('Ужин')) {
    if (items.includes('Макароны')) return recipes['Ужин']['Макароны'];
    if (items.includes('Картофель')) return recipes['Ужин']['Картофель'];
    if (items.includes('Гречка')) return recipes['Ужин']['Гречка'];
    return recipes['Ужин']['Рис'];
  }
  if (mealName.includes('Перед сном')) {
    if (items.includes('Творог')) return recipes['Перед сном']['Творог'];
    return recipes['Перед сном']['Протеин'];
  }
  if (mealName.includes('Протеин')) return recipes['Протеин'];
  return "";
}

// Exercise GIF mappings (dummy direct realistic links for MVP)
const exerciseGifs = {
  "Жим штанги лёжа": "https://static.exercisedb.dev/animated/0025.gif",
  "Подтягивания с весом": "https://static.exercisedb.dev/animated/1053.gif",
  "Жим гантелей наклонная (30 градусов)": "https://static.exercisedb.dev/animated/0314.gif",
  "Тяга штанги в наклоне": "https://static.exercisedb.dev/animated/0027.gif",
  "Жим гантелей сидя": "https://static.exercisedb.dev/animated/0324.gif",
  "Махи гантелями в стороны": "https://static.exercisedb.dev/animated/0334.gif",
  "Разгибания на блоке (трицепс)": "https://static.exercisedb.dev/animated/0199.gif",
  "Сгибания штанги (бицепс)": "https://static.exercisedb.dev/animated/0031.gif",
  "Приседания со штангой": "https://static.exercisedb.dev/animated/0032.gif",
  "Румынская тяга": "https://static.exercisedb.dev/animated/0817.gif",
  "Жим ногами": "https://static.exercisedb.dev/animated/0585.gif",
  "Сгибания ног лёжа": "https://static.exercisedb.dev/animated/0584.gif",
  "Разгибания ног сидя": "https://static.exercisedb.dev/animated/0588.gif",
  "Подъём на носки стоя": "https://static.exercisedb.dev/animated/1376.gif",
  "Подъём ног в висе": "https://static.exercisedb.dev/animated/0174.gif",
  "Жим штанги сидя": "https://static.exercisedb.dev/animated/0119.gif",
  "Разводки гантелей лёжа": "https://static.exercisedb.dev/animated/0308.gif",
  "Разгибания верёвка (трицепс)": "https://static.exercisedb.dev/animated/0200.gif",
  "Отжимания на брусьях": "https://static.exercisedb.dev/animated/0154.gif",
  "Тяга Т-грифа": "https://static.exercisedb.dev/animated/0118.gif",
  "Горизонтальная тяга (блок)": "https://static.exercisedb.dev/animated/0152.gif",
  "Махи в наклоне (задняя дельта)": "https://static.exercisedb.dev/animated/0345.gif",
  "Шраги с гантелями": "https://static.exercisedb.dev/animated/0302.gif",
  "Молотки с гантелями (бицепс)": "https://static.exercisedb.dev/animated/0313.gif",
  "Становая тяга": "https://static.exercisedb.dev/animated/0032.gif",
  "Гакк-присед": "https://static.exercisedb.dev/animated/0467.gif",
  "Болгарские выпады": "https://static.exercisedb.dev/animated/3103.gif",
  "Hip thrust (ягодичный мостик)": "https://static.exercisedb.dev/animated/1063.gif",
  "Подъём на носки сидя": "https://static.exercisedb.dev/animated/0593.gif",
  "Ab wheel (ролик для пресса)": "https://static.exercisedb.dev/animated/0002.gif",
  "Планка": "https://static.exercisedb.dev/animated/0458.gif"
};

function getGifForExercise(name) {
  for (const key of Object.keys(exerciseGifs)) {
    if (name.includes(key)) return exerciseGifs[key];
  }
  return null; // Fallback
}

// Parse exactly from markdown
let dateExercisesMap = {};
const lines = mdContent.split('\n');
let currentDate = null;
let currentTable = false;

function parseDDMM(ddmm) {
  const [d, m] = ddmm.split('.');
  const date = new Date(Date.UTC(2026, parseInt(m) - 1, parseInt(d)));
  return date.toISOString();
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Example: ### Понедельник 27.04 — UPPER
  const dateMatch = line.match(/^### .*? (\d{2}\.\d{2}) — (.*)$/);
  if (dateMatch) {
    const ddmm = dateMatch[1];
    currentDate = parseDDMM(ddmm);
    dateExercisesMap[currentDate] = [];
    currentTable = false;
    continue;
  }

  if (currentDate && line.startsWith('| # |')) {
    currentTable = true;
    continue;
  }
  if (currentTable && line.startsWith('|---|')) {
    continue;
  }

  if (currentTable) {
    if (!line.startsWith('|')) {
      currentTable = false;
      continue;
    }
    
    // | 1 | Жим штанги лёжа | 4×8 | 80 кг |
    const cols = line.split('|').map(s => s.trim()).filter(Boolean);
    if (cols.length >= 4) {
      const order = parseInt(cols[0]);
      const name = cols[1];
      const setsReps = cols[2];
      const weight = cols[3];
      
      let sets = 0;
      let reps = setsReps;
      if (setsReps.includes('×')) {
        [sets, reps] = setsReps.split('×');
      } else if (setsReps.includes('x')) {
        [sets, reps] = setsReps.split('x');
      }
      
      dateExercisesMap[currentDate].push({
        order,
        name,
        sets: parseInt(sets) || 0,
        reps,
        weight,
        gif: getGifForExercise(name)
      });
    }
  }
}

const mealTemplates = {
  1: [
    { time: "09:00", name: "Завтрак", calories: 1000, items: "Овсянка 120 г (сухая) на молоке 300 мл, 4 яйца (яичница), Банан, 25 г арахисовой пасты" },
    { time: "12:30", name: "Протеин", calories: 120, items: "1 скуп (30 г) на воде в шейкере" },
    { time: "13:00", name: "Обед (Restopolis)", calories: 850, items: "Мясное/рыбное блюдо + углеводный гарнир + салат-бар + хлеб" },
    { time: "18:30", name: "Ужин", calories: 1000, items: "Рис 140 г (сухой), Куриные бёдра/грудка 250 г, Овощи 150 г + 1 ст.л. оливкового масла, Хлеб с сыром 30 г" },
    { time: "23:00", name: "Перед сном", calories: 630, items: "Протеин-шейк: 1 скуп (30 г) + молоко 400 мл + овсянка 50 г + банан — в блендер" }
  ],
  2: [
    { time: "09:00", name: "Завтрак", calories: 1000, items: "Омлет из 5 яиц + сыр 40 г, 2 тоста с маслом, Молоко 300 мл, Банан" },
    { time: "12:30", name: "Протеин", calories: 120, items: "1 скуп на воде" },
    { time: "13:00", name: "Обед (Restopolis)", calories: 850, items: "Мясное/рыбное блюдо + гарнир + салат-бар + хлеб" },
    { time: "18:30", name: "Ужин", calories: 1000, items: "Макароны 140 г (сухие), Говяжий фарш 250 г (болоньезе), Салат с маслом, Хлеб + сыр" },
    { time: "23:00", name: "Перед сном", calories: 630, items: "Творог 300 г + мёд 1 ст.л. + орехи 40 г + банан" }
  ],
  3: [
    { time: "09:00", name: "Завтрак", calories: 1000, items: "Овсянка 120 г на молоке 300 мл, 3 яйца, 25 г арахисовой пасты, Банан" },
    { time: "13:00", name: "Обед (Restopolis)", calories: 850, items: "Мясное/рыбное блюдо + гарнир + салат-бар + хлеб" },
    { time: "18:30", name: "Ужин", calories: 1050, items: "Картофель 400 г, Курица 250 г, Овощи + масло, Хлеб с сыром" },
    { time: "23:00", name: "Перед сном", calories: 700, items: "Протеин-шейк: 1.5 скупа (45 г) + молоко 400 мл + овсянка 50 г + арахисовая паста 20 г" }
  ],
  4: [
    { time: "09:00", name: "Завтрак", calories: 1000, items: "Яичница из 4 яиц, 2 тоста + авокадо 1/2, Молоко 300 мл, Банан" },
    { time: "12:30", name: "Протеин", calories: 120, items: "1 скуп на воде" },
    { time: "13:00", name: "Обед (Restopolis)", calories: 850, items: "Мясное/рыбное блюдо + гарнир + салат-бар + хлеб" },
    { time: "18:30", name: "Ужин", calories: 1000, items: "Гречка 130 г (сухая), Свинина/говядина 250 г, Салат с маслом, Хлеб с сыром" },
    { time: "23:00", name: "Перед сном", calories: 630, items: "Творог 300 г + орехи 40 г + мёд + банан" }
  ],
  5: [
    { time: "09:00", name: "Завтрак", calories: 1000, items: "Овсянка 120 г на молоке 300 мл, 4 яйца, Арахисовая паста 25 г, Банан" },
    { time: "12:30", name: "Протеин", calories: 120, items: "1 скуп на воде" },
    { time: "13:00", name: "Обед (Restopolis)", calories: 850, items: "Мясное/рыбное блюдо + гарнир + салат-бар + хлеб" },
    { time: "18:30", name: "Ужин", calories: 1000, items: "Рис 140 г (сухой), Рыба (лосось/треска) 250 г, Овощи + масло, Хлеб" },
    { time: "23:00", name: "Перед сном", calories: 630, items: "Протеин-шейк: 1 скуп + молоко 400 мл + овсянка 50 г + банан" }
  ],
  6: [
    { time: "09:00", name: "Завтрак", calories: 1000, items: "Блины: 120 г овсянки + 3 яйца + молоко — смешать, жарить, Мёд 2 ст.л., Банан, Молоко 250 мл" },
    { time: "12:30", name: "Протеин", calories: 120, items: "1 скуп на воде" },
    { time: "13:00", name: "Обед ДОМА", calories: 950, items: "Картофель 350 г или рис 140 г, Курица/говядина 250 г, Овощи + масло" },
    { time: "18:30", name: "Ужин", calories: 900, items: "Макароны 130 г (сухие), Куриные бёдра 250 г, Салат с маслом, Хлеб с сыром" },
    { time: "23:00", name: "Перед сном", calories: 630, items: "Творог 300 г + орехи 40 г + мёд + банан" }
  ],
  0: [
    { time: "09:00", name: "Завтрак", calories: 1000, items: "Овсянка 120 г + молоко 300 мл + банан + арахисовая паста 25 г, 4 яйца" },
    { time: "13:00", name: "Обед ДОМА", calories: 1000, items: "Гречка 130 г (сухая), Мясо (любое) 250 г, Овощи + масло, Хлеб" },
    { time: "18:30", name: "Ужин", calories: 950, items: "Рис 130 г (сухой), Рыба 250 г, Салат + масло, Хлеб с сыром" },
    { time: "23:00", name: "Перед сном", calories: 650, items: "Протеин-шейк: 1.5 скупа + молоко 400 мл + овсянка 50 г + банан" }
  ]
};

const startDate = new Date('2026-04-24T00:00:00.000Z');
const endDate = new Date('2026-07-02T00:00:00.000Z');

function getType(date) {
  const day = date.getDay(); // 0 = Sun, 1 = Mon ...
  if (day === 1) return "UPPER";
  if (day === 2) return "LOWER";
  if (day === 3) return "REST";
  if (day === 4) return "PUSH";
  if (day === 5) return "PULL";
  if (day === 6) return "LEGS";
  if (day === 0) return "REST";
  return "REST";
}

function getDayInfo(dayNumber) {
  const week = Math.ceil(dayNumber / 7);
  let phase = "Вкатка";
  let baseCalories = 3600;

  if (dayNumber <= 3) {
    phase = "Старт-блок";
  } else if (week >= 1 && week <= 4) {
    phase = week <= 2 ? "Вкатка" : "Набор";
  } else if (week >= 5 && week <= 6) {
    phase = "Основной набор";
    baseCalories = 3800;
  } else if (week === 7) {
    phase = "Deload";
    baseCalories = 3800;
  } else if (week >= 8 && week <= 9) {
    phase = "Финальный рывок";
    baseCalories = 3900;
  } else if (dayNumber >= 64) {
    phase = "Финальный блок";
    baseCalories = 3900;
  }
  return { phase, baseCalories };
}

function generate() {
  const plans = [];
  let currDate = new Date(startDate);
  let dayNumber = 1;

  while (currDate <= endDate) {
    const type = getType(currDate);
    const { phase, baseCalories } = getDayInfo(dayNumber);
    const dayOfWeek = currDate.getDay();
    const isoDate = currDate.toISOString();

    let meals = JSON.parse(JSON.stringify(mealTemplates[dayOfWeek]));
    
    // Assign IDs, recipes, and adjust calories
    meals = meals.map((m, i) => {
      m.id = `${isoDate}_meal_${i}`;
      m.recipe = getRecipe(m.name, m.items);
      if (baseCalories === 3800 && m.name.includes("Ужин")) {
        m.calories += 200;
      }
      if (baseCalories >= 3900) {
        if (m.name.includes("Ужин")) m.calories += 150;
        if (m.name.includes("Перед сном")) m.calories += 150;
      }
      return m;
    });

    let exercises = dateExercisesMap[isoDate] || [];
    // Ensure IDs are unique
    exercises = exercises.map((ex, i) => ({ ...ex, id: `${isoDate}_ex_${i}` }));

    plans.push({
      date: isoDate,
      dayNumber,
      phase,
      type,
      baseCalories,
      meals,
      exercises
    });

    currDate.setDate(currDate.getDate() + 1);
    dayNumber++;
  }

  fs.writeFileSync('planData.json', JSON.stringify(plans, null, 2));
  console.log('planData.json updated successfully with exact weights and recipes.');
}

generate();
