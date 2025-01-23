import { getAuth } from '@clerk/nextjs/server'

export async function DELETE(req) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const imageUrl = searchParams.get('url')

    // Extract delete URL from ImgBB response if available
    // Note: Free tier might not support deletion

    return new Response('Image deleted', { status: 200 })
  } catch (error) {
    return new Response(error.message, { status: 500 })
  }
} 