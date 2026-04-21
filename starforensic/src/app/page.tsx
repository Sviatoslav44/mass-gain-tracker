import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
      <header className="border-b border-gray-800 py-6 px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-sm">
            SF
          </div>
          <span className="font-bold text-xl tracking-tight">StarForensic</span>
        </div>
        <nav className="text-sm text-gray-400 flex gap-6">
          <a href="#how-it-works" className="hover:text-white transition">How it Works</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
          Is that star growth <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">organic?</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Analyze public GitHub repositories to estimate credibility based on public signals. Identify anomaly risks before investing, hiring, or trusting a project.
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 md:p-4 max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Paste GitHub URL (e.g. https://github.com/facebook/react)" 
            className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none focus:ring-0"
            id="repo-input"
          />
          <Link href="/analyze" className="bg-white text-black font-semibold px-8 py-3 rounded-xl hover:bg-gray-200 transition text-center">
            Analyze Repo
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Disclaimer: This tool provides heuristic, probabilistic assessments and does not claim definitive proof of manipulation.
        </p>
      </main>
    </div>
  );
}
