export default function ShoppingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24">
      <header className="bg-slate-800/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-700 p-6 pt-12 text-center">
        <h1 className="text-2xl font-bold text-white">Списки покупок</h1>
      </header>

      <main className="p-6 max-w-md mx-auto space-y-8 flex flex-col items-center justify-center mt-20">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-slate-300">Списки покупок в разработке</h2>
        <p className="text-slate-500 text-center">Здесь будет ваш еженедельный чеклист покупок.</p>
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
        <a href="/analytics" className="text-slate-500 hover:text-slate-300 font-semibold flex flex-col items-center gap-1 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
          <span className="text-[10px]">Аналитика</span>
        </a>
        <a href="/shopping" className="text-emerald-400 font-semibold flex flex-col items-center gap-1 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span className="text-[10px]">Покупки</span>
        </a>
      </div>
    </nav>
  );
}
