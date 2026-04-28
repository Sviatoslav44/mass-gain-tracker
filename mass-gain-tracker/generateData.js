const fs = require('fs');

const mdContent = fs.readFileSync('/home/ubuntu/.openclaw/media/inbound/PLAN_UPDATED_24apr_2jul---f4c954e2-be06-4f78-b412-c03f27c9ded2.md', 'utf-8');

// Recipe mappings
const recipes = {
  "Завтрак": {
    "Овсянка": "1. Насыпьте овсянку в тарелку. 2. Залейте горячим молоком или варите 3-5 минут. 3. Пожарьте яйца на сковороде. 4. Добавьте арахисовую пасту и нарезанный банан в кашу.",
    "Омлет": "1. Разбейте 5 яиц в миску, взбейте с солью. 2. Вылейте на разогретую сковороду. 3. За минуту до готовности посыпьте тертым сыром. 4. Поджарьте тосты, намажьте маслом.",
    "Блины": "1. Смешайте в блендере овсянку, яйца и немного молока до однородной массы. 2. Выпекайте на сковороде как обычные блины. 3. Полейте медом, подавайте с бананом."
  },
  "Обед": {
    "Restopolis": "Питание в заведении. Выбирайте мясо/рыбу, большую порцию углеводов (рис/гречка) и много овощей из салат-бара.",
    "Дома": "1. Отварите гарнир (рис/гречка/картофель). 2. Обжарьте или запеките мясо (курица/говядина). 3. Нарежьте свежие овощи и заправьте оливковым маслом."
  },
  "Ужин": {
    "Рис": "1. Промойте рис, отварите до готовности. 2. Запеките рыбу/курицу в духовке (20 мин при 180°C). 3. Подавайте со свежими овощами.",
    "Макароны": "1. Отварите макароны аль-денте. 2. Обжарьте говяжий фарш с томатной пастой и специями. 3. Смешайте, посыпьте сыром.",
    "Картофель": "1. Нарежьте картофель дольками, запекайте 30 мин. 2. Обжарьте курицу. 3. Сделайте салат.",
    "Гречка": "1. Отварите гречку. 2. Обжарьте кусочки нежирной свинины/говядины. 3. Подавайте с овощами."
  },
  "Перед сном": {
    "Протеин": "1. Налейте в блендер молоко. 2. Добавьте протеин, овсянку и банан. 3. Взбейте до однородности.",
    "Творог": "1. Выложите творог в тарелку. 2. Добавьте ложку меда и горсть орехов. 3. Нарежьте банан."
  },
  "Протеин": "1. Налейте 250-300 мл воды в шейкер. 2. Добавьте 1 мерную ложку протеина. 3. Хорошо взболтайте."
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
  "Жим штанги лёжа": "https://media.giphy.com/media/3o7TKnO6Wve6502iJq/giphy.gif",
  "Подтягивания": "https://media.giphy.com/media/3oz8xSDjJk1wN8pLQA/giphy.gif",
  "Жим гантелей наклонная": "https://media.giphy.com/media/xT9DPxggC8w6kOqjCM/giphy.gif",
  "Тяга штанги": "https://media.giphy.com/media/l41YkxvU8c7J7Bba0/giphy.gif",
  "Приседания": "https://media.giphy.com/media/l0HlJzETeR7P6cZlS/giphy.gif",
  "Румынская тяга": "https://media.giphy.com/media/3o6Ztg2MgUkcXyCpnG/giphy.gif",
  "Жим ногами": "https://media.giphy.com/media/xT9DPIlGnuHpr2yOic/giphy.gif",
  "Становая тяга": "https://media.giphy.com/media/l0HlO4q8nBf7XnOo8/giphy.gif",
  "Гакк-присед": "https://media.giphy.com/media/3o7TKMJcCO91djtGfe/giphy.gif",
  "Отжимания на брусьях": "https://media.giphy.com/media/3o7TKrEzvLbgzG1nJ6/giphy.gif"
};

function getGifForExercise(name) {
  for (const key of Object.keys(exerciseGifs)) {
    if (name.includes(key)) return exerciseGifs[key];
  }
  return "https://media.giphy.com/media/dummy/giphy.gif"; // Fallback
}

// Parse exactly from markdown
let dateExercisesMap = {};
const lines = mdContent.split('\n');
let currentDate = null;
let currentTable = false;

function parseDDMM(ddmm) {
  const [d, m] = ddmm.split('.');
  const date = new Date(Date.UTC(2026, parseInt(m) - 1, parseInt(d)));
  // Shift by -10 days to match new plan start (14 April instead of 24 April)
  date.setDate(date.getDate() - 10);
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

const startDate = new Date('2026-04-14T00:00:00.000Z');
const endDate = new Date('2026-06-12T00:00:00.000Z');

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
      
      // Update creatine for week 1
      if (Math.ceil(dayNumber / 7) === 1) {
        m.items = m.items.replace("Креатин 5 г", "Креатин 20 г");
      }

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
