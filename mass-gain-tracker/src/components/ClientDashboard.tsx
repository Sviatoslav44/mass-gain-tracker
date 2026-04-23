"use client";

import { useState, useEffect } from "react";

export default function ClientDashboard({ plan, todayStr }: { plan: any, todayStr: string }) {
  const [weight, setWeight] = useState<string | null>(null);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check local storage for today's weight
    const storedWeight = localStorage.getItem(`weight_${todayStr}`);
    if (storedWeight) {
      setWeight(storedWeight);
    }
    
    // Load completed meals
    const storedMeals = localStorage.getItem(`meals_${todayStr}`);
    if (storedMeals) {
      setCompletedMeals(JSON.parse(storedMeals));
    }
    
    setIsLoaded(true);
  }, [todayStr]);

  const handleSaveWeight = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const w = formData.get("weight") as string;
    if (w) {
      localStorage.setItem(`weight_${todayStr}`, w);
      setWeight(w);
    }
  };

  const toggleMeal = (mealId: string) => {
    const newState = { ...completedMeals, [mealId]: !completedMeals[mealId] };
    setCompletedMeals(newState);
    localStorage.setItem(`meals_${todayStr}`, JSON.stringify(newState));
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-900"></div>;

  if (!weight) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-slate-100">
        <h2 className="text-3xl font-extrabold mb-8 text-emerald-400 text-center">Утреннее взвешивание</h2>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      <header className="bg-slate-800/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-700 p-6 pt-12 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{todayStr}</h1>
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
        {plan.type !== 'REST' && (
          <section>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Тренировка</h2>
            <div className="block bg-slate-800 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-emerald-400">{plan.type}</h3>
                <p className="text-slate-400 text-sm mt-1">{plan.exercises.length} упражнений</p>
              </div>
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white">
                →
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

      <nav className="fixed bottom-0 w-full bg-slate-800/90 backdrop-blur-xl border-t border-slate-700 pb-safe">
        <div className="flex justify-around p-4 max-w-md mx-auto">
          <div className="text-emerald-400 font-semibold flex flex-col items-center gap-1 cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[10px]">План</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
