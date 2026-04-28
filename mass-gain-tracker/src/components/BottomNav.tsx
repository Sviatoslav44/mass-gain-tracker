"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

const navItems = [
  { name: "План", path: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { name: "Тренировки", path: "/workouts", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { name: "Аналитика", path: "/analytics", icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" },
  { name: "Покупки", path: "/shopping", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  
  const activeIndex = navItems.findIndex(item => item.path === pathname);
  const currentIndex = hoveredIndex !== null ? hoveredIndex : (activeIndex === -1 ? 0 : activeIndex);

  const calculateIndex = (clientX: number) => {
    if (!navRef.current) return null;
    const rect = navRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const itemWidth = width / navItems.length;
    let index = Math.floor(x / itemWidth);
    if (index < 0) index = 0;
    if (index >= navItems.length) index = navItems.length - 1;
    return index;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setHoveredIndex(calculateIndex(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setHoveredIndex(calculateIndex(e.clientX));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const index = calculateIndex(e.clientX);
    if (index !== null) {
      router.push(navItems[index].path);
    }
    setHoveredIndex(null);
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    setHoveredIndex(null);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 w-full z-50 flex justify-center px-4">
      <nav 
        ref={navRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="relative flex justify-around items-center w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] touch-none select-none"
      >
        {navItems.map((item, index) => {
          const isActive = index === currentIndex;
          const isActuallyActive = pathname === item.path;
          return (
            <div 
              key={item.path} 
              className="relative flex flex-col items-center justify-center flex-1 py-2 z-10 cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-white/20 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                />
              )}
              <svg className={`w-6 h-6 mb-1 transition-colors ${isActuallyActive || isActive ? 'text-emerald-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActuallyActive || isActive ? 2.5 : 2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className={`text-[10px] font-bold transition-colors ${isActuallyActive || isActive ? 'text-emerald-400' : 'text-slate-400'}`}>{item.name}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
