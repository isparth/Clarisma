"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Clock, Mic, Video } from "lucide-react";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<any>(null);
  const [parsedFeedback, setParsedFeedback] = useState({
    overall_classification_score: 0,
    overall_classification: "",
    scores: {} as Record<string, number>,
    explanations: {} as Record<string, string>,
    improvement_feedback: "",
    rewritten_response: "",
  });

  // Always run hooks regardless of feedback value
  useEffect(() => {
    const data = localStorage.getItem("feedbackData");
    if (data) {
      setFeedback(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (feedback?.Feedback?.content) {
      try {
        const parsed = JSON.parse(feedback.Feedback.content);
        setParsedFeedback({
          ...parsed,
          overall_classification:
            parsed.overall_classification ||
            getClassificationLabel(parsed.overall_classification_score),
        });
      } catch (error) {
        console.error("Error parsing feedback JSON:", error);
      }
    }
  }, [feedback]);

  // Helper functions (declared before conditional rendering)
  const getClassificationLabel = (score: number) => {
    switch (score) {
      case 1:
        return "Bad";
      case 2:
        return "Needs Improvement";
      case 3:
        return "Good";
      case 4:
        return "Excellent";
      default:
        return "Not Rated";
    }
  };

  const getScoreColor = (score: number) => {
    switch (score) {
      case 1:
        return "bg-red-100 text-red-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 3:
        return "bg-green-100 text-green-800";
      case 4:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate total score and overall percentage
  let totalScore = 0;
  for (const score of Object.values(parsedFeedback.scores)) {
    totalScore += Number(score);
  }

  let totalAverage = totalScore / 5;

  // Render UI - use a conditional inside the JSX
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Interview Feedback</h1>
      {!feedback ? (
        <div className="p-6">Loading feedback...</div>
      ) : (
        <>
          {/* Summary Card */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">
                      {4 * totalAverage +
                        4 * feedback["Audio Predictions"][0] +
                        2 * feedback["Body Predictions"][0]}
                      /{40}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Content</p>
                      <p className="text-lg font-medium">
                        <Badge
                          className={`px-3 py-1 ${getScoreColor(
                            parsedFeedback.overall_classification_score
                          )}`}
                        >
                          {parsedFeedback.overall_classification}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Body Language</p>
                      <p className="text-lg font-medium">
                        <Badge
                          className={`${getScoreColor(
                            feedback["Body Predictions"][0]
                          )}`}
                        >
                          {getClassificationLabel(
                            feedback["Body Predictions"][0]
                          )}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Audio Delivery</p>
                      <p className="text-lg font-medium">
                        <Badge
                          className={`${getScoreColor(
                            feedback["Audio Predictions"][0]
                          )}`}
                        >
                          {getClassificationLabel(
                            feedback["Audio Predictions"][0]
                          )}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="feedback" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="feedback">Content Analysis</TabsTrigger>
              <TabsTrigger value="transcription">Transcription</TabsTrigger>
              <TabsTrigger value="speech">Speech Analysis</TabsTrigger>
              <TabsTrigger value="body">Body Language</TabsTrigger>
            </TabsList>

            {/* Detailed Feedback Tab */}
            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Detailed scores for each evaluation metric
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(parsedFeedback.scores).map(
                      ([metric, score]) => (
                        <div key={metric} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{metric}</span>
                            <Badge
                              className={`${getScoreColor(Number(score))}`}
                            >
                              {score}/4 -{" "}
                              {getClassificationLabel(Number(score))}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {parsedFeedback.explanations[metric]}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{parsedFeedback.improvement_feedback}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Improved Response Example</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] pr-4">
                      <p className="whitespace-pre-line">
                        {parsedFeedback.rewritten_response}
                      </p>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Transcription Tab */}
            <TabsContent value="transcription">
              <Card>
                <CardHeader>
                  <CardTitle>Your Response</CardTitle>
                  <CardDescription>
                    Transcription of your interview answer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <p className="whitespace-pre-line">
                      {feedback.transcription}
                    </p>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Speech Analysis Tab */}
            <TabsContent value="speech">
              <Card>
                <CardHeader>
                  <CardTitle>Speech Metrics</CardTitle>
                  <CardDescription>
                    Analysis of your speaking patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-2 py-1">
                          WPS
                        </Badge>
                        <span className="font-medium">Words Per Second</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {feedback.modelFeatures.Words_Per_Second.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {feedback.modelFeatures.Words_Per_Second < 2.8
                          ? "Your speaking pace is slow. Speak faster. Ideal range is 2.8 to 3.1."
                          : feedback.modelFeatures.Words_Per_Second > 3.1
                          ? "Your speaking pace is fast. Speak slower. Ideal range is 2.8 to 3.1."
                          : "Your speaking pace is optimal. Ideal range is 2.8 to 3.1."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-2 py-1">
                          PF
                        </Badge>
                        <span className="font-medium">Pause Frequency</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {feedback.modelFeatures.Pause_Frequency.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pauses per minute in your speech.
                        {feedback.modelFeatures.Pause_Frequency.toFixed(2) >
                        10.5
                          ? "Your pauses are frequent which shows sign of nervousness."
                          : "Duration is ideal."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-2 py-1">
                          APD
                        </Badge>
                        <span className="font-medium">
                          Average Pause Duration
                        </span>
                      </div>
                      <p className="text-2xl font-bold">
                        {feedback.modelFeatures.Avg_Pause_Duration.toFixed(2)}s
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {feedback.modelFeatures.Avg_Pause_Duration < 0.3
                          ? "You are taking short pauses. This might make the response sound rushed."
                          : feedback.modelFeatures.Avg_Pause_Duration > 0.7
                          ? "You are taking long pauses. This might make your response sound not engaging."
                          : "Duration is ideal."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-2 py-1">
                          Dur
                        </Badge>
                        <span className="font-medium">Duration</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {feedback.modelFeatures.Response_Duration}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {feedback.modelFeatures.Response_Duration < 60
                          ? "Your Speech Duration is short aim for minimum of 60s ideally 90 to 120 seconds."
                          : "Duration is ideal."}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-2 py-1">
                          MP
                        </Badge>
                        <span className="font-medium">Medium Pauses</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {feedback.modelFeatures.Medium_Pauses}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {feedback.modelFeatures.Medium_Pauses >= 2
                          ? "Your are taking long pauses try to have less than 2 medium Pauses"
                          : "You have very few medium pauses, with suggests high confidence "}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-2 py-1">
                          LP
                        </Badge>
                        <span className="font-medium">Long Pauses</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {feedback.modelFeatures.Long_Pauses}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <p className="text-sm text-muted-foreground">
                          {feedback.modelFeatures.Long_Pauses >= 2
                            ? "Your are taking long pauses try to have less than 2 medium Pauses"
                            : "You have very few Long pauses, with suggests high confidence "}
                        </p>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Body Language Tab */}
            <TabsContent value="body">
              <Card>
                <CardHeader>
                  <CardTitle>Body Language Analysis</CardTitle>
                  <CardDescription>
                    Assessment of your non-verbal communication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Overall Body Language
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`px-3 py-1 ${getScoreColor(
                              feedback["Body Predictions"][0]
                            )}`}
                          >
                            {getClassificationLabel(
                              feedback["Body Predictions"][0]
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {feedback["Body Predictions"][0] === 1
                            ? "Your body language needs significant improvement. To improve display more positive emotions and move your hands."
                            : feedback["Body Predictions"][0] === 2
                            ? "Your body language could be more engaging. To improve display more positive emotions and move your hands"
                            : feedback["Body Predictions"][0] === 3
                            ? "Your body language is good."
                            : "Your body language is excellent."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
