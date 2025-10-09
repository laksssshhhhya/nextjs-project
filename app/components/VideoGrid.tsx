'use client'

import { useEffect, useState } from 'react'
import VideoPlayer from './VideoPlayer'

interface Video {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  createdAt: string
}

interface VideoGridProps {
  videos: Video[]
}

const SkeletonCard = () => (
  <div className="bg-secondary-100 rounded-lg shadow-md overflow-hidden animate-pulse border-2 border-secondary-200">
    <div className="aspect-video bg-secondary-200 relative flex items-center justify-center">
      <svg
        className="w-10 h-10 text-secondary-300"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 16 20"
      >
        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"></path>
        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"></path>
      </svg>
    </div>
    <div className="p-4 space-y-3">
      <div className="h-3 bg-secondary-200 rounded-full w-3/4"></div>
      <div className="h-2 bg-secondary-200 rounded-full w-full"></div>
      <div className="h-2 bg-secondary-200 rounded-full w-5/6"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-2 bg-secondary-200 rounded-full w-20"></div>
        <div className="h-2 bg-secondary-200 rounded-full w-10"></div>
      </div>
    </div>
  </div>
)

export default function VideoGrid({ videos }: VideoGridProps) {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-200 mb-4">
          <svg className="w-10 h-10 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
        </div>
        <h4 className="text-xl font-semibold text-secondary-900 mb-2">No videos yet</h4>
        <p className="text-secondary-600">Be the first to share a video with the community!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="animate-fade-in">
          <div className="bg-secondary-100 rounded-lg border-2 border-secondary-200 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary-500 hover:-translate-y-1">
            {/* Video Player */}
            <div className="aspect-video bg-black relative">
              <VideoPlayer 
                src={video.videoUrl} 
                poster={video.thumbnailUrl}
                title={video.title}
                description={video.description}
              />
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h4 className="font-bold text-lg text-secondary-900 mb-2 line-clamp-2 hover:text-primary-500 transition-colors cursor-pointer">
                {video.title}
              </h4>
              
              {video.description && (
                <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
                  {video.description}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t border-secondary-200">
                <span className="text-xs text-secondary-500 font-medium">
                  {mounted ? new Date(video.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  }) : 'Loading...'}
                </span>
                
                <div className="flex items-center space-x-1 text-secondary-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
