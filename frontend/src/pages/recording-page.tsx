"use client";

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
// Define the structure of a Question object
interface Question {
  text: string;
  time: number;
}

function RecordingPageComponent() {
  // Retrieve query parameters from the URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const questionText = searchParams.get("question");
  const timeStr = searchParams.get("time");

  // If either parameter is missing, display an error message.
  if (!questionText || !timeStr) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          Error: Missing "question" or "time" query parameters.
        </h1>
      </div>
    );
  }

  // Construct the question object using the query parameters.
  const question: Question = {
    text: questionText,
    time: parseInt(timeStr, 10),
  };
  const navigate = useNavigate();
  // State variables for managing the recording process
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(question.time);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [response, setResponse] = useState<Blob | null>(null);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRecording) {
      handleStopRecording();
    }

    return () => clearInterval(interval);
  }, [isRecording, timeLeft]);

  // Start recording by accessing media devices
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingComplete(false);
      setTimeLeft(question.time);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingComplete(true);
    }
  };

  // Save the recorded response as a Blob
  const handleSaveResponse = () => {
    const blob = new Blob(recordedChunks, { type: "video/mp4" });
    setResponse(blob);
    setRecordedChunks([]);
    setTimeLeft(question.time);
    setRecordingComplete(false);
  };

  // Allow retaking of the recording
  const handleRetake = () => {
    setResponse(null);
    setRecordedChunks([]);
    setTimeLeft(question.time);
    setRecordingComplete(false);
  };

  // Submit the response to the backend along with the question text
  const handleSubmit = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingComplete(true);
    }
    const formData = new FormData();
    if (response !== null) {
      formData.append("file", response);
      formData.append("question", question.text);

      const backendresponse = await fetch(
        "http://127.0.0.1:8000/process_video",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await backendresponse.json();
      console.log(data);
      // Save feedback to localStorage and redirect
      localStorage.setItem("feedbackData", JSON.stringify(data));

      navigate("/Feedback");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
            Interview Practice
          </CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-6">
          {/* Question Display */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Question:
            </h2>
            <p className="text-lg sm:text-xl">{question.text}</p>
          </div>

          {/* Video Display */}
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-inner">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          </div>

          {/* Timer and Control Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="text-xl sm:text-2xl font-semibold">
              Time Left: {timeLeft}s
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-2 space-y-2 sm:space-y-0">
              {!isRecording && !recordingComplete && !response && (
                <Button
                  onClick={handleStartRecording}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Start Recording
                </Button>
              )}
              {isRecording && (
                <Button
                  onClick={handleStopRecording}
                  variant="destructive"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Stop Recording
                </Button>
              )}
              {recordingComplete && (
                <>
                  <Button
                    onClick={handleStartRecording}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Record Again
                  </Button>
                  <Button
                    onClick={handleSaveResponse}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Save Response
                  </Button>
                </>
              )}
              {response && (
                <Button
                  onClick={handleRetake}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Retake
                </Button>
              )}
            </div>
          </div>

          {response && (
            <div className="text-center text-green-600">Response saved!</div>
          )}

          {response && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full sm:w-auto"
              >
                Submit Response
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RecordingPageComponent;
