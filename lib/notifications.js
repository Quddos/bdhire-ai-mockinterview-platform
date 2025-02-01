import { db } from '@/utils/db'
import { jobNotification } from '@/utils/schema'
import { eq, or, and, desc } from 'drizzle-orm'
import { notifications } from '@/utils/schema'
import { auth } from '@clerk/nextjs'

export async function notifyUsers(job) {
  try {
    // Get all users (you'll need to implement this based on your user management system)
    const users = await getActiveUsers()
    
    // Create notifications for each user
    const notifications = users.map(user => ({
      userId: user.id,
      jobId: job.id,
      isRead: false,
      createdAt: new Date().toISOString()
    }))
    
    await db.insert(jobNotification).values(notifications)
  } catch (error) {
    console.error('Error creating notifications:', error)
  }
}

export async function getUnreadNotifications(userId) {
  try {
    const unreadNotifications = await db
      .select()
      .from(notifications)
      .where(
        or(
          eq(notifications.isGlobal, true),
          eq(notifications.userId, userId)
        )
      )
      .where(eq(notifications.isRead, false))
      .orderBy(desc(notifications.createdAt))
      .limit(2)
    
    return unreadNotifications
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId))
    return true
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return false
  }
}

export async function createNotification({ type, title, message, link, userId = null, isGlobal = false }) {
  try {
    const notification = {
      type,
      title,
      message,
      link,
      userId,
      isGlobal,
      createdAt: new Date(),
      isRead: false
    }

    const [newNotification] = await db.insert(notifications).values(notification).returning()
    return newNotification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
} 