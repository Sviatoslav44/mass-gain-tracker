"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { format, addDays } from "date-fns";
import BottomNav from "@/components/BottomNav";

const APP_VERSION = "1.0.1";

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const startDate = new Date('2026-04-24T00:00:00.000Z');
    const endDate = new Date('2026-07-02T00:00:00.000Z');
    
    let curr = new Date(startDate);
    const chartData = [];
    
    while (curr <= endDate) {
      const dateStr = format(curr, 'dd.MM.yyyy');
      const w = localStorage.getItem(`weight_${dateStr}`);
      
      let weightVal = null;
      if (w) {
        weightVal = parseFloat(w);
      }

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

    if (localStorage.getItem('app_version') !== APP_VERSION) {
      localStorage.setItem('app_version', APP_VERSION);
      window.location.reload();
    }
  }, []);

  if (!isLoaded) return <div className="min-h-screen bg-transparent" />;

  return (
    <div className="min-h-screen pb-32">
      <header className="bg-white/5 backdrop-blur-xl sticky top-0 z-40 border-b border-white/10 p-6 pt-12 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-white">Аналитика</h1>
          <p className="text-emerald-400 font-semibold text-sm tracking-wide mt-1">
            Прогресс набора массы (82.5 → 90 кг)
          </p>
        </div>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-8 mt-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-lg">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6 px-2 drop-shadow-sm">График веса</h2>
          <div className="h-64 w-full -ml-4 text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.1} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8" 
                  tick={{ fill: '#cbd5e1' }} 
                  tickMargin={10}
                  minTickGap={20}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[80, 92]} 
                  stroke="#94a3b8" 
                  tick={{ fill: '#cbd5e1' }} 
                  tickCount={7}
                  width={40}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
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
                  stroke="#cbd5e1" 
                  strokeOpacity={0.5}
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
