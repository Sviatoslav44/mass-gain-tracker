import { analyzeRepository } from "@/lib/heuristics";

export default async function ReportPage({ params }: { params: Promise<{ owner: string, repo: string }> }) {
  const { owner, repo } = await params;
  
  let report;
  try {
    report = await analyzeRepository(owner, repo);
  } catch (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Error analyzing repository: {owner}/{repo}</h1>
      </div>
    );
  }

  const { score, riskLevel, trustIndicators, suspiciousIndicators, velocityData } = report;
  
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500">
      <header className="border-b border-gray-800 py-4 px-6 flex justify-between items-center bg-gray-900/50">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-tight">StarForensic</span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 font-medium">{owner} / {repo}</span>
        </div>
        <button className="text-sm bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md transition font-medium">
          Share Report
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Score Card */}
          <div className="md:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Credibility Score</h2>
            <div className={`text-7xl font-black mb-4 ${score >= 85 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-500"}`}>
              {score}
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-300 mb-6 uppercase tracking-wider">
              Risk: {riskLevel}
            </div>
            <p className="text-sm text-gray-500 px-4">
              Probabilistic assessment based on official GitHub signals including repository health and account age.
            </p>
          </div>

          {/* Details & Explanation */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-3 flex items-center gap-2">
                <span>🔍</span> Analysis Summary
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-black p-5 rounded-xl border border-gray-800">
                  <span className="text-green-400 text-sm font-bold block mb-3 uppercase tracking-wider">✓ Trust Indicators</span>
                  {trustIndicators.length > 0 ? (
                    <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                      {trustIndicators.map((t: string, i: number) => <li key={i}>{t}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-600">No strong trust indicators detected.</p>
                  )}
                </div>
                <div className="bg-black p-5 rounded-xl border border-gray-800">
                  <span className="text-yellow-500 text-sm font-bold block mb-3 uppercase tracking-wider">⚠ Suspicious Signals</span>
                  {suspiciousIndicators.length > 0 ? (
                    <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                      {suspiciousIndicators.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-600">No unusual patterns detected.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-3 flex items-center gap-2">
                <span>📈</span> Star Velocity (Recent Sample)
              </h3>
              <div className="h-48 w-full flex items-end gap-[2px] mt-4">
                {velocityData.map((height: number, i: number) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-purple-900/60 to-purple-500 hover:from-purple-500 hover:to-indigo-400 rounded-t-sm transition-all" style={{ height: `${height}%` }}></div>
                ))}
              </div>
              <p className="text-xs text-gray-600 text-center mt-4">
                Visualizing recent star growth momentum (sampled).
              </p>
            </div>
          </div>

        </div>
      </main>

      <footer className="text-center text-xs text-gray-600 py-8 border-t border-gray-900">
        StarForensic is a probabilistic analysis tool. Results do not constitute definitive proof of fraud or manipulation.
      </footer>
    </div>
  );
}
