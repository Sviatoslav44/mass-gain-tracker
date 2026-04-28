"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import BottomNav from "./BottomNav";

export default function ClientDashboard({ allPlans }: { allPlans: any[] }) {
  const [weight, setWeight] = useState<string | null>(null);
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({});
  const [expandedMeals, setExpandedMeals] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isEditingWeight, setIsEditingWeight] = useState(false);

  const todayStr = format(currentDate, 'dd.MM.yyyy');
  const isoDateString = format(currentDate, 'yyyy-MM-dd') + "T00:00:00.000Z";
  const plan = allPlans.find((p: any) => p.date === isoDateString);

  useEffect(() => {
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
        setWeight(null);
      }
      
      const storedMeals = localStorage.getItem(`meals_${todayStr}`);
      if (storedMeals) {
        setCompletedMeals(JSON.parse(storedMeals));
      } else {
        setCompletedMeals({});
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
      setIsEditingWeight(false);
    }
  };

  const toggleMeal = (mealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = { ...completedMeals, [mealId]: !completedMeals[mealId] };
    setCompletedMeals(newState);
    if (todayStr) {
      localStorage.setItem(`meals_${todayStr}`, JSON.stringify(newState));
    }
  };

  const toggleExpand = (mealId: string) => {
    setExpandedMeals(prev => ({ ...prev, [mealId]: !prev[mealId] }));
  };

  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const prevDay = () => setCurrentDate(subDays(currentDate, 1));

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!plan) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={prevDay} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/20">{'<'}</button>
          <h1 className="text-2xl font-bold">{todayStr}</h1>
          <button onClick={nextDay} className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/20">{'>'}</button>
        </div>
        <p className="text-slate-300 text-center">План на этот день не найден.</p>
        <BottomNav />
      </div>
    );
  }

  if (!weight && !isEditingWeight) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-slate-100 bg-gradient-to-br from-[#001F3F] to-[#004D40]">
        <h2 className="text-3xl font-extrabold mb-8 text-emerald-400 text-center">Утреннее взвешивание</h2>
        <h3 className="text-xl mb-4 font-bold">{todayStr}</h3>
        <form onSubmit={handleSaveWeight} className="w-full max-w-sm flex flex-col gap-6 bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
          <p className="text-slate-300 text-center text-sm">Введите вес натощак для разблокировки плана.</p>
          <input 
            type="number" 
            name="weight" 
            step="0.1" 
            min="50"
            max="150"
            required
            autoFocus
            className="w-full bg-black/20 border-2 border-white/10 rounded-2xl px-6 py-5 text-4xl text-center text-white focus:border-emerald-500 focus:outline-none transition-colors"
            placeholder="85.5"
          />
          <button 
            type="submit"
            className="w-full bg-emerald-500/90 text-white font-bold text-xl py-4 rounded-2xl hover:bg-emerald-400 active:scale-95 transition-all shadow-lg"
          >
            Сохранить
          </button>
        </form>
        <div className="mt-8 flex gap-4">
          <button onClick={prevDay} className="px-5 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl">{'<'} Вчера</button>
          <button onClick={nextDay} className="px-5 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl">Завтра {'>'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <header className="bg-white/5 backdrop-blur-xl sticky top-0 z-40 border-b border-white/10 p-4 pt-10 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={prevDay} className="p-2 bg-white/10 rounded-xl border border-white/5 active:bg-white/20 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">{todayStr}</h1>
            <p className="text-emerald-400 font-semibold text-xs tracking-wide">
              День {plan.dayNumber}/70 • {plan.phase}
            </p>
          </div>
          <button onClick={nextDay} className="p-2 bg-white/10 rounded-xl border border-white/5 active:bg-white/20 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-300 uppercase tracking-widest">Калории</p>
          <p className="text-xl font-black text-emerald-400 leading-tight drop-shadow-md">{plan.baseCalories}</p>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-6">
        
        {/* Weight Management Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-lg flex items-center justify-between">
          {!isEditingWeight ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">⚖️</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Вес на сегодня</p>
                  <p className="text-2xl font-black text-white">{weight} <span className="text-sm font-medium text-slate-400">кг</span></p>
                </div>
              </div>
              <button onClick={() => setIsEditingWeight(true)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
                ✏️
              </button>
            </>
          ) : (
            <form onSubmit={handleSaveWeight} className="flex gap-3 w-full">
              <input 
                type="number" 
                name="weight" 
                step="0.1" 
                defaultValue={weight || ""}
                autoFocus
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-xl text-white focus:border-emerald-500 focus:outline-none"
              />
              <button type="submit" className="bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold">ОК</button>
            </form>
          )}
        </div>

        <section>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 pl-2 drop-shadow-sm">Питание</h2>
          <div className="space-y-4">
            {plan.meals.map((meal: any) => {
              const isCompleted = !!completedMeals[meal.id];
              const isExpanded = !!expandedMeals[meal.id];
              
              return (
                <div key={meal.id} onClick={() => toggleExpand(meal.id)} className={`cursor-pointer w-full text-left bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col gap-4 active:scale-[0.99] transition-all shadow-lg overflow-hidden relative`}>
                  {/* Glass highlight */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                  
                  <div className="flex gap-4 items-start relative z-10">
                    <div onClick={(e) => toggleMeal(meal.id, e)} className={`mt-1 w-8 h-8 shrink-0 rounded-xl border-[1.5px] flex items-center justify-center transition-colors shadow-sm ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:border-white/50 bg-black/20'}`}>
                      {isCompleted && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-baseline gap-3">
                          <span className="text-emerald-400 font-bold tracking-wide">{meal.time}</span>
                          <span className={`text-lg font-bold ${isCompleted ? 'text-slate-400 line-through decoration-slate-500' : 'text-white'}`}>{meal.name}</span>
                        </div>
                        <svg className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed mb-3 line-clamp-2">{meal.items}</p>
                      <div className="inline-block bg-black/30 border border-white/5 px-3 py-1 rounded-lg text-xs font-semibold text-emerald-300">
                        ~{meal.calories} ккал
                      </div>
                    </div>
                  </div>

                  {/* Expanded Recipe Area */}
                  {isExpanded && meal.recipe && (
                    <div className="mt-2 pt-4 border-t border-white/10 relative z-10">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Рецепт:</h4>
                      <p className="text-sm text-slate-200 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">{meal.recipe}</p>
                    </div>
                  )}
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
