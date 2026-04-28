"use client";

import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";

const standardList = [
  "Курица (грудка/бёдра) — 1.8 кг",
  "Говядина (стейк/фарш) — 800 г",
  "Свинина нежирная — 500 г",
  "Рыба (лосось/треска) — 500 г",
  "Яйца — 30 шт",
  "Творог 5–9% — 1.2 кг",
  "Молоко 2.5–3.2% — 6 л",
  "Сыр твёрдый — 300 г",
  "Овсянка — 1.2 кг",
  "Рис — 1 кг",
  "Макароны — 700 г",
  "Гречка — 500 г",
  "Картофель — 2 кг",
  "Хлеб — 2 шт",
  "Арахисовая паста — 1 банка (~350 г)",
  "Орехи — 300 г",
  "Оливковое масло — проверить",
  "Сливочное масло — 100 г",
  "Бананы — 14 шт",
  "Авокадо — 2 шт",
  "Помидоры — 500 г",
  "Огурцы — 500 г",
  "Зелень — 2 пучка",
  "Овощи для готовки — 700 г",
  "Мёд — проверить",
  "Протеин — проверить запас",
  "Креатин — проверить запас"
];

const extendedList = standardList.map(item => {
  if (item.includes("Рис")) return "Рис — 1.3 кг (вместо 1 кг)";
  if (item.includes("Макароны")) return "Макароны — 900 г (вместо 700 г)";
  if (item.includes("Молоко")) return "Молоко — 7 л (вместо 6 л)";
  if (item.includes("Овсянка")) return "Овсянка — 1.4 кг (вместо 1.2 кг)";
  if (item.includes("Бананы")) return "Бананы — 17 шт (вместо 14)";
  return item;
});

const maxList = extendedList.map(item => {
  if (item.includes("Молоко")) return "Молоко — 8 л (вместо 7 л)";
  if (item.includes("Хлеб")) return "Хлеб — 3 шт (вместо 2)";
  if (item.includes("Сыр")) return "Сыр — 400 г (вместо 300 г)";
  if (item.includes("Орехи")) return "Орехи — 400 г (вместо 300 г)";
  return item;
});

export default function ShoppingPage() {
  const [week, setWeek] = useState(1);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const start = new Date('2026-04-24T00:00:00.000Z');
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let currentWeek = Math.ceil(diffDays / 7);
    if (currentWeek < 1) currentWeek = 1;
    if (currentWeek > 10) currentWeek = 10;
    
    setWeek(currentWeek);

    const saved = localStorage.getItem(`shopping_week_${currentWeek}`);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  const changeWeek = (newWeek: number) => {
    setWeek(newWeek);
    const saved = localStorage.getItem(`shopping_week_${newWeek}`);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    } else {
      setCheckedItems({});
    }
  };

  const toggleItem = (item: string) => {
    const newState = { ...checkedItems, [item]: !checkedItems[item] };
    setCheckedItems(newState);
    localStorage.setItem(`shopping_week_${week}`, JSON.stringify(newState));
  };

  if (!isLoaded) return <div className="min-h-screen bg-transparent" />;

  let currentList = standardList;
  let title = "Стандартный список";
  if (week >= 5 && week <= 7) {
    currentList = extendedList;
    title = "Расширенный список";
  } else if (week >= 8) {
    currentList = maxList;
    title = "Максимальный список";
  }

  return (
    <div className="min-h-screen pb-32 font-sans">
      <header className="bg-white/5 backdrop-blur-xl sticky top-0 z-40 border-b border-white/10 p-6 pt-12 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-white">Покупки</h1>
          <p className="text-emerald-400 font-semibold text-sm tracking-wide mt-1">
            Неделя {week} • {title}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => changeWeek(Math.max(1, week - 1))} className="p-2 bg-white/10 rounded-xl border border-white/5 active:bg-white/20 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => changeWeek(Math.min(10, week + 1))} className="p-2 bg-white/10 rounded-xl border border-white/5 active:bg-white/20 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-4">
        {currentList.map((item, idx) => {
          const isChecked = !!checkedItems[item];
          return (
            <div 
              key={idx} 
              onClick={() => toggleItem(item)}
              className={`cursor-pointer w-full text-left bg-white/5 backdrop-blur-xl border ${isChecked ? 'border-emerald-500/30 bg-emerald-900/20' : 'border-white/10'} rounded-2xl p-4 flex gap-4 items-center active:scale-[0.98] transition-all shadow-md relative overflow-hidden`}
            >
              {/* Glass highlight */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

              <div className={`shrink-0 w-6 h-6 rounded-md border-[1.5px] flex items-center justify-center transition-colors shadow-sm relative z-10 ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:border-white/50 bg-black/20'}`}>
                {isChecked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <p className={`text-sm font-semibold leading-snug relative z-10 ${isChecked ? 'text-slate-400 line-through decoration-slate-500' : 'text-slate-200'}`}>{item}</p>
            </div>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
}
