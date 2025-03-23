import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoUpload } from "@/components/random/video-upload";
import { VideoRecord } from "@/components/random/video_record";
import { useLocation } from "react-router-dom";

export default function Home() {
  // Use the location hook to read query parameters from the URL.
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Get the 'question' and 'time' query parameters.
  const questionText = searchParams.get("question");
  const time = Number(searchParams.get("time"));

  // If either the question or time is missing, show an error message.
  if (!questionText || !time) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          Error: Missing "question" or "time" query parameters.
        </h1>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md mx-auto">
        {/* Display the question in the H1 */}
        <h1 className="text-2xl font-bold text-center mb-6">{questionText}</h1>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Video</TabsTrigger>
            <TabsTrigger value="record">Record Video</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div className="p-4 border rounded-lg mt-2">
              <VideoUpload question={questionText} />
            </div>
          </TabsContent>
          <TabsContent value="record">
            <div className="p-4 border rounded-lg mt-2">
              <VideoRecord question={questionText} time={time} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
