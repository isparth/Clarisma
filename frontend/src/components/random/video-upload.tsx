"use client";

import type React from "react";

import { useState } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
// Define the prop interface to accept a question.
interface VideoUploadProps {
  question: string;
}

export function VideoUpload({ question }: VideoUploadProps) {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check if it's a video file
    if (!selectedFile.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    // Create a video element to check duration
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);

      // Check if video is under 2 minutes
      if (video.duration > 140) {
        setError("Video must be under 2 minutes");
        return;
      }

      setFile(selectedFile);
    };

    video.onerror = () => {
      setError("Error validating video file");
    };

    video.src = URL.createObjectURL(selectedFile);
  };

  // Handle file upload, including simulating progress and sending the question.
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 200);

      // Simulate upload completion after 4 seconds.
      setTimeout(async () => {
        clearInterval(interval);
        setProgress(100);

        const formData = new FormData();
        formData.append("file", file);
        // Append the question passed from the parent
        formData.append("question", question);

        const response = await fetch("http://127.0.0.1:8000/process_video", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data);

        setUploading(false);
        setSuccess(true);
        setFile(null);

        // Reset file input element
        const fileInput = document.getElementById(
          "video-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Save feedback to localStorage and redirect
        localStorage.setItem("feedbackData", JSON.stringify(data));

        navigate("/Feedback");
      }, 4000);
    } catch (err) {
      setError("Error uploading video");
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setError(null);
    setUploading(false);
    setProgress(0);
    setSuccess(false);

    // Reset file input
    const fileInput = document.getElementById(
      "video-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors">
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <label
          htmlFor="video-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Click to select a video file
            <br />
            <span className="text-xs">(Max 2 minutes)</span>
          </p>
        </label>
      </div>

      {file && (
        <div className="border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            {!uploading && (
              <Button variant="ghost" size="icon" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {uploading && (
            <div className="mt-2">
              <p className="text-xs text-right mt-1">{progress}%</p>
            </div>
          )}

          {!uploading && !success && (
            <Button className="w-full mt-2" onClick={handleUpload}>
              Upload Video
            </Button>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>Video uploaded successfully!</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
