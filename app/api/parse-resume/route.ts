import { NextResponse } from 'next/server';
import { parseAndScoreResume } from '@/utils/resumeParser';

export async function POST(request: Request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const analysis = await parseAndScoreResume(resumeText, jobDescription);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Resume parsing error:', error);
    return NextResponse.json(
      { message: 'Error analyzing resume' },
      { status: 500 }
    );
  }
} 