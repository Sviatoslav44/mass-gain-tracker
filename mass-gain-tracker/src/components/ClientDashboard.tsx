"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";

export default function ClientDashboard({ allPlans }: { allPlans: any[] }) {
  const [weight, setWeight] = useState<string | null>(null);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const todayStr = format(currentDate, 'dd.MM.yyyy');
  const isoDateString = format(currentDate, 'yyyy-MM-dd') + "T00:00:00.000Z";
  const plan = allPlans.find((p: any) => p.date === isoDateString);

  useEffect(() => {
    // Start at local today midnight
    const localToday = new Date();
    localToday.setHours(0, 0, 0, 0);
    setCurrentDate(localToday);
  }, []);

  useEffect(() => {
    if (plan) {
      const storedWeight = localStorage.getItem(`weight_${todayStr}`);
      if (storedWeight) {
        setWeight(storedWeight);
      } else {
        setWeight(null); // Reset if going to a day without weight
      }
      
      const storedMeals = localStorage.getItem(`meals_${todayStr}`);
      if (storedMeals) {
        setCompletedMeals(JSON.parse(storedMeals));
      } else {
        setCompletedMeals({});
      }

      const storedExercises = localStorage.getItem(`exercises_${todayStr}`);
      if (storedExercises) {
        setCompletedExercises(JSON.parse(storedExercises));
      } else {
        setCompletedExercises({});
      }
    }
    
    setIsLoaded(true);
  }, [currentDate, plan, todayStr]);

  const handleSaveWeight = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const w = formData.get("weight") as string;
    if (w && todayStr) {
      localStorage.setItem(`weight_${todayStr}`, w);
      setWeight(w);
    }
  };

  const toggleMeal = (mealId: string) => {
    const newState = { ...completedMeals, [mealId]: !completedMeals[mealId] };
    setCompletedMeals(newState);
    if (todayStr) {
      localStorage.setItem(`meals_${todayStr}`, JSON.stringify(newState));
    }
  };

  const toggleExercise = (exId: string) => {
    const newState = { ...completedExercises, [exId]: !completedExercises[exId] };
    setCompletedExercises(newState);
    if (todayStr) {
      localStorage.setItem(`exercises_${todayStr}`, JSON.stringify(newState));
    }
  };

  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const prevDay = () => setCurrentDate(subDays(currentDate, 1));

  if (!isLoaded) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={prevDay} className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700">{'<'}</button>
          <h1 className="text-2xl font-bold">{todayStr}</h1>
          <button onClick={nextDay} className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700">{'>'}</button>
        </div>
        <p className="text-slate-400 text-center">План на этот день не найден.</p>
        
        {/* Nav included here too to prevent getting stuck */}
        <BottomNav />
      </div>
    );
  }

  if (!weight) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-slate-100">
        <h2 className="text-3xl font-extrabold mb-8 text-emerald-400 text-center">Утреннее взвешивание</h2>
        <h3 className="text-xl mb-4 font-bold">{todayStr}</h3>
        <form onSubmit={handleSaveWeight} className="w-full max-w-sm flex flex-col gap-6 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
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
        {/* Add escape hatch navigation */}
        <div className="mt-8 flex gap-4">
          <button onClick={prevDay} className="px-4 py-2 bg-slate-800 rounded-lg">{'<'} Вчера</button>
          <button onClick={nextDay} className="px-4 py-2 bg-slate-800 rounded-lg">Завтра {'>'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      <header className="bg-slate-800/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-700 p-4 pt-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={prevDay} className="p-2 bg-slate-700 rounded-lg active:bg-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">{todayStr}</h1>
            <p className="text-emerald-400 font-semibold text-xs tracking-wide">
              День {plan.dayNumber}/70 • {plan.phase}
            </p>
          </div>
          <button onClick={nextDay} className="p-2 bg-slate-700 rounded-lg active:bg-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Калории</p>
          <p className="text-lg font-black text-white leading-tight">{plan.baseCalories}</p>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-8">
        {plan.type !== 'REST' && (
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Тренировка</h2>
            <div className="block bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-emerald-400">{plan.type}</h3>
                  <p className="text-slate-400 text-sm mt-1">{plan.exercises.length} упражнений</p>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                {plan.exercises.map((ex: any, idx: number) => {
                  const isCompleted = !!completedExercises[ex.id];
                  return (
                    <div key={ex.id} onClick={() => toggleExercise(ex.id)} className={`cursor-pointer flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border ${isCompleted ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-slate-800'} active:scale-[0.98] transition-all`}>
                      <div className="flex gap-4 items-center">
                        <div className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}>
                          {isCompleted && <svg className="w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>{ex.order}. {ex.name}</p>
                          <p className="text-xs text-slate-400 mt-1">{ex.sets}x{ex.reps} • <span className="text-emerald-300 font-semibold">{ex.weight}</span></p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Питание</h2>
          <div className="space-y-4">
            {plan.meals.map((meal: any) => {
              const isCompleted = !!completedMeals[meal.id];
              return (
                <div key={meal.id} onClick={() => toggleMeal(meal.id)} className={`cursor-pointer w-full text-left bg-slate-800 border ${isCompleted ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-700'} rounded-3xl p-5 flex gap-5 items-start active:scale-[0.98] transition-all`}>
                  <div className={`mt-1 w-8 h-8 shrink-0 rounded-xl border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}>
                    {isCompleted && <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-emerald-400 font-bold">{meal.time}</span>
                      <span className={`text-lg font-bold ${isCompleted ? 'text-slate-300 line-through decoration-slate-500' : 'text-white'}`}>{meal.name}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-3">{meal.items}</p>
                    <div className="inline-block bg-slate-900 px-3 py-1 rounded-lg text-xs font-semibold text-slate-300">
                      ~{meal.calories} ккал
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full bg-slate-800/90 backdrop-blur-xl border-t border-slate-700 pb-safe z-50">
      <div className="flex justify-around p-4 max-w-md mx-auto">
        <a href="/" className="text-emerald-400 font-semibold flex flex-col items-center gap-1 transition-colors">
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
  );
}
