import { NextResponse } from 'next/server';
import { analyzeRepository } from '@/lib/heuristics';

export async function POST(request: Request) {
  try {
    const { owner, repo } = await request.json();
    
    if (!owner || !repo) {
      return NextResponse.json({ error: 'Owner and repo required' }, { status: 400 });
    }

    const report = await analyzeRepository(owner, repo);
    
    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
