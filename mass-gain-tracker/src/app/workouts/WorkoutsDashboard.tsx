"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import BottomNav from "@/components/BottomNav";

export default function WorkoutsDashboard({ allPlans }: { allPlans: any[] }) {
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activeGif, setActiveGif] = useState<string | null>(null);

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
      const storedExercises = localStorage.getItem(`exercises_${todayStr}`);
      if (storedExercises) {
        setCompletedExercises(JSON.parse(storedExercises));
      } else {
        setCompletedExercises({});
      }
    }
    setIsLoaded(true);
  }, [currentDate, plan, todayStr]);

  const toggleExercise = (exId: string) => {
    const newState = { ...completedExercises, [exId]: !completedExercises[exId] };
    setCompletedExercises(newState);
    if (todayStr) {
      localStorage.setItem(`exercises_${todayStr}`, JSON.stringify(newState));
    }
  };

  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const prevDay = () => setCurrentDate(subDays(currentDate, 1));

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

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
              День {plan?.dayNumber || '-'}/70
            </p>
          </div>
          <button onClick={nextDay} className="p-2 bg-white/10 rounded-xl border border-white/5 active:bg-white/20 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-6">
        {!plan || plan.type === 'REST' ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-lg">
            <div className="text-5xl mb-4">🧘‍♂️</div>
            <h2 className="text-2xl font-bold text-white mb-2">День отдыха</h2>
            <p className="text-slate-400 text-sm">Сегодня нет силовых тренировок. Обязательно находите 7000+ шагов и хорошо питайтесь.</p>
          </div>
        ) : (
          <section>
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 pl-2 drop-shadow-sm">Тренировка: {plan.type}</h2>
            <div className="space-y-4">
              {plan.exercises.map((ex: any) => {
                const isCompleted = !!completedExercises[ex.id];
                return (
                  <div key={ex.id} className={`w-full text-left bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col gap-3 transition-all shadow-lg overflow-hidden relative ${isCompleted ? 'bg-emerald-900/20 border-emerald-500/30' : ''}`}>
                    <div className="flex gap-4 items-center relative z-10">
                      <div onClick={() => toggleExercise(ex.id)} className={`shrink-0 w-8 h-8 rounded-xl border-[1.5px] flex items-center justify-center transition-colors shadow-sm cursor-pointer ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:border-white/50 bg-black/20'}`}>
                        {isCompleted && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className={`text-base font-bold leading-tight pr-2 ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
                            {ex.order}. {ex.name}
                          </p>
                          <button onClick={() => setActiveGif(ex.gif)} className="p-2 bg-black/30 rounded-lg hover:bg-black/50 transition-colors border border-white/5 text-xs text-emerald-400 font-bold shrink-0">
                            ▶ GIF
                          </button>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="inline-block bg-black/30 border border-white/5 px-2 py-1 rounded text-xs font-semibold text-slate-300">
                            {ex.sets}x{ex.reps}
                          </span>
                          <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded text-xs font-bold text-emerald-400">
                            {ex.weight}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* GIF Modal */}
      {activeGif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setActiveGif(null)}>
          <div className="bg-[#001F3F] border border-white/10 p-4 rounded-3xl w-full max-w-sm relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveGif(null)} className="absolute top-2 right-2 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60">✕</button>
            <h3 className="text-white font-bold mb-4 ml-2">Техника выполнения</h3>
            <img src={activeGif} alt="Exercise GIF" className="w-full h-auto rounded-2xl border border-white/10" />
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
