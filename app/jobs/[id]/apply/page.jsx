'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplyJob({ params }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    roleApplying: '',
    joinTime: '',
    resume: null
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'resume') {
          formDataToSend.append('resume', formData.resume)
        } else {
          formDataToSend.append(key, formData[key])
        }
      })
      formDataToSend.append('jobId', params.id)

      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) throw new Error('Application failed')

      router.push(`/jobs/${params.id}/apply/success`)
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Apply for Position</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Applying For
              </label>
              <input
                type="text"
                required
                value={formData.roleApplying}
                onChange={(e) => setFormData({ ...formData, roleApplying: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How soon can you join?
              </label>
              <select
                required
                value={formData.joinTime}
                onChange={(e) => setFormData({ ...formData, joinTime: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Time</option>
                <option value="immediately">Immediately</option>
                <option value="2weeks">2 Weeks</option>
                <option value="1month">1 Month</option>
                <option value="2months">2 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Resume (PDF)
              </label>
              <input
                type="file"
                required
                accept=".pdf"
                onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 