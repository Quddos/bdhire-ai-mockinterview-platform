import { db } from '@/utils/db'
import { meetanyonepost } from '@/utils/schema'
import { getAuth } from '@clerk/nextjs/server'
import { desc, eq } from 'drizzle-orm'

export async function POST(req) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { content, category, imageUrl, linkUrl, linkTitle, authorName, authorImage } = await req.json()
    
    const post = await db.insert(meetanyonepost).values({
      content,
      category,
      imageUrl,
      linkUrl,
      linkTitle,
      authorId: userId,
      authorName,
      authorImage,
      createdAt: new Date().toISOString(),
      likes: '[]'
    }).returning()

    return Response.json(post[0])
  } catch (error) {
    console.error('Error creating post:', error)
    return new Response(error.message, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    
    const posts = await db
      .select()
      .from(meetanyonepost)
      .where(eq(meetanyonepost.category, category))
      .orderBy(desc(meetanyonepost.createdAt))
    
    return Response.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return new Response(error.message, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('id')
    
    // First check if the post belongs to the user
    const post = await db
      .select()
      .from(meetanyonepost)
      .where(eq(meetanyonepost.id, postId))
      .limit(1)

    if (!post.length || post[0].authorId !== userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const deletedPost = await db
      .delete(meetanyonepost)
      .where(eq(meetanyonepost.id, postId))
      .returning()

    return Response.json(deletedPost[0])
  } catch (error) {
    console.error('Error deleting post:', error)
    return new Response(error.message, { status: 500 })
  }
} 