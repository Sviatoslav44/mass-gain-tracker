import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
      <header className="border-b border-gray-800 py-6 px-8 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            SF
          </div>
          <span className="font-bold text-2xl tracking-tight">StarForensic</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
          <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
        </nav>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-lg transition-colors font-medium border border-white/5">
          GitHub
        </a>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-32 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-semibold tracking-wide">
          v1.0 is live — Analyze any public repo
        </div>
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
          Is that star growth <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500">organic?</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-400 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
          Analyze public GitHub repositories to estimate credibility based on public signals. Identify anomaly risks before investing, hiring, or trusting a project.
        </p>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-3 md:p-4 max-w-3xl mx-auto flex flex-col md:flex-row gap-4 shadow-2xl focus-within:border-purple-500/50 transition-colors">
          <div className="flex-1 flex items-center pl-4 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            <input 
              type="text" 
              placeholder="https://github.com/facebook/react" 
              className="w-full bg-transparent border-none text-white px-4 py-3 md:py-4 focus:outline-none focus:ring-0 text-lg placeholder-gray-600"
              id="repo-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value;
                  if(val) window.location.href = `/analyze?url=${encodeURIComponent(val)}`;
                }
              }}
            />
          </div>
          <button 
            onClick={() => {
              const val = (document.getElementById('repo-input') as HTMLInputElement).value;
              if(val) window.location.href = `/analyze?url=${encodeURIComponent(val)}`;
            }}
            className="bg-white text-black font-bold px-10 py-4 rounded-2xl hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 text-lg"
          >
            Analyze Repo
          </button>
        </div>

        <p className="mt-8 text-sm text-gray-500 max-w-xl mx-auto">
          Disclaimer: This tool provides heuristic, probabilistic assessments and does not claim definitive proof of manipulation.
        </p>
      </main>
      
      <div id="how-it-works" className="border-t border-gray-900 bg-black/50 py-24">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-left">
          <div>
            <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 border border-purple-500/30 text-2xl">🕵️</div>
            <h3 className="text-xl font-bold mb-3">Stargazer Analysis</h3>
            <p className="text-gray-400 leading-relaxed">We scan the most recent stargazers to identify abnormal concentrations of newly created accounts, a common signal of inorganic growth.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-indigo-900/50 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/30 text-2xl">📈</div>
            <h3 className="text-xl font-bold mb-3">Velocity Anomalies</h3>
            <p className="text-gray-400 leading-relaxed">By looking at the timing of stars, we can detect sudden, unnatural spikes that flatline immediately after, often indicative of purchased engagement.</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30 text-2xl">⚖️</div>
            <h3 className="text-xl font-bold mb-3">Ecosystem Cross-Check</h3>
            <p className="text-gray-400 leading-relaxed">Stars don't exist in a vacuum. We cross-reference star counts against forks, issues, and PR activity to ensure the numbers make sense.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
