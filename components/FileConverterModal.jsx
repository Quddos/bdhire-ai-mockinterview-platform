'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, FileType, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export default function FileConverterModal({ isOpen, onClose }) {
  const [ffmpeg, setFfmpeg] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [file, setFile] = useState(null)
  const [outputFormat, setOutputFormat] = useState('')
  const [converting, setConverting] = useState(false)
  const [convertedFile, setConvertedFile] = useState(null)

  useEffect(() => {
    const load = async () => {
      const ffmpegInstance = new FFmpeg()
      try {
        // Load ffmpeg.wasm-core script
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd'
        await ffmpegInstance.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        })
        setFfmpeg(ffmpegInstance)
        setLoaded(true)
      } catch (error) {
        console.error('Error loading FFmpeg:', error)
      }
    }
    load()
  }, [])

  const supportedFormats = {
    video: ['.mp4', '.avi', '.mov', '.mkv', '.webm'],
    audio: ['.mp3', '.wav', '.ogg', '.m4a'],
    image: ['.jpg', '.png', '.gif', '.webp']
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setConvertedFile(null)
    }
  }

  const convertFile = async () => {
    try {
      setConverting(true)
      if (!loaded) return

      const inputFileName = 'input_file'
      const outputFileName = `output_file${outputFormat}`
      
      // Write the file to FFmpeg's file system
      await ffmpeg.writeFile(inputFileName, await fetchFile(file))
      
      // Run the FFmpeg command
      await ffmpeg.exec(['-i', inputFileName, outputFileName])
      
      // Read the output file
      const data = await ffmpeg.readFile(outputFileName)
      const blob = new Blob([data.buffer], { type: `${file.type}` })
      setConvertedFile(URL.createObjectURL(blob))
      
      // Clean up
      await ffmpeg.deleteFile(inputFileName)
      await ffmpeg.deleteFile(outputFileName)
    } catch (error) {
      console.error('Error converting file:', error)
    } finally {
      setConverting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">File Converter</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </span>
                </label>
              </div>

              {/* Format Selection */}
              {file && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Convert to:</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select format</option>
                    {Object.entries(supportedFormats).map(([category, formats]) => (
                      <optgroup label={category.toUpperCase()} key={category}>
                        {formats.map((format) => (
                          <option key={format} value={format}>
                            {format}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              )}

              {/* Convert Button */}
              {file && outputFormat && (
                <Button
                  onClick={convertFile}
                  disabled={converting}
                  className="w-full py-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                >
                  {converting ? 'Converting...' : 'Qudmeet Convert Click'}
                </Button>
              )}

              {/* Download Button */}
              {convertedFile && (
                <Button
                  asChild
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  <a href={convertedFile} download={`converted${outputFormat}`}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Converted File
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 