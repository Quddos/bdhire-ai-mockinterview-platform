import { db } from '@/utils/db'
import { jobPost } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const updatedJob = await db
      .update(jobPost)
      .set(body)
      .where(eq(jobPost.id, id))
      .returning()
    return NextResponse.json(updatedJob[0])
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    await db.delete(jobPost).where(eq(jobPost.id, id))
    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  try {
    const jobs = await db
      .select()
      .from(jobPost)
      .where(eq(jobPost.id, parseInt(params.id)))
      .limit(1)

    if (!jobs.length) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(jobs[0])
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
} 