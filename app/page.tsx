import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import VideoUploadSection from "./components/VideoUploadSection";
import VideoGrid from "./components/VideoGrid";
import Link from "next/link";

async function getVideos() {
  try {
    await connectToDatabase();
    const videos = await Video.find().sort({ createdAt: -1 }).lean();
    return videos.map((video: any) => ({
      _id: video._id.toString(),
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      createdAt: video.createdAt,
      // Add any other fields required by the Video type here
    }));
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const videos = await getVideos();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-secondary-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">
                VideoShare
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-secondary-600">
                    Welcome, {session.user?.email}
                  </span>
                  <Link
                    href="/api/auth/signout"
                    className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 transition-colors"
                  >
                    Sign Out
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Share Your Videos with the World
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Upload, share, and discover amazing video content. Join our community of creators and viewers.
          </p>
        </div>

        {/* Upload Section - Only show if logged in */}
        {session ? (
          <VideoUploadSection />
        ) : (
          <div className="bg-primary-50 rounded-lg p-8 text-center mb-12">
            <h3 className="text-xl font-semibold text-primary-900 mb-2">
              Ready to share your videos?
            </h3>
            <p className="text-primary-700 mb-4">
              Sign up now to start uploading and sharing your content
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}

        {/* Videos Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-secondary-900 mb-6">
            Latest Videos
          </h3>
          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="text-center py-12">
              <div className="text-secondary-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-secondary-900 mb-2">No videos yet</h4>
              <p className="text-secondary-600">
                Be the first to share a video with the community!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-secondary-600">
            <p>&copy; 2024 VideoShare. Built with Next.js and ImageKit.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}