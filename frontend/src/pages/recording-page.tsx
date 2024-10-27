// Import necessary hooks and components from React and other libraries
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the structure of a Question object
interface Question {
  text: string;
  time: number;
}

// Array of questions with their respective time limits
const questions: Question[] = [
  { text: "How do you stay updated with industry trends?", time: 60 },
  {
    text: "Describe a project where you had to learn a new skill quickly.",
    time: 75,
  },
];

// Main component for the recording page
function RecordingPageComponent() {
  // State variables to manage the component's state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index of the current question
  const [isRecording, setIsRecording] = useState(false); // Whether recording is in progress
  const [timeLeft, setTimeLeft] = useState(questions[0].time); // Time left for the current question
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Reference to the MediaRecorder
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]); // Chunks of recorded video
  const [recordingComplete, setRecordingComplete] = useState(false); // Whether the recording is complete
  const [responses, setResponses] = useState<(Blob | null)[]>(
    new Array(questions.length).fill(null) // Array to store responses for each question
  );

  // Effect hook to handle the countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording && timeLeft > 0) {
      // Decrease timeLeft every second
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Stop recording when time runs out
      handleStopRecording();
    }

    // Clean up the interval when the component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [isRecording, timeLeft]);

  // Function to start recording
  const handleStartRecording = async () => {
    try {
      // Get access to the user's camera and microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      // Set the video element's source to the user's stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Create a MediaRecorder to record the stream
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Collect the recorded data chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      // Start the recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingComplete(false);
      setTimeLeft(questions[currentQuestionIndex].time);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  // Function to stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      // Stop the MediaRecorder
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingComplete(true);
    }
  };

  // Function to save the recorded response
  const handleSaveResponse = () => {
    // Create a Blob from the recorded chunks
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    // Save the response in the responses array
    setResponses((prev) => {
      const newResponses = [...prev];
      newResponses[currentQuestionIndex] = blob;
      return newResponses;
    });
    // Reset recorded chunks and state variables
    setRecordedChunks([]);
    setTimeLeft(questions[currentQuestionIndex].time);
    setRecordingComplete(false);
  };

  // Function to retake the recording
  const handleRetake = () => {
    // Remove the saved response for the current question
    setResponses((prev) => {
      const newResponses = [...prev];
      newResponses[currentQuestionIndex] = null;
      return newResponses;
    });
    // Reset recorded chunks and state variables
    setRecordedChunks([]);
    setTimeLeft(questions[currentQuestionIndex].time);
    setRecordingComplete(false);
  };

  // Function to navigate to the next question
  const handleNextQuestion = () => {
    if (isRecording) {
      // Stop any ongoing recording
      handleStopRecording();
      setRecordedChunks([]);
    }
    if (currentQuestionIndex < questions.length - 1) {
      // Move to the next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setRecordingComplete(false);
      setTimeLeft(questions[currentQuestionIndex + 1].time);
    }
  };

  // Function to navigate to the previous question
  const handlePreviousQuestion = () => {
    if (isRecording) {
      // Stop any ongoing recording
      handleStopRecording();
      setRecordedChunks([]);
    }
    if (currentQuestionIndex > 0) {
      // Move to the previous question
      setCurrentQuestionIndex((prev) => prev - 1);
      setRecordingComplete(false);
      setTimeLeft(questions[currentQuestionIndex - 1].time);
    }
  };

  // Function to submit all responses
  const handleSubmit = () => {
    // In a real application, you would send all responses to your server here
    console.log("Submitting all responses:", responses);
    // You might want to reset the state or navigate to a new page after submission
  };

  // Check if all questions have been answered
  const allQuestionsAnswered = responses.every((response) => response !== null);

  // Render the component's UI
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
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              size="sm"
              variant="outline"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <span className="text-lg font-semibold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              size="sm"
              variant="outline"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Question Display */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Question:
            </h2>
            <p className="text-lg sm:text-xl">
              {questions[currentQuestionIndex].text}
            </p>
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
            {/* Timer */}
            <div className="text-xl sm:text-2xl font-semibold">
              Time Left: {timeLeft}s
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap justify-center sm:justify-end space-x-2 space-y-2 sm:space-y-0">
              {/* Show Start Recording button */}
              {!isRecording &&
                !recordingComplete &&
                !responses[currentQuestionIndex] && (
                  <Button
                    onClick={handleStartRecording}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Start Recording
                  </Button>
                )}

              {/* Show Stop Recording button */}
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

              {/* Show Record Again and Save Response buttons */}
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

              {/* Show Retake button if response is saved */}
              {responses[currentQuestionIndex] && (
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

          {/* Response Saved Message */}
          {responses[currentQuestionIndex] && (
            <div className="text-center text-green-600">
              Response saved for Question {currentQuestionIndex + 1}
            </div>
          )}

          {/* Submit All Responses Button */}
          {allQuestionsAnswered && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="w-full sm:w-auto"
              >
                Submit All Responses
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RecordingPageComponent;
