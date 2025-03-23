"use client";

import { Button } from "@/components/ui/button";
import { Video, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoRecordProps {
  question: string;
  time: number;
}

export function VideoRecord({ question, time }: VideoRecordProps) {
  const navigate = useNavigate();

  // When the user clicks the button, navigate to the recording page
  // and pass the question and time as query parameters.
  const handleStartRecording = () => {
    const queryString = `?question=${encodeURIComponent(
      question
    )}&time=${time}`;
    navigate(`/recording${queryString}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
        <Video className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="font-medium">Record a new video</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          You will be redirected to the recording page
          <br />
          <span className="text-xs">(Max 2 minutes)</span>
        </p>
        <Button onClick={handleStartRecording} className="mt-2">
          Start Recording
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
