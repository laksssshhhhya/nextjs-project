'use client'

import { upload } from '@imagekit/next'
import { useRef, useState } from 'react'

interface FileUploadProps {
  fileType?: 'image' | 'video' | 'audio' | 'document'
  onSuccess: (response: any) => void
  onProgress?: (progress: number) => void
}

const FileUpload = ({ onSuccess, onProgress, fileType = 'video' }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    if (fileType === 'video') {
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file.')
        return false
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('File size exceeds the 100MB limit.')
        return false
      }
    }
    return true
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!validateFile(file)) return

    setError(null)
    setSuccess(null)
    setUploading(true)
    setProgress(0)

    try {
      const authRes = await fetch('/api/auth/imagekit-auth')
      if (!authRes.ok) throw new Error('Failed to get ImageKit authentication')
      const auth = await authRes.json()

      const result = await upload({
        file,
        fileName: file.name,
        folder: '/videos',
        useUniqueFileName: true,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
      })

      onSuccess(result)
      setProgress(100)
      setSuccess(`${file.name} uploaded successfully!`)
    } catch (error) {
      console.error('Upload failed:', error)
      setError(error instanceof Error ? error.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div 
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer 
          transition-all duration-200 
          ${uploading 
            ? 'border-primary-500 bg-primary-50/10' 
            : error 
              ? 'border-red-500 bg-red-50/10' 
              : success
                ? 'border-green-500 bg-green-50/10'
                : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50/5'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={fileType === 'video' ? 'video/*' : '*'}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg 
              className={`w-12 h-12 ${uploading ? 'text-primary-500 animate-pulse' : 'text-secondary-400'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
          </div>
          
          {uploading ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary-500">
                Uploading... {progress}%
              </p>
              <div className="w-full bg-secondary-300 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-secondary-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                {fileType === 'video' ? 'Video files up to 100MB' : 'Files up to 100MB'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mt-4 animate-fade-in">
          <div className="flex w-full max-w-96 h-24 bg-secondary-100 rounded-xl overflow-hidden shadow-lg border-2 border-green-500">
            <svg width="16" height="96" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 8 0 
                         Q 4 4.8, 8 9.6 
                         T 8 19.2 
                         Q 4 24, 8 28.8 
                         T 8 38.4 
                         Q 4 43.2, 8 48 
                         T 8 57.6 
                         Q 4 62.4, 8 67.2 
                         T 8 76.8 
                         Q 4 81.6, 8 86.4 
                         T 8 96 
                         L 0 96 
                         L 0 0 
                         Z"
                fill="#66cdaa"
                stroke="#66cdaa"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="mx-2.5 overflow-hidden w-full flex flex-col justify-center">
              <p className="text-lg font-bold text-green-500 leading-6 mr-3 overflow-hidden text-ellipsis whitespace-nowrap">
                Success!
              </p>
              <p className="overflow-hidden leading-5 break-all text-secondary-600 max-h-10 text-sm">
                {success}
              </p>
            </div>
            <button 
              className="w-16 cursor-pointer focus:outline-none flex items-center justify-center"
              onClick={() => setSuccess(null)}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="mediumseagreen"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 animate-fade-in">
          <div className="flex w-full max-w-96 h-24 overflow-hidden bg-secondary-100 shadow-lg rounded-xl border-2 border-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" height="96" width="16">
              <path
                strokeLinecap="round"
                strokeWidth="2"
                stroke="indianred"
                fill="indianred"
                d="M 8 0 
                         Q 4 4.8, 8 9.6 
                         T 8 19.2 
                         Q 4 24, 8 28.8 
                         T 8 38.4 
                         Q 4 43.2, 8 48 
                         T 8 57.6 
                         Q 4 62.4, 8 67.2 
                         T 8 76.8 
                         Q 4 81.6, 8 86.4 
                         T 8 96 
                         L 0 96 
                         L 0 0 
                         Z"
              />
            </svg>
            <div className="mx-2.5 overflow-hidden w-full flex flex-col justify-center">
              <p className="text-lg font-bold text-red-500 leading-6 mr-3 overflow-hidden text-ellipsis whitespace-nowrap">
                Error!
              </p>
              <p className="overflow-hidden leading-5 break-all text-secondary-600 max-h-10 text-sm">
                {error}
              </p>
            </div>
            <button 
              className="w-16 cursor-pointer focus:outline-none flex items-center justify-center"
              onClick={() => setError(null)}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="indianred"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload
