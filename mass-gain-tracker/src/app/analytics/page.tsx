"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { format, addDays } from "date-fns";

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const startDate = new Date('2026-04-24T00:00:00.000Z');
    const endDate = new Date('2026-07-02T00:00:00.000Z');
    
    let curr = new Date(startDate);
    const chartData = [];
    
    let lastWeight = 82.5;

    while (curr <= endDate) {
      const dateStr = format(curr, 'dd.MM.yyyy');
      const w = localStorage.getItem(`weight_${dateStr}`);
      
      let weightVal = null;
      if (w) {
        weightVal = parseFloat(w);
        lastWeight = weightVal;
      }

      // Calculate Target Range based on week
      const diffTime = Math.abs(curr.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const week = Math.ceil(diffDays / 7) || 1;
      
      let targetMin = 82.5;
      let targetMax = 83;
      
      if (week === 1) { targetMin = 83; targetMax = 84; }
      else if (week === 2) { targetMin = 84; targetMax = 85; }
      else if (week === 3) { targetMin = 85; targetMax = 86; }
      else if (week === 4) { targetMin = 86; targetMax = 86.5; }
      else if (week === 5) { targetMin = 86.5; targetMax = 87; }
      else if (week === 6) { targetMin = 87; targetMax = 87.5; }
      else if (week === 7) { targetMin = 87.5; targetMax = 88; }
      else if (week === 8) { targetMin = 88; targetMax = 88.5; }
      else if (week === 9) { targetMin = 89; targetMax = 89.5; }
      else if (week >= 10) { targetMin = 89.5; targetMax = 90; }

      chartData.push({
        date: format(curr, 'dd.MM'),
        weight: weightVal,
        targetMin,
        targetMax
      });
      
      curr = addDays(curr, 1);
    }
    
    setData(chartData);
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="min-h-screen bg-slate-900" />;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24 font-sans">
      <header className="bg-slate-800/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-700 p-6 pt-12 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Аналитика</h1>
          <p className="text-emerald-400 font-semibold text-sm tracking-wide mt-1">
            Прогресс набора массы (82.5 → 90 кг)
          </p>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-8 mt-4">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-4 shadow-xl">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">График веса</h2>
          <div className="h-64 w-full -ml-4 text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8' }} 
                  tickMargin={10}
                  minTickGap={20}
                />
                <YAxis 
                  domain={[80, 92]} 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8' }} 
                  tickCount={7}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <ReferenceArea y1={82.5} y2={90} fill="#10b981" fillOpacity={0.05} />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }}
                  connectNulls={true}
                  name="Мой вес"
                />
                <Line 
                  type="stepAfter" 
                  dataKey="targetMax" 
                  stroke="#64748b" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Цель (макс)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full bg-slate-800/90 backdrop-blur-xl border-t border-slate-700 pb-safe z-50">
      <div className="flex justify-around p-4 max-w-md mx-auto">
        <a href="/" className="text-slate-500 hover:text-slate-300 font-semibold flex flex-col items-center gap-1 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[10px]">План</span>
        </a>
        <a href="/analytics" className="text-emerald-400 font-semibold flex flex-col items-center gap-1 transition-colors">
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
