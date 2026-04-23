const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const startDate = new Date('2026-04-24T00:00:00.000Z');
const endDate = new Date('2026-07-02T00:00:00.000Z');

// Calculate phase and calories
function getDayInfo(dayNumber: number) {
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

function getType(date: Date) {
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

function getMeals(type: string, baseCalories: number, day: number) {
  // A simplified version, adjust based on day type
  const isWeekend = (day === 0 || day === 6);
  
  let meals = [];
  if (type === "REST") {
    meals = [
      { time: "09:00", name: "Завтрак", calories: 1000, items: "Овсянка 120г, Яйца, Банан, Арахисовая паста" },
      { time: "13:00", name: "Обед", calories: isWeekend ? 1000 : 850, items: isWeekend ? "Дома: Гречка/Рис, Мясо/Рыба" : "Restopolis: Мясо/Рыба + Гарнир + Салат" },
      { time: "18:30", name: "Ужин", calories: 1050, items: "Углеводы + Мясо/Рыба + Овощи" },
      { time: "23:00", name: "Перед сном", calories: 700, items: "Протеин-шейк/Творог" },
    ];
  } else {
    meals = [
      { time: "09:00", name: "Завтрак", calories: 1000, items: "Углеводы, Яйца, Банан" },
      { time: "12:30", name: "Протеин (после зала)", calories: 120, items: "1 скуп на воде" },
      { time: "13:00", name: "Обед", calories: isWeekend ? 950 : 850, items: isWeekend ? "Дома: Картофель/Рис, Мясо" : "Restopolis: Мясо/Рыба + Гарнир" },
      { time: "18:30", name: "Ужин", calories: 1000, items: "Углеводы + Мясо/Рыба + Овощи" },
      { time: "23:00", name: "Перед сном", calories: 630, items: "Творог/Протеин-шейк" },
    ];
  }
  
  if (baseCalories === 3800) {
    meals[meals.findIndex(m => m.name === "Ужин")].calories += 200;
  } else if (baseCalories === 3900) {
    meals[meals.findIndex(m => m.name === "Ужин")].calories += 150;
    meals[meals.findIndex(m => m.name === "Перед сном")].calories += 150;
  }

  return meals;
}

const exercisesMap = {
  "UPPER": [
    { order: 1, name: "Жим штанги лёжа", sets: 4, reps: "6-8", weight: "По прогрессии" },
    { order: 2, name: "Подтягивания с весом", sets: 4, reps: "6-8", weight: "По прогрессии" },
    { order: 3, name: "Жим гантелей наклонная", sets: 3, reps: "8-10", weight: "28-36 кг" },
    { order: 4, name: "Тяга штанги", sets: 3, reps: "8-10", weight: "70-85 кг" },
  ],
  "LOWER": [
    { order: 1, name: "Приседания", sets: 4, reps: "5-8", weight: "По прогрессии" },
    { order: 2, name: "Румынская тяга", sets: 3, reps: "8-10", weight: "80-100 кг" },
    { order: 3, name: "Жим ногами", sets: 3, reps: "10-12", weight: "150-200 кг" },
  ],
  "PUSH": [
    { order: 1, name: "Жим штанги лёжа", sets: 4, reps: "6-8", weight: "По прогрессии" },
    { order: 2, name: "Жим гантелей наклонная", sets: 3, reps: "8-10", weight: "28-36 кг" },
    { order: 3, name: "Жим штанги сидя", sets: 3, reps: "8-10", weight: "45-57.5 кг" },
  ],
  "PULL": [
    { order: 1, name: "Подтягивания с весом", sets: 4, reps: "6-8", weight: "По прогрессии" },
    { order: 2, name: "Тяга штанги", sets: 3, reps: "8-10", weight: "70-85 кг" },
    { order: 3, name: "Горизонтальная тяга", sets: 3, reps: "10-12", weight: "55-70 кг" },
  ],
  "LEGS": [
    { order: 1, name: "Становая тяга", sets: 4, reps: "5-6", weight: "По прогрессии" },
    { order: 2, name: "Гакк-присед", sets: 3, reps: "8-10", weight: "80-110 кг" },
    { order: 3, name: "Болгарские выпады", sets: 3, reps: "10", weight: "16-24 кг" },
  ],
};

async function main() {
  await prisma.meal.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.dailyPlan.deleteMany({});
  
  let currDate = new Date(startDate);
  let dayNumber = 1;

  while (currDate <= endDate) {
    const type = getType(currDate);
    const { phase, baseCalories } = getDayInfo(dayNumber);
    const dayOfWeek = currDate.getDay();

    await prisma.dailyPlan.create({
      data: {
        date: new Date(currDate),
        dayNumber,
        phase,
        type,
        baseCalories,
        meals: {
          create: getMeals(type, baseCalories, dayOfWeek)
        },
        exercises: {
          create: type !== "REST" ? exercisesMap[type] : []
        }
      }
    });

    currDate.setDate(currDate.getDate() + 1);
    dayNumber++;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });