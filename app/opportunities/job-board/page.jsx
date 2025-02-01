'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Calendar } from 'lucide-react'
import Header from '@/components/header'

export default function JobBoard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/jobs')
        if (!response.ok) throw new Error('Failed to fetch jobs')
        const data = await response.json()
        setJobs(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError('Failed to load jobs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-20">
          <div className="animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Positions</h1>
        
        <div className="grid gap-4">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {job.title}
                  </h2>
                  <h3 className="text-lg text-gray-700 mb-4">
                    {job.companyName}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2" />
                      {job.jobType}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button
                  className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/jobs/${job.id}/apply`)
                  }}
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 