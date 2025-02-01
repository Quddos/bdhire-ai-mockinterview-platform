import { db } from '@/utils/db'
import { jobPost, notifications } from '@/utils/schema'
import { eq, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { createNotification } from '@/lib/notifications'

export async function GET() {
  try {
    const jobs = await db
      .select()
      .from(jobPost)
      .where(jobPost.status === 'active')
      .orderBy(desc(jobPost.createdAt))

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    
    // Create the job post with proper date handling
    const [newJob] = await db.insert(jobPost).values({
      title: body.title,
      companyName: body.companyName,
      details: body.details,
      location: body.location,
      jobType: body.jobType,
      salary: body.salary,
      requirements: body.requirements,
      directApplyLink: body.directApplyLink?.trim() || null,
      youtubeLink: body.youtubeLink?.trim() || null,
      status: body.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()

    // Create notification with proper date handling
    if (newJob) {
      await db.insert(notifications).values({
        type: 'NEW_JOB',
        title: 'New Job Posted',
        message: `New job opportunity: ${body.title} at ${body.companyName}`,
        link: `/jobs/${newJob.id}`,
        isGlobal: true,
        createdAt: new Date(),
        isRead: false
      })
    }

    return NextResponse.json(newJob)
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      body: body // Log the request body for debugging
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to create job', 
        details: error.message
      },
      { status: 500 }
    )
  }
} 