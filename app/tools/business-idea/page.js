"use client"
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Target, Users, DollarSign, Lightbulb, BarChart, ShoppingBag, TrendingUp, Download, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import html2pdf from 'html2pdf.js'


const industries = [
 
  { 
    name: 'E-commerce', 
    icon: <ShoppingBag className="w-6 h-6" />,
    color: 'bg-purple-100 hover:bg-purple-200',
    borderColor: 'border-purple-500',
    selectedBg: 'bg-purple-50',
    animation: 'hover:rotate-3 transition-transform'
  },
  { 
    name: 'Technologies', 
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'bg-blue-100 hover:bg-blue-200',
    borderColor: 'border-blue-500',
    selectedBg: 'bg-blue-50',
    animation: 'hover:scale-105 transition-transform'
  },
  { 
    name: 'Services', 
    icon: <Users className="w-6 h-6" />,
    color: 'bg-green-100 hover:bg-green-200',
    borderColor: 'border-green-500',
    selectedBg: 'bg-green-50',
    animation: 'hover:-translate-y-1 transition-transform'
  },
  { 
    name: 'Marketing', 
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'bg-pink-100 hover:bg-pink-200',
    borderColor: 'border-pink-500',
    selectedBg: 'bg-pink-50',
    animation: 'hover:scale-105 hover:rotate-1 transition-transform'
  },
  { 
    name: 'Education', 
    icon: <Target className="w-6 h-6" />,
    color: 'bg-yellow-100 hover:bg-yellow-200',
    borderColor: 'border-yellow-500',
    selectedBg: 'bg-yellow-50',
    animation: 'hover:scale-110 transition-transform'
  },
  { 
    name: 'Finance', 
    icon: <DollarSign className="w-6 h-6" />,
    color: 'bg-teal-100 hover:bg-teal-200',
    borderColor: 'border-teal-500',
    selectedBg: 'bg-teal-50',
    animation: 'hover:-rotate-3 transition-transform'
  },
]

const budgetRanges = [
  { range: '$0 - $1,000', icon: <DollarSign className="w-4 h-4" /> },
  { range: '$1,000 - $5,000', icon: <DollarSign className="w-4 h-4" /> },
  { range: '$5,000 - $10,000', icon: <DollarSign className="w-4 h-4" /> },
  { range: '$10,000+', icon: <DollarSign className="w-4 h-4" /> },
]

const investmentOpportunities = [
  {
    name: 'Start-Up Chile',
    description: 'Government-backed accelerator offering equity-free funding',
    amount: 'Up to $40,000',
    icon: '🇨🇱',
    link: 'https://www.startupchile.org/',
    color: 'bg-red-50 hover:bg-red-100',
    borderColor: 'border-red-200'
  },
  {
    name: 'Y Combinator',
    description: 'Leading startup accelerator with global reach',
    amount: 'Up to $500,000',
    icon: '🚀',
    link: 'https://www.ycombinator.com/',
    color: 'bg-orange-50 hover:bg-orange-100',
    borderColor: 'border-orange-200'
  },
  {
    name: 'Techstars',
    description: 'Worldwide network of startup accelerators',
    amount: 'Up to $120,000',
    icon: '⭐',
    link: 'https://www.techstars.com/',
    color: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200'
  },
  {
    name: 'New Soda',
    description: 'Digital innovation and startup studio',
    amount: 'Varies',
    icon: '🥤',
    link: 'https://newsoda.com/',
    color: 'bg-purple-50 hover:bg-purple-100',
    borderColor: 'border-purple-200'
  }
]

export default function BusinessIdeaGenerator() {
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [interests, setInterests] = useState('')
  const [selectedBudget, setSelectedBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [businessIdea, setBusinessIdea] = useState(null)

  const generateIdea = async (e) => {
    e.preventDefault()
    
    if (!selectedIndustry || !interests || !selectedBudget) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/business-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: selectedIndustry,
          interests,
          budget: selectedBudget,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setBusinessIdea(data.idea)
      toast.success('Business idea generated!')
    } catch (error) {
      toast.error(error.message || 'Failed to generate business ideas')
    } finally {
      setLoading(false)
    }
  }

  const downloadAsPDF = () => {
    const content = document.getElementById('business-idea-content')
    const opt = {
      margin: 1,
      filename: 'business-idea.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    html2pdf().set(opt).from(content).save()
    toast.success('Downloading PDF...')
  }

  return (
    <div>
      
      <div className="container mx-auto px-4 py-6 mt-20">
        <div className="flex flex-col lg:flex-row gap-6 max-w-[1500px] mx-auto">
          {/* Form Section */}
          <Card className="lg:w-1/2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl p-6">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lightbulb className="w-6 h-6 text-yellow-500 animate-pulse" />
                AI Business Idea Generator
              </CardTitle>
              <CardDescription>
                Transform your vision into a viable business concept
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={generateIdea} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Select Your Industry</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {industries.map((industry) => (
                      <button
                        key={industry.name}
                        type="button"
                        onClick={() => setSelectedIndustry(industry.name)}
                        className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 
                          ${industry.animation} ${industry.color}
                          ${selectedIndustry === industry.name 
                            ? `${industry.borderColor} ${industry.selectedBg}` 
                            : 'border-transparent'}`}
                      >
                        <div className="p-2 bg-white rounded-full shadow-md">
                          {industry.icon}
                        </div>
                        <span className="text-sm font-medium text-center">{industry.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Your Interests & Skills</label>
                  <textarea
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="Tell us about your passions, skills, and experience..."
                    className="w-full h-32 p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Investment Budget</label>
                  <div className="grid grid-cols-2 gap-3">
                    {budgetRanges.map((budget) => (
                      <button
                        key={budget.range}
                        type="button"
                        onClick={() => setSelectedBudget(budget.range)}
                        className={`p-3 rounded-lg border-2 flex items-center gap-2 
                          transition-all hover:scale-102 text-sm
                          ${selectedBudget === budget.range 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <div className="p-1.5 bg-green-100 rounded-full">
                          {budget.icon}
                        </div>
                        <span className="font-medium">{budget.range}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-4 font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Business Idea'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          {businessIdea && (
            <div className="lg:w-1/2 space-y-4">
              <Card className="shadow-lg">
                <CardHeader className="p-6">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-500" />
                    Business Idea Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div 
                    id="business-idea-content"
                    className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg shadow-inner whitespace-pre-wrap mb-4"
                  >
                    {businessIdea}
                  </div>
                  <div className="flex gap-3 mb-6">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(businessIdea)
                        toast.success('Copied to clipboard!')
                      }}
                      variant="outline"
                      className="flex-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      onClick={downloadAsPDF}
                      variant="outline"
                      className="flex-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>

                  {/* Investment Opportunities Section */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      Recommended Investment Opportunities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {investmentOpportunities.map((opportunity) => (
                        <a
                          key={opportunity.name}
                          href={opportunity.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-4 rounded-lg border ${opportunity.color} ${opportunity.borderColor} 
                            transition-all duration-300 hover:scale-[1.02] hover:shadow-md`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{opportunity.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{opportunity.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                              <div className="mt-2 inline-block px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                                {opportunity.amount}
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Additional Resources Button */}
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100"
                    onClick={() => window.open('https://www.startupresources.io/', '_blank')}
                  >
                    <span className="mr-2">🔍</span>
                    Explore More Startup Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 