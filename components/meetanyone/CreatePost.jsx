'use client'

import { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useUser } from '@clerk/nextjs'
import { Link2, Image as ImageIcon } from 'lucide-react'
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
      return 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50'
    case 'gigs':
      return 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
    case 'news':
      return 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
    case 'connection':
      return 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'
    case 'visa':
      return 'border-red-200 bg-gradient-to-br from-red-50 to-rose-50'
    default:
      return 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'
  }
}

export default function CreatePost({ category, onPostCreated }) {
  const { user } = useUser()
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef()
  const styles = getCategoryStyles(category)

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=48c911006eae4895f35cccb562430bd7`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        setImageUrl(data.data.display_url)
      } else {
        throw new Error('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    }
  }

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return
    
    try {
      setIsSubmitting(true)
      const res = await fetch('/api/meetanyone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          category,
          imageUrl,
          linkUrl,
          linkTitle,
          authorName: user.fullName,
          authorImage: user.imageUrl
        })
      })

      if (res.ok) {
        setContent('')
        setImageUrl('')
        setLinkUrl('')
        setLinkTitle('')
        onPostCreated()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={`p-6 border-2 ${styles} max-w-2xl mx-auto shadow-lg`}>
      <div className="flex space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>{user?.firstName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={quillModules}
            placeholder="Share your thoughts..."
            className="bg-white rounded-lg mb-4"
          />
          
          {imageUrl && (
            <div className="mt-4 relative rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt="Upload preview"
                className="max-h-48 w-full object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => setImageUrl('')}
              >
                Remove
              </Button>
            </div>
          )}

          {linkUrl && (
            <div className="mt-4">
              <input
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Link title (optional)"
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Image
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = prompt('Enter URL:')
                  if (url) setLinkUrl(url)
                }}
              >
                <Link2 className="w-5 h-5 mr-2" />
                Link
              </Button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !content.trim()}
              className={styles}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
} 