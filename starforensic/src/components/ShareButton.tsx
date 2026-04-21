"use client";

import { useState } from "react";

export function ShareButton({ owner, repo }: { owner: string; repo: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://starforensic.vercel.app/report/${owner}/${repo}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleShare}
      className="text-sm bg-purple-600 hover:bg-purple-500 px-5 py-2.5 rounded-lg transition-colors font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          Share Report
        </>
      )}
    </button>
  );
}
