"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    
    try {
      const urlObj = new URL(url);
      const parts = urlObj.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        const owner = parts[0];
        const repo = parts[1];
        
        // In a real MVP, we'd trigger the API here or just redirect and let the report page fetch.
        // We'll redirect and let the server component do the fetching!
        router.push(`/report/${owner}/${repo}`);
      } else {
        alert("Invalid GitHub URL structure");
        setLoading(false);
      }
    } catch {
      alert("Invalid URL format");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl text-center">
        {!loading ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Start Analysis</h2>
            <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/facebook/react"
                className="bg-black border border-gray-700 px-4 py-3 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
              <button 
                type="submit"
                className="bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
              >
                Scan Now
              </button>
            </form>
          </>
        ) : (
          <div className="py-8">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-medium">Initializing Scan...</h3>
            <p className="text-gray-500 text-sm mt-2">Preparing to fetch repository data.</p>
          </div>
        )}
      </div>
    </div>
  );
}
