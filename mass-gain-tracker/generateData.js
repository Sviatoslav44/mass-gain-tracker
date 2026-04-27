const fs = require('fs');

const mdContent = fs.readFileSync('/home/ubuntu/.openclaw/media/inbound/PLAN_UPDATED_24apr_2jul---f4c954e2-be06-4f78-b412-c03f27c9ded2.md', 'utf-8');

// Parse exercises from Markdown
const dateExercisesMap = {};

const lines = mdContent.split('\n');
let currentDate = null;
let currentTable = false;

// We need a mapping from "DD.MM" to 2026 Date object string
function parseDDMM(ddmm) {
  const [d, m] = ddmm.split('.');
  const date = new Date(Date.UTC(2026, parseInt(m) - 1, parseInt(d)));
  return date.toISOString();
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Match: ### Понедельник 27.04 — UPPER
  const dateMatch = line.match(/^### .*? (\d{2}\.\d{2}) — (.*)$/);
  if (dateMatch) {
    const ddmm = dateMatch[1];
    currentDate = parseDDMM(ddmm);
    dateExercisesMap[currentDate] = [];
    currentTable = false;
    continue;
  }

  // Detect table
  if (currentDate && line.startsWith('| # |')) {
    currentTable = true;
    continue; // skip header
  }
  if (currentTable && line.startsWith('|---|')) {
    continue; // skip separator
  }

  if (currentTable) {
    if (!line.startsWith('|')) {
      currentTable = false; // end of table
      continue;
    }
    
    // Parse table row
    // | 1 | Жим штанги лёжа | 4×8 | 80 кг |
    const cols = line.split('|').map(s => s.trim()).filter(Boolean);
    if (cols.length === 4) {
      const [orderStr, name, setsReps, weight] = cols;
      const order = parseInt(orderStr);
      let sets = 0;
      let reps = "";
      if (setsReps.includes('×')) {
        [sets, reps] = setsReps.split('×');
      } else if (setsReps.includes('x')) {
        [sets, reps] = setsReps.split('x');
      }
      
      dateExercisesMap[currentDate].push({
        order,
        name,
        sets: parseInt(sets),
        reps,
        weight
      });
    }
  }
}

// Fixed meals according to the exact markdown
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
    
    // Assign IDs and adjust calories
    meals = meals.map((m, i) => {
      m.id = `${isoDate}_meal_${i}`;
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
  console.log('planData.json generated successfully');
}

generate();
