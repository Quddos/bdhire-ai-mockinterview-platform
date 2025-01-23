import { db } from '@/utils/db'
import { meetanyonecomment } from '@/utils/schema'
import { getAuth } from '@clerk/nextjs/server'
import { eq, desc, isNull } from 'drizzle-orm'

export async function POST(req) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { content, postId, parentCommentId, authorName, authorImage } = await req.json()
    
    const comment = await db.insert(meetanyonecomment)
      .values({
        content,
        postId,
        parentCommentId: parentCommentId || null,
        authorId: userId,
        authorName,
        authorImage,
        createdAt: new Date().toISOString()
      })
      .returning()

    return Response.json(comment[0])
  } catch (error) {
    console.error('Error creating comment:', error)
    return new Response(error.message, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('postId')
    
    // Get all comments for the post
    const comments = await db.select()
      .from(meetanyonecomment)
      .where(eq(meetanyonecomment.postId, postId))
      .orderBy(desc(meetanyonecomment.createdAt))

    // Organize into parent/child structure
    const commentMap = new Map()
    const rootComments = []

    // First pass: create map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // Second pass: organize into tree structure
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)
      if (comment.parentCommentId === null) {
        rootComments.push(commentWithReplies)
      } else {
        const parent = commentMap.get(comment.parentCommentId)
        if (parent) {
          parent.replies.push(commentWithReplies)
        } else {
          // If parent doesn't exist, treat as root comment
          rootComments.push(commentWithReplies)
        }
      }
    })

    return Response.json(rootComments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return new Response(error.message, { status: 500 })
  }
} 