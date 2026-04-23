import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export default async function Page() {
  // Simplification for MVP: We check today's date
  // Normally we'd use timezone of user, here we use UTC/local time simplified
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const plan = await prisma.dailyPlan.findUnique({
    where: { date: today },
    include: { meals: true, exercises: true }
  });

  const weightLog = await prisma.weightLog.findUnique({
    where: { date: today }
  });

  const missingWeight = !weightLog;

  async function logWeight(formData: FormData) {
    'use server';
    const weight = parseFloat(formData.get('weight') as string);
    if (isNaN(weight)) return;

    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    await prisma.weightLog.create({
      data: {
        date,
        weight,
        userId: "user-1", // hardcoded for MVP single user
      }
    });

    revalidatePath('/');
  }

  async function toggleMeal(mealId: string, currentStatus: boolean) {
    'use server';
    await prisma.meal.update({
      where: { id: mealId },
      data: { isCompleted: !currentStatus }
    });
    revalidatePath('/');
  }

  if (missingWeight) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-slate-100">
        <h2 className="text-3xl font-extrabold mb-8 text-emerald-400">Утреннее взвешивание</h2>
        <form action={logWeight} className="w-full max-w-sm flex flex-col gap-6 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
          <p className="text-slate-400 text-center">Введите ваш вес натощак (в кг) для разблокировки плана на день.</p>
          <input 
            type="number" 
            name="weight" 
            step="0.1" 
            min="50"
            max="150"
            required
            autoFocus
            className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl px-6 py-5 text-4xl text-center text-white focus:border-emerald-500 focus:outline-none transition-colors"
            placeholder="85.5"
          />
          <button 
            type="submit"
            className="w-full bg-emerald-500 text-slate-900 font-bold text-xl py-5 rounded-2xl hover:bg-emerald-400 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            Сохранить и продолжить
          </button>
        </form>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">План на сегодня не найден.</h1>
        <p className="text-slate-400">Возможно, 70-дневный план завершен или еще не начался.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      <header className="bg-slate-800/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-700 p-6 pt-12 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{format(today, 'dd.MM.yyyy')}</h1>
          <p className="text-emerald-400 font-semibold text-sm tracking-wide mt-1">
            День {plan.dayNumber}/70 • {plan.phase}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 uppercase tracking-widest">Калории</p>
          <p className="text-xl font-black text-white">{plan.baseCalories}</p>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-8">
        
        {/* Workout Link if exists */}
        {plan.type !== 'REST' && (
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Тренировка</h2>
            <a href="/workout" className="block bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between active:scale-95 transition-transform">
              <div>
                <h3 className="text-xl font-bold text-emerald-400">{plan.type}</h3>
                <p className="text-slate-400 text-sm mt-1">{plan.exercises.length} упражнений</p>
              </div>
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white">
                →
              </div>
            </a>
          </section>
        )}

        {/* Meals */}
        <section>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Питание</h2>
          <div className="space-y-4">
            {plan.meals.map(meal => (
              <form action={toggleMeal.bind(null, meal.id, meal.isCompleted)} key={meal.id}>
                <button type="submit" className={`w-full text-left bg-slate-800 border ${meal.isCompleted ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-700'} rounded-3xl p-5 flex gap-5 items-start active:scale-[0.98] transition-all`}>
                  <div className={`mt-1 w-8 h-8 shrink-0 rounded-xl border-2 flex items-center justify-center transition-colors ${meal.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}>
                    {meal.isCompleted && <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-emerald-400 font-bold">{meal.time}</span>
                      <span className={`text-lg font-bold ${meal.isCompleted ? 'text-slate-300 line-through decoration-slate-500' : 'text-white'}`}>{meal.name}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">{meal.items}</p>
                    <div className="inline-block bg-slate-900 px-3 py-1 rounded-lg text-xs font-semibold text-slate-300">
                      ~{meal.calories} ккал
                    </div>
                  </div>
                </button>
              </form>
            ))}
          </div>
        </section>

      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-slate-800/90 backdrop-blur-xl border-t border-slate-700 pb-safe">
        <div className="flex justify-around p-4 max-w-md mx-auto">
          <a href="/" className="text-emerald-400 font-semibold flex flex-col items-center gap-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[10px]">План</span>
          </a>
          <a href="/analytics" className="text-slate-500 hover:text-slate-300 font-semibold flex flex-col items-center gap-1 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
            <span className="text-[10px]">Аналитика</span>
          </a>
          <a href="/shopping" className="text-slate-500 hover:text-slate-300 font-semibold flex flex-col items-center gap-1 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="text-[10px]">Покупки</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
