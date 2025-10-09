'use client'

import { useState } from 'react'
import FileUpload from './FileUpload'

interface VideoData {
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
}

export default function VideoUploadSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadedVideo, setUploadedVideo] = useState<any>(null)

  const handleUploadSuccess = (response: any) => {
    setUploadedVideo(response)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedVideo || !formData.title.trim()) {
      alert('Please provide a title and upload a video')
      return
    }

    setUploading(true)
    try {
      const videoData: VideoData = {
        title: formData.title,
        description: formData.description,
        videoUrl: uploadedVideo.url,
        thumbnailUrl: uploadedVideo.thumbnailUrl || uploadedVideo.url,
      }

      const response = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData),
      })

      if (response.ok) {
        alert('Video uploaded successfully!')
        setFormData({ title: '', description: '' })
        setUploadedVideo(null)
        setIsOpen(false)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Upload failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Error uploading video:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-12 animate-fade-in">
      {!isOpen ? (
        <div className="text-center">
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center px-6 py-3 border-2 border-secondary-300 text-base font-medium rounded-md text-secondary-900 bg-primary-500 hover:bg-primary-600 transition-all duration-200 shadow-md hover:shadow-lg hover:transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Video
          </button>
        </div>
      ) : (
        <div className="bg-secondary-100 border-2 border-secondary-200 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-secondary-900">Upload New Video</h3>
            <button
              onClick={() => {
                setIsOpen(false)
                setFormData({ title: '', description: '' })
                setUploadedVideo(null)
              }}
              className="text-secondary-400 hover:text-secondary-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Video File
              </label>
              <FileUpload
                fileType="video"
                onSuccess={handleUploadSuccess}
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border-2 border-secondary-300 rounded-md bg-secondary-50 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-md"
                placeholder="Enter video title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border-2 border-secondary-300 rounded-md bg-secondary-50 text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-md"
                placeholder="Enter video description"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  setFormData({ title: '', description: '' })
                  setUploadedVideo(null)
                }}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-200 hover:bg-secondary-300 rounded-md transition-colors border-2 border-secondary-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || !uploadedVideo || !formData.title.trim()}
                className="px-6 py-2 text-sm font-medium text-secondary-900 bg-primary-500 hover:bg-primary-600 disabled:bg-secondary-300 disabled:cursor-not-allowed rounded-md transition-colors shadow-md hover:shadow-lg border-2 border-secondary-300"
              >
                {uploading ? 'Publishing...' : 'Publish Video'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
