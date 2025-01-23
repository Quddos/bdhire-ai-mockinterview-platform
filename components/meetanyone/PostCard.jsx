'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Heart, MessageCircle, Trash2, ImageIcon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { formatDistanceToNow, format } from 'date-fns'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    ['link'],
    ['clean']
  ]
}

const getCategoryStyles = (category) => {
  switch (category) {
    case 'scholarship':
      return {
        container: 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50',
        accent: 'text-blue-600 hover:text-blue-700'
      }
    case 'gigs':
      return {
        container: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50',
        accent: 'text-green-600 hover:text-green-700'
      }
    case 'news':
      return {
        container: 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50',
        accent: 'text-purple-600 hover:text-purple-700'
      }
    case 'connection':
      return {
        container: 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50',
        accent: 'text-orange-600 hover:text-orange-700'
      }
    case 'visa':
      return {
        container: 'border-red-200 bg-gradient-to-br from-red-50 to-rose-50',
        accent: 'text-red-600 hover:text-red-700'
      }
    default:
      return {
        container: 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50',
        accent: 'text-gray-600 hover:text-gray-700'
      }
  }
}

const Comment = ({ comment, onReply, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const { user } = useUser()

  const handleReply = async () => {
    if (!replyContent.trim()) return
    await onReply(comment.id, replyContent)
    setReplyContent('')
    setIsReplying(false)
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.authorImage} alt={comment.authorName} />
          <AvatarFallback>{comment.authorName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="font-medium text-sm">{comment.authorName}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            <div className="text-sm mt-1" dangerouslySetInnerHTML={{ __html: comment.content }} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs mt-1"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </Button>
          
          {isReplying && (
            <div className="mt-2">
              <ReactQuill
                value={replyContent}
                onChange={setReplyContent}
                modules={quillModules}
                placeholder="Write a reply..."
                className="bg-white rounded-lg mb-2"
              />
              <Button 
                onClick={handleReply}
                className="post-button"
                disabled={!replyContent.trim()}
              >
                Post Reply
              </Button>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className={`ml-${Math.min(level * 8, 16)}`}>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function PostCard({ post, onDelete }) {
  const { user } = useUser()
  const [isCommenting, setIsCommenting] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState(JSON.parse(post.likes || '[]'))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageError, setImageError] = useState(false)
  const commentSectionRef = useRef(null)
  const styles = getCategoryStyles(post.category)

  useEffect(() => {
    fetchComments()
  }, [post.id])

  useEffect(() => {
    if (isCommenting && commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isCommenting])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/meetanyone/comments?postId=${post.id}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleLike = async () => {
    try {
      const res = await fetch('/api/meetanyone/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id })
      })
      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = async () => {
    if (!comment.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      const res = await fetch('/api/meetanyone/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          content: comment,
          authorName: user.fullName,
          authorImage: user.imageUrl
        })
      })
      
      if (res.ok) {
        const newComment = await res.json()
        setComments([newComment, ...comments])
        setComment('')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (parentCommentId, content) => {
    try {
      const res = await fetch('/api/meetanyone/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          parentCommentId,
          content,
          authorName: user.fullName,
          authorImage: user.imageUrl
        })
      })
      
      if (res.ok) {
        await fetchComments() // Refresh all comments
      }
    } catch (error) {
      console.error('Error posting reply:', error)
    }
  }

  return (
    <Card className={`p-6 border-2 ${styles.container} max-w-2xl mx-auto my-4 shadow-lg hover:shadow-xl transition-shadow duration-200`}>
      <div className="flex space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={post.authorImage} alt={post.authorName} />
          <AvatarFallback>{post.authorName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{post.authorName}</h3>
              <p className="text-sm text-gray-500">
                {format(new Date(post.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
            {user?.id === post.authorId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(post.id)}
                className="hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="mt-4">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {post.imageUrl && !imageError && (
              <div className="mt-4 relative rounded-lg overflow-hidden">
                <div className="relative w-full h-[400px]">
                  <img
                    src={post.imageUrl}
                    alt="Post attachment"
                    className="object-contain w-full h-full"
                    onError={() => setImageError(true)}
                  />
                </div>
              </div>
            )}
            {imageError && (
              <div className="mt-4 flex items-center justify-center h-20 bg-gray-100 rounded-lg text-gray-500">
                <ImageIcon className="w-6 h-6 mr-2" />
                <span>Image unavailable</span>
              </div>
            )}
            
            {post.linkUrl && (
              <a
                href={post.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 ${styles.accent} hover:underline block`}
              >
                {post.linkTitle || post.linkUrl}
              </a>
            )}
          </div>

          <div className="mt-6 flex items-center space-x-4 border-t border-gray-200 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`${likes.includes(user?.id) ? styles.accent : ''}`}
            >
              <Heart className={`w-5 h-5 mr-2 ${likes.includes(user?.id) ? 'fill-current' : ''}`} />
              {likes.length} Likes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCommenting(!isCommenting)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {comments.length} Comments
            </Button>
          </div>

          <div ref={commentSectionRef}>
            {isCommenting && (
              <div className="mt-4">
                <ReactQuill
                  value={comment}
                  onChange={setComment}
                  modules={quillModules}
                  placeholder="Write a comment..."
                  className="bg-white rounded-lg mb-2"
                />
                <Button 
                  onClick={handleComment}
                  disabled={isSubmitting || !comment.trim()}
                  className={`mt-2 ${styles.accent}`}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            )}

            {comments.length > 0 && (
              <div className="mt-4 space-y-4">
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
} 