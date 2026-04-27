const fs = require('fs');

const startDate = new Date('2026-04-24T00:00:00.000Z');
const endDate = new Date('2026-07-02T00:00:00.000Z');

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

function getMeals(dayOfWeek, baseCalories) {
  let meals = [];
  if (dayOfWeek === 1) { // Monday
    meals = [
      { id: 'm_1_1', time: "09:00", name: "Завтрак", calories: 1000, items: "Овсянка 120 г (сухая) на молоке 300 мл, 4 яйца (яичница), Банан, 25 г арахисовой пасты" },
      { id: 'm_1_2', time: "12:30", name: "Протеин", calories: 120, items: "1 скуп (30 г) на воде в шейкере" },
      { id: 'm_1_3', time: "13:00", name: "Обед (Restopolis)", calories: 850, items: "Мясное/рыбное блюдо + углеводный гарнир + салат-бар + хлеб" },
      { id: 'm_1_4', time: "18:30", name: "Ужин", calories: 1000, items: "Рис 140 г (сухой), Куриные бёдра/грудка 250 г, Овощи 150 г + 1 ст.л. оливкового масла, Хлеб с сыром 30 г" },
      { id: 'm_1_5', time: "23:00", name: "Перед сном", calories: 630, items: "Протеин-шейк: 1 скуп (30 г) + молоко 400 мл + овсянка 50 г + банан" }
    ];
  } else if (dayOfWeek === 2) { // Tuesday
    meals = [
      { id: 'm_2_1', time: "09:00", name: "Завтрак", calories: 1000, items: "Омлет из 5 яиц + сыр 40 г, 2 тоста с маслом, Молоко 300 мл, Банан" },
      { id: 'm_2_2', time: "12:30", name: "Протеин", calories: 120, items: "1 скуп на воде" },
      { id: 'm_2_3', time: "13:00", name: "Обед (Restopolis)", calories: 850, items: "Мясное/рыбное блюдо + гарнир + салат-бар + хлеб" },
      { id: 'm_2_4', time: "18:30", name: "Ужин", calories: 1000, items: "Макароны 140 г (сухие), Говяжий фарш 250 г (болоньезе), Салат с маслом, Хлеб + сыр" },
      { id: 'm_2_5', time: "23:00", name: "Перед сном", calories: 630, items: "Творог 300 г + мёд 1 ст.л. + орехи 40 г + банан" }
    ];
  } else if (dayOfWeek === 3) { // Wednesday
    meals = [
      { id: 'm_3_1', time: "09:00", name: "Завтрак", calories: 1000, items: "Овсянка 120 г на молоке 300 мл, 3 яйца, 25 г арахисовой пасты, Банан" },
      { id: 'm_3_3', time: "13:00", name: "Обед (Restopolis)", calories: 850, items: "Мясное/рыбное блюдо + гарнир + салат-бар + хлеб" },
      { id: 'm_3_4', time: "18:30", name: "Ужин", calories: 1050, items: "Картофель 400 г, Курица 250 г, Овощи + масло, Хлеб с сыром" },
      { id: 'm_3_5', time: "23:00", name: "Перед сном", calories: 700, items: "Протеин-шейк: 1.5 скупа (45 г) + молоко 400 мл + овсянка 50 г + арахисовая паста 20 г" }
    ];
  } else if (dayOfWeek === 4) { // Thursday
    meals = [
      { id: 'm_4_1', time: "09:00", name: "Завтрак", calories: 1000, items: "Яичница из 4 яиц, 2 тоста + авокадо 1/2, Молоко 300 мл, Банан" },
      { id: 'm_4_2', time: "12:30", name: "Протеин", calories: 120, items: "1 скуп на воде" },
      { id: 'm_4_3', time: "13:00", name: "Обед (Restopolis)", calories: 850, items: "Мясное/рыбное блюдо + гарнир + салат-бар + хлеб" },
      { id: 'm_4_4', time: "18:30", name: "Ужин", calories: 1000, items: "Гречка 130 г (сухая), Свинина/говядина 250 г, Салат с маслом, Хлеб с сыром" },
      { id: 'm_4_5', time: "23:00", name: "Перед сном", calories: 630, items: "Творог 300 г + орехи 40 г + мёд + банан" }
    ];
  } else if (dayOfWeek === 5) { // Friday
    meals = [
      { id: 'm_5_1', time: "09:00", name: "Завтрак", calories: 1000, items: "Овсянка 120 г на молоке 300 мл, 4 яйца, Арахисовая паста 25 г, Банан" },
      { id: 'm_5_2', time: "12:30", name: "Протеин", calories: 120, items: "1 скуп на воде" },
      { id: 'm_5_3', time: "13:00", name: "Обед (Restopolis)", calories: 850, items: "Мясное/рыбное блюдо + гарнир + салат-бар + хлеб" },
      { id: 'm_5_4', time: "18:30", name: "Ужин", calories: 1000, items: "Рис 140 г (сухой), Рыба (лосось/треска) 250 г, Овощи + масло, Хлеб" },
      { id: 'm_5_5', time: "23:00", name: "Перед сном", calories: 630, items: "Протеин-шейк: 1 скуп + молоко 400 мл + овсянка 50 г + банан" }
    ];
  } else if (dayOfWeek === 6) { // Saturday
    meals = [
      { id: 'm_6_1', time: "09:00", name: "Завтрак", calories: 1000, items: "Блины: 120 г овсянки + 3 яйца + молоко — смешать, жарить, Мёд 2 ст.л., Банан, Молоко 250 мл" },
      { id: 'm_6_2', time: "12:30", name: "Протеин", calories: 120, items: "1 скуп на воде" },
      { id: 'm_6_3', time: "13:00", name: "Обед ДОМА", calories: 950, items: "Картофель 350 г или рис 140 г, Курица/говядина 250 г, Овощи + масло" },
      { id: 'm_6_4', time: "18:30", name: "Ужин", calories: 900, items: "Макароны 130 г (сухие), Куриные бёдра 250 г, Салат с маслом, Хлеб с сыром" },
      { id: 'm_6_5', time: "23:00", name: "Перед сном", calories: 630, items: "Творог 300 г + орехи 40 г + мёд + банан" }
    ];
  } else if (dayOfWeek === 0) { // Sunday
    meals = [
      { id: 'm_0_1', time: "09:00", name: "Завтрак", calories: 1000, items: "Овсянка 120 г + молоко 300 мл + банан + арахисовая паста 25 г, 4 яйца" },
      { id: 'm_0_3', time: "13:00", name: "Обед ДОМА", calories: 1000, items: "Гречка 130 г (сухая), Мясо (любое) 250 г, Овощи + масло, Хлеб" },
      { id: 'm_0_4', time: "18:30", name: "Ужин", calories: 950, items: "Рис 130 г (сухой), Рыба 250 г, Салат + масло, Хлеб с сыром" },
      { id: 'm_0_5', time: "23:00", name: "Перед сном", calories: 650, items: "Протеин-шейк: 1.5 скупа + молоко 400 мл + овсянка 50 г + банан" }
    ];
  }

  // Deep clone to avoid id issues
  meals = JSON.parse(JSON.stringify(meals));

  // Adjust macros
  if (baseCalories === 3800) {
    let dinner = meals.find(m => m.name.includes("Ужин"));
    if (dinner) dinner.calories += 200;
  } else if (baseCalories === 3900) {
    let dinner = meals.find(m => m.name.includes("Ужин"));
    let night = meals.find(m => m.name.includes("Перед сном"));
    if (dinner) dinner.calories += 150;
    if (night) night.calories += 150;
  }

  return meals;
}

const exercisesMap = {
  "UPPER": [
    { order: 1, name: "Жим штанги лёжа", sets: 4, reps: "6-8", weight: "По прогрессии" },
    { order: 2, name: "Подтягивания с весом", sets: 4, reps: "6-8", weight: "По прогрессии" },
    { order: 3, name: "Жим гантелей наклонная 30°", sets: 3, reps: "8-10", weight: "По прогрессии" },
    { order: 4, name: "Тяга штанги в наклоне", sets: 3, reps: "8-10", weight: "По прогрессии" },
    { order: 5, name: "Жим гантелей сидя", sets: 3, reps: "10-12", weight: "По прогрессии" },
    { order: 6, name: "Махи в стороны", sets: 3, reps: "12-15", weight: "По прогрессии" },
    { order: 7, name: "Разгибания на блоке (трицепс)", sets: 3, reps: "10-12", weight: "По прогрессии" },
    { order: 8, name: "Сгибания штанга (бицепс)", sets: 3, reps: "10-12", weight: "По прогрессии" }
  ],
  "LOWER": [
    { order: 1, name: "Приседания со штангой", sets: 4, reps: "5-8", weight: "По прогрессии" },
    { order: 2, name: "Румынская тяга", sets: 3, reps: "8-10", weight: "По прогрессии" },
    { order: 3, name: "Жим ногами", sets: 3, reps: "10-12", weight: "По прогрессии" },
    { order: 4, name: "Сгибания ног лёжа", sets: 3, reps: "10-12", weight: "По прогрессии" },
    { order: 5, name: "Разгибания ног", sets: 3, reps: "12-15", weight: "По прогрессии" },
    { order: 6, name: "Подъём на носки стоя", sets: 4, reps: "12-15", weight: "По прогрессии" },
    { order: 7, name: "Подъём ног в висе", sets: 3, reps: "12-15", weight: "Собственный вес" }
  ],
  "PUSH": [
    { order: 1, name: "Жим штанги лёжа", sets: 4, reps: "6-8", weight: "По прогрессии" },
    { order: 2, name: "Жим гантелей наклонная", sets: 3, reps: "8-10", weight: "По прогрессии" },
    { order: 3, name: "Жим штанги сидя", sets: 3, reps: "8-10", weight: "По прогрессии" },
    { order: 4, name: "Разводки гантелей", sets: 3, reps: "12-15", weight: "По прогрессии" },
    { order: 5, name: "Махи в стороны", sets: 3, reps: "12-15", weight: "По прогрессии" },
    { order: 6, name: "Разгибания верёвка (трицепс)", sets: 3, reps: "12-15", weight: "По прогрессии" },
    { order: 7, name: "Отжимания на брусьях", sets: 3, reps: "8-10", weight: "По прогрессии" }
  ],
  "PULL": [
    { order: 1, name: "Подтягивания с весом", sets: 4, reps: "6-8", weight: "По прогрессии" },
    { order: 2, name: "Тяга штанги в наклоне", sets: 3, reps: "8-10", weight: "По прогрессии" },
    { order: 3, name: "Горизонтальная тяга (блок)", sets: 3, reps: "10-12", weight: "По прогрессии" },
    { order: 4, name: "Махи в наклоне (задняя дельта)", sets: 3, reps: "12-15", weight: "По прогрессии" },
    { order: 5, name: "Шраги с гантелями", sets: 3, reps: "10-12", weight: "По прогрессии" },
    { order: 6, name: "Сгибания штанга (бицепс)", sets: 3, reps: "8-10", weight: "По прогрессии" },
    { order: 7, name: "Молотки с гантелями", sets: 3, reps: "10-12", weight: "По прогрессии" }
  ],
  "LEGS": [
    { order: 1, name: "Становая тяга", sets: 4, reps: "5-6", weight: "По прогрессии" },
    { order: 2, name: "Гакк-присед", sets: 3, reps: "8-10", weight: "По прогрессии" },
    { order: 3, name: "Болгарские выпады", sets: 3, reps: "10/ногу", weight: "По прогрессии" },
    { order: 4, name: "Сгибания ног", sets: 3, reps: "10-12", weight: "По прогрессии" },
    { order: 5, name: "Hip thrust", sets: 3, reps: "10-12", weight: "По прогрессии" },
    { order: 6, name: "Подъём на носки сидя", sets: 4, reps: "15-20", weight: "По прогрессии" },
    { order: 7, name: "Планка/Ab wheel", sets: 3, reps: "45 сек / 12", weight: "Собственный вес" }
  ]
};

async function main() {
  const plans = [];
  let currDate = new Date(startDate);
  let dayNumber = 1;

  while (currDate <= endDate) {
    const type = getType(currDate);
    const { phase, baseCalories } = getDayInfo(dayNumber);
    const dayOfWeek = currDate.getDay();

    const isoDate = currDate.toISOString();
    
    // Add unique IDs to meals
    const meals = getMeals(dayOfWeek, baseCalories).map((m, i) => ({
      ...m,
      id: `${isoDate}_meal_${i}`
    }));

    const exercises = type !== "REST" ? exercisesMap[type].map((e, i) => ({
      ...e,
      id: `${isoDate}_ex_${i}`
    })) : [];

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

  fs.writeFileSync('/home/ubuntu/.openclaw/workspace/mass-gain-tracker/planData.json', JSON.stringify(plans, null, 2));
  console.log('planData.json generated successfully');
}

main();