 'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import Header from '@/components/header'

export default function ApplicationSuccess() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to job board after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/opportunities/job-board')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-6"
          >
            <CheckCircle className="w-20 h-20 text-green-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for applying through Qudmeet. We will review your application and get back to you soon.
          </p>
          <div className="text-sm text-gray-500">
            You will be redirected to the job board in 5 seconds...
          </div>
        </motion.div>
      </div>
    </div>
  )
}