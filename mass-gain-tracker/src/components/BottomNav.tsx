"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "План", path: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Тренировка", path: "/workouts", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { name: "Аналитика", path: "/analytics", icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" },
    { name: "Покупки", path: "/shopping", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 w-full z-50 flex justify-center px-4">
      <nav className="flex justify-around items-center w-full max-w-md bg-black/20 backdrop-blur-xl border border-white/10 rounded-full px-2 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex flex-col items-center gap-1 transition-colors px-4 py-1 rounded-full ${isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2.5 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
