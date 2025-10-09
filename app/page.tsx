import { getServerSession } from 'next-auth'
import { authOptions } from '../lib/auth'
import { connectToDatabase } from '../lib/db'
import Video from '../models/Video'
import VideoUploadSection from './components/VideoUploadSection'
import VideoGrid from './components/VideoGrid'
import Link from 'next/link'

async function getVideos() {
  try {
    await connectToDatabase()
    const videos = await Video.find().sort({ createdAt: -1 }).lean()
    return videos.map((video: any) => ({
      id: video._id.toString(),
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      createdAt: video.createdAt,
    }))
  } catch (error) {
    console.error('Error fetching videos:', error)
    return []
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions)
  const videos = await getVideos()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-2 border-secondary-200 bg-secondary-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-secondary-900 tracking-wide">
                Dodo
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-secondary-600 px-3 py-1 bg-secondary-200 rounded-full">
                    Welcome, {session.user?.email}
                  </span>
                  <Link 
                    href="/api/auth/signout" 
                    className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 transition-colors hover:bg-secondary-200 rounded-md"
                  >
                    Sign Out
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 transition-colors hover:bg-secondary-200 rounded-md"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-sm font-medium text-secondary-900 bg-primary-500 hover:bg-primary-600 rounded-md transition-colors shadow-md hover:shadow-lg border-2 border-secondary-300"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Share Your Videos with the World
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Upload, share, and discover amazing video content. Join our community of creators and viewers.
          </p>
        </div>

        {/* Upload Section */}
        {session ? (
          <VideoUploadSection />
        ) : (
          <div className="bg-secondary-100 border-2 border-secondary-200 rounded-lg p-8 text-center mb-12 animate-fade-in shadow-md">
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Ready to share your videos?
            </h3>
            <p className="text-secondary-700 mb-4">
              Sign up now to start uploading and sharing your content
            </p>
            <Link 
              href="/login" 
              className="inline-flex items-center px-6 py-3 border-2 border-secondary-300 text-base font-medium rounded-md text-secondary-900 bg-primary-500 hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        )}

        {/* Videos Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-secondary-900 mb-6">Latest Videos</h3>
          <VideoGrid videos={videos} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-secondary-200 bg-secondary-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-secondary-600">
            <p>&copy; 2024 VideoShare. Built with Next.js and ImageKit.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

