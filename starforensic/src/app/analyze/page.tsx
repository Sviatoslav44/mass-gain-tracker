"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from 'react';

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url');

  useEffect(() => {
    if (urlParam) {
      try {
        const urlObj = new URL(urlParam);
        const parts = urlObj.pathname.split("/").filter(Boolean);
        if (parts.length >= 2) {
          const owner = parts[0];
          const repo = parts[1];
          router.replace(`/report/${owner}/${repo}`);
        } else {
          alert("Invalid GitHub URL structure");
          router.replace('/');
        }
      } catch {
        alert("Invalid URL format");
        router.replace('/');
      }
    } else {
      router.replace('/');
    }
  }, [urlParam, router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-10 rounded-3xl text-center shadow-2xl">
        <div className="py-8">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-8"></div>
          <h3 className="text-2xl font-bold mb-3">Initializing Scan</h3>
          <p className="text-gray-400">Fetching repository data and connecting to GitHub API.</p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AnalyzeContent />
    </Suspense>
  );
}
