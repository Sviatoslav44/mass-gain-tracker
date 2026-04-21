export default async function ReportPage({ params }: { params: Promise<{ owner: string, repo: string }> }) {
  const { owner, repo } = await params;

  // Mocked heuristic data for MVP presentation
  const score = Math.floor(Math.random() * 30) + 70; // 70-100
  const risk = score > 85 ? "Low" : score > 75 ? "Moderate" : "High";
  
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500">
      <header className="border-b border-gray-800 py-4 px-6 flex justify-between items-center bg-gray-900/50">
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-tight">StarForensic</span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-300 font-medium">{owner} / {repo}</span>
        </div>
        <button className="text-sm bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md transition">
          Share Report
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Score Card */}
          <div className="md:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">Credibility Score</h2>
            <div className={`text-7xl font-black mb-4 ${score > 85 ? "text-green-400" : "text-yellow-400"}`}>
              {score}
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-800 text-gray-300 mb-6">
              Risk: {risk}
            </div>
            <p className="text-sm text-gray-500">
              Score is based on heuristic evaluation of star velocity, account age, and ecosystem cross-checks.
            </p>
          </div>

          {/* Details & Explanation */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">Analysis Summary</h3>
              <p className="text-gray-300 mb-4">
                The star growth for <span className="font-semibold text-white">{owner}/{repo}</span> appears broadly organic. We detected a healthy distribution of account ages and no sudden unnatural spikes in the time-series analysis.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-black p-4 rounded-xl border border-gray-800">
                  <span className="text-green-400 text-sm font-bold block mb-1">✓ Trust Indicators</span>
                  <ul className="text-sm text-gray-400 list-disc list-inside">
                    <li>High fork-to-star ratio</li>
                    <li>Sustained issue/PR activity</li>
                    <li>Older accounts starring</li>
                  </ul>
                </div>
                <div className="bg-black p-4 rounded-xl border border-gray-800">
                  <span className="text-yellow-500 text-sm font-bold block mb-1">⚠ Suspicious Indicators</span>
                  <ul className="text-sm text-gray-400 list-disc list-inside">
                    <li>Slight burst on weekend</li>
                    <li>12% of accounts created this week</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">Star Velocity (Last 30 Days)</h3>
              <div className="h-48 w-full flex items-end gap-2 text-xs text-gray-600">
                {/* Mock chart bars */}
                {[...Array(30)].map((_, i) => {
                  const height = Math.floor(Math.random() * 80) + 10;
                  return (
                    <div key={i} className="flex-1 bg-purple-900/40 hover:bg-purple-500 rounded-t-sm transition-all" style={{ height: `${height}%` }}></div>
                  )
                })}
              </div>
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
