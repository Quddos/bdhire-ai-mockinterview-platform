import { db } from '@/utils/db'
import { meetanyonepost } from '@/utils/schema'
import { getAuth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

export async function POST(req) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { postId } = await req.json()
    
    const post = await db.select()
      .from(meetanyonepost)
      .where(eq(meetanyonepost.id, postId))
      .limit(1)

    if (!post.length) {
      return new Response('Post not found', { status: 404 })
    }

    const currentLikes = JSON.parse(post[0].likes || '[]')
    const hasLiked = currentLikes.includes(userId)
    
    const updatedLikes = hasLiked 
      ? currentLikes.filter(id => id !== userId)
      : [...currentLikes, userId]

    const updatedPost = await db.update(meetanyonepost)
      .set({ likes: JSON.stringify(updatedLikes) })
      .where(eq(meetanyonepost.id, postId))
      .returning()

    return Response.json({ likes: updatedLikes })
  } catch (error) {
    console.error('Error handling like:', error)
    return new Response(error.message, { status: 500 })
  }
} 