import { analyzeRepository } from "@/lib/heuristics";
import { ShareButton } from "@/components/ShareButton";
import Link from "next/link";

export default async function ReportPage({ params }: { params: Promise<{ owner: string, repo: string }> }) {
  const { owner, repo } = await params;
  
  let report;
  try {
    report = await analyzeRepository(owner, repo);
  } catch (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Analysis Failed</h1>
          <p className="text-gray-400 mb-6">Could not fetch data for repository: <br/> <span className="text-white font-mono">{owner}/{repo}</span></p>
          <p className="text-sm text-gray-500 mb-8">Please check if the repository exists and is public.</p>
          <Link href="/" className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
            Try Another Repo
          </Link>
        </div>
      </div>
    );
  }

  const { score, riskLevel, trustIndicators, suspiciousIndicators, velocityData } = report;
  
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500">
      <header className="border-b border-gray-800/60 py-4 px-6 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-lg group-hover:shadow-purple-500/30 transition-all">
            SF
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold tracking-tight text-gray-200 group-hover:text-white transition">StarForensic</span>
            <span className="text-gray-600">/</span>
            <span className="text-white font-semibold">{owner} / {repo}</span>
          </div>
        </Link>
        <ShareButton owner={owner} repo={repo} />
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Score Card */}
          <div className="lg:col-span-1 bg-gray-900/40 border border-gray-800/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
            
            <h2 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-6 relative z-10">Credibility Score</h2>
            
            <div className={`text-8xl font-black mb-6 tracking-tighter relative z-10 drop-shadow-2xl ${score >= 85 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
              {score}
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider relative z-10 ${score >= 85 ? "bg-green-500/10 text-green-400 border border-green-500/20" : score >= 60 ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
              <div className={`w-2 h-2 rounded-full ${score >= 85 ? "bg-green-400" : score >= 60 ? "bg-yellow-400" : "bg-red-400"}`}></div>
              Risk: {riskLevel}
            </div>
            
            <p className="text-sm text-gray-500 px-2 mt-8 relative z-10 leading-relaxed">
              Probabilistic assessment based on official GitHub signals including repository health and account age.
            </p>
          </div>

          {/* Details & Explanation */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-gray-900/40 border border-gray-800/60 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="p-2 bg-gray-800 rounded-lg">🔍</span> 
                Analysis Summary
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="bg-black/40 p-6 rounded-2xl border border-gray-800">
                  <span className="text-green-400 text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-wider">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Trust Indicators
                  </span>
                  {trustIndicators.length > 0 ? (
                    <ul className="text-sm text-gray-300 space-y-3">
                      {trustIndicators.map((t: string, i: number) => (
                        <li key={i} className="flex gap-2 leading-relaxed">
                          <span className="text-green-500/50 mt-1">•</span> {t}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No strong trust indicators detected.</p>
                  )}
                </div>
                <div className="bg-black/40 p-6 rounded-2xl border border-gray-800">
                  <span className="text-yellow-500 text-sm font-bold flex items-center gap-2 mb-4 uppercase tracking-wider">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    Suspicious Signals
                  </span>
                  {suspiciousIndicators.length > 0 ? (
                    <ul className="text-sm text-gray-300 space-y-3">
                      {suspiciousIndicators.map((s: string, i: number) => (
                        <li key={i} className="flex gap-2 leading-relaxed">
                          <span className="text-yellow-500/50 mt-1">•</span> {s}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">No unusual patterns detected.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-900/40 border border-gray-800/60 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="p-2 bg-gray-800 rounded-lg">📈</span> 
                Star Velocity (Recent Sample)
              </h3>
              <div className="h-56 w-full flex items-end gap-[3px] mt-6 bg-black/20 p-4 rounded-xl border border-gray-800/50">
                {velocityData.map((height: number, i: number) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-purple-900/40 to-purple-500/80 hover:from-purple-500 hover:to-indigo-400 rounded-t-sm transition-all cursor-crosshair group relative" 
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip for the chart */}
                    <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded pointer-events-none transition-opacity">
                      {height}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-6">
                Visualizing recent star growth momentum (sampled from recent stargazers).
              </p>
            </div>
          </div>

        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-gray-900/50 mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-5 h-5 rounded bg-gray-600 flex items-center justify-center font-bold text-[8px] text-black">SF</div>
          <span className="text-sm font-semibold tracking-tight">StarForensic</span>
        </div>
        <p className="text-xs text-gray-600 text-center max-w-lg">
          StarForensic is a probabilistic analysis tool. Results do not constitute definitive proof of fraud or manipulation. Please use this data as one of many signals in your diligence process.
        </p>
      </footer>
    </div>
  );
}
