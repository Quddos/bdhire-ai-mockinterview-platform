import { db } from '@/utils/db'
import { jobPost } from '@/utils/schema'
import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const jobs = await db
      .select()
      .from(jobPost)
      .orderBy(desc(jobPost.createdAt)) // Order by newest first

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
} 