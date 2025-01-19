'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Download, FileType, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import Header from '@/components/header'

export default function ConverterPage() {
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
      
      await ffmpeg.writeFile(inputFileName, await fetchFile(file))
      await ffmpeg.exec(['-i', inputFileName, outputFileName])
      
      const data = await ffmpeg.readFile(outputFileName)
      const blob = new Blob([data.buffer], { type: `${file.type}` })
      setConvertedFile(URL.createObjectURL(blob))
      
      await ffmpeg.deleteFile(inputFileName)
      await ffmpeg.deleteFile(outputFileName)
    } catch (error) {
      console.error('Error converting file:', error)
    } finally {
      setConverting(false)
    }
  }

  const resetConverter = () => {
    setFile(null)
    setOutputFormat('')
    setConvertedFile(null)
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-center mb-8">
              File Converter
            </h1>

            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
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
                  {file ? (
                    <div className="flex items-center space-x-2">
                      <FileType className="w-8 h-8 text-blue-500" />
                      <span className="text-lg font-medium">{file.name}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          resetConverter()
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload or drag and drop here
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        Supports video, audio, and image files
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Format Selection */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-medium">Convert to:</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white"
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
                </motion.div>
              )}

              {/* Convert Button */}
              {file && outputFormat && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    onClick={convertFile}
                    disabled={converting || !loaded}
                    className="w-full py-6 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white hover:opacity-90"
                  >
                    {converting ? 'Converting...' : 'Qudmeet Convert Click'}
                  </Button>
                </motion.div>
              )}

              {/* Download Button */}
              {convertedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button
                    asChild
                    className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                  >
                    <a href={convertedFile} download={`converted${outputFormat}`}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Converted File
                    </a>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
} 