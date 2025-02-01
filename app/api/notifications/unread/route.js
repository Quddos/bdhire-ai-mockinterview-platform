import { db } from '@/utils/db'
import { jobNotification } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ count: 0 })
    }

    const unreadNotifications = await db
      .select()
      .from(jobNotification)
      .where(eq(jobNotification.userId, userId))
      .where(eq(jobNotification.isRead, false))

    return NextResponse.json({ count: unreadNotifications.length })
  } catch (error) {
    console.error('Error fetching unread notifications:', error)
    return NextResponse.json({ count: 0 })
  }
} 