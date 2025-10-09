"use client";

import { upload } from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
  fileType?: "image" | "video" | "audio" | "document";
  onSuccess: (response: any) => void;
  onProgress?: (progress: number) => void;
}

const FileUpload = ({
  onSuccess,
  onProgress,
  fileType = "video",
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file.");
        return false;
      }
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("File size exceeds the 100MB limit.");
      return false;
    }

    return true;
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      
      if (!authRes.ok) {
        throw new Error("Failed to get ImageKit authentication");
      }
      
      const auth = await authRes.json();

      const result = await upload({
        file,
        fileName: file.name,
        folder: "/videos",
        useUniqueFileName: true,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
      });

      onSuccess(result);
      setProgress(100);
    } catch (error) {
      console.error("Upload failed:", error);
      setError(
        error instanceof Error ? error.message : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${
            uploading
              ? "border-primary-300 bg-primary-50"
              : "border-secondary-300 hover:border-primary-400 hover:bg-primary-50"
          }
          ${error ? "border-red-300 bg-red-50" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={fileType === "video" ? "video/*" : "*"}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className={`w-12 h-12 ${
                uploading ? "text-primary-500" : "text-secondary-400"
              }`}
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
              <p className="text-sm font-medium text-primary-700">
                Uploading... {progress}%
              </p>
              <div className="w-full bg-primary-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-secondary-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                {fileType === "video"
                  ? "Video files up to 100MB"
                  : "Files up to 100MB"}
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
