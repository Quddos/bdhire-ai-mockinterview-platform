'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Heart, MessageCircle, Link2, Image as ImageIcon, Bold, Underline, Smile } from 'lucide-react'
import CreatePost from '@/components/meetanyone/CreatePost'
import PostCard from '@/components/meetanyone/PostCard'

export default function MeetAnyone() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState('scholarship')
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'scholarship', label: 'Scholarship' },
    { id: 'gigs', label: 'Gigs' },
    { id: 'news', label: 'News' },
    { id: 'connection', label: 'Make Connection' },
    { id: 'visa', label: 'Visa' }
  ]

  useEffect(() => {
    fetchPosts(activeTab)
  }, [activeTab])

  const fetchPosts = async (category) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/meetanyone?category=${category}`)
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`/api/meetanyone/${postId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setPosts(posts.filter(post => post.id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 pt-20">
        <Tabs defaultValue="scholarship" className="w-full mt-8">
          <TabsList className="flex space-x-2 bg-white p-1 rounded-lg">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                onClick={() => setActiveTab(category.id)}
                className="flex-1"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                <CreatePost
                  category={category.id}
                  onPostCreated={() => fetchPosts(category.id)}
                />

                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8">No posts yet</div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
} 