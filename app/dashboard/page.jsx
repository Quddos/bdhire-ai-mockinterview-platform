'use client'

import React from 'react'
import Header from '@/components/header'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <h3 className="text-gray-500 mb-6">Create and Start your AI MockUp Interview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AddNewInterview />
        </div>
       
        <InterviewList />
      </div>
    </div>
  )
}