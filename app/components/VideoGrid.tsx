"use client";

import { useEffect, useState } from "react";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

interface VideoGridProps {
  videos: Video[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  const [mounted, setMounted] = useState(false);

  // Only render dates after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (videos.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <div
          key={video._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-video bg-secondary-100 relative">
            <video
              src={video.videoUrl}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
              poster={video.thumbnailUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="p-4">
            <h4 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
              {video.title}
            </h4>

            {video.description && (
              <p className="text-sm text-secondary-600 mb-3 line-clamp-3">
                {video.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-secondary-500">
              <span>
                {/* Only show formatted date after client mount */}
                {mounted ? new Date(video.createdAt).toLocaleDateString() : 'Loading...'}
              </span>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
