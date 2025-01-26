'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader2, FileText, Book } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface ResearchAnalysis {
  title: string;
  journal: string;
  year: string;
  contribution: string;
  limitation: string;
  areaOfFocus: string;
  methodology: {
    approach: string;
    tools: string[];
  };
  futureWork: string[];
}

export default function ResearchAnalyzer() {
  const [pdfText, setPdfText] = useState('')
  const [analysis, setAnalysis] = useState<ResearchAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [pdfLib, setPdfLib] = useState<any>(null)

  // Initialize PDF.js dynamically
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist')
        if (typeof window !== 'undefined') {
          const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry')
          pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default
        }
        setPdfLib(pdfjsLib)
      } catch (error) {
        console.error('Error loading PDF.js:', error)
      }
    }
    loadPdfJs()
  }, [])

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!pdfLib) {
      toast.error('PDF processor is not ready. Please try again.')
      return
    }

    const file = acceptedFiles[0]
    
    if (file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer()
        
        const loadingTask = pdfLib.getDocument({
          data: arrayBuffer,
          useSystemFonts: true,
        })

        const pdf = await loadingTask.promise
        let fullText = ''
        
        toast.info(`Processing PDF (0/${pdf.numPages} pages)`)
        
        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items
              .map((item: { str: string }) => item.str)
              .join(' ')
            fullText += pageText + '\n'
            
            toast.info(`Processing PDF (${i}/${pdf.numPages} pages)`)
          } catch (pageError) {
            console.error(`Error processing page ${i}:`, pageError)
            continue
          }
        }
        
        if (!fullText.trim()) {
          throw new Error('No text content found in PDF')
        }
        
        setPdfText(fullText)
        toast.success('Research paper uploaded successfully!')
      } catch (error) {
        console.error('PDF parsing error:', error)
        if (error instanceof Error) {
          toast.error(`Error: ${error.message}`)
        } else {
          toast.error('Error reading PDF file. Please try again.')
        }
      }
    } else {
      toast.error('Please upload a PDF file')
    }
  }, [pdfLib])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 5242880, // 5MB
    multiple: false,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]
      if (error?.code === 'file-too-large') {
        toast.error('File is too large. Maximum size is 5MB')
      } else if (error?.code === 'file-invalid-type') {
        toast.error('Invalid file type. Please upload a PDF file')
      } else {
        toast.error('Error uploading file. Please try again.')
      }
    }
  })

  const handleAnalyze = async () => {
    if (!pdfText) {
      toast.error('Please upload a research paper')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/analyze-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfText: pdfText.slice(0, 30000) }), // Limit text length
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setAnalysis(data)
      toast.success('Analysis completed successfully!')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze research paper')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* File Upload Section */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive ? 'Drop the research paper here...' : 'Drag & drop your research paper, or click to select'}
        </p>
        <p className="text-sm text-gray-500 mt-2">Supports PDF files (Max 5MB)</p>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAnalyze}
          disabled={loading || !pdfText}
          className="px-8 py-4 bg-blue-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Analyzing...
            </span>
          ) : (
            'Analyze Paper'
          )}
        </motion.button>
      </div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResultCard title="Title" content={analysis.title} />
              <ResultCard title="Journal/Conference" content={analysis.journal} />
              <ResultCard title="Year" content={analysis.year} />
              <ResultCard title="Area of Focus" content={analysis.areaOfFocus} />
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-6">
              <ResultCard title="Main Contributions" content={analysis.contribution} />
              <ResultCard title="Research Limitations" content={analysis.limitation} />
              
              {/* Methodology */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Methodology</h3>
                <p className="text-gray-700 mb-4">{analysis.methodology.approach}</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.methodology.tools.map((tool, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Future Work */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Future Work</h3>
                <ul className="list-disc list-inside space-y-2">
                  {analysis.futureWork.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ResultCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-700">{content}</p>
    </div>
  )
} 