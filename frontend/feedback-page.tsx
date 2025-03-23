import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Clock, Mic, Video } from "lucide-react"

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState({
    transcription:
      "So tell me about your proudest achievement. So my proudest achievement to this day would definitely be my GCC results. So just a bit of context, I moved into the country, UK, at the age of 14 in the middle of year 10. At the time, I didn't really speak English, so it was really hard for me to integrate into a new society with completely different culture and people. Secondly, it was also really hard for me to make friends and also thrive academically. And there was added pressure because there was a GCC exam that I needed to do in just in one year. At the time, both my parents and my teachers suggested me to retake year 10 for better GCC grades in the future. However, I didn't want to do that, just because it seemed to me like a waste of a year. Instead, I worked extremely hard. I remember coming back from school every single day and revising for three, four hours on top. I also went out of my comfort zone. So one of my goals was to speak to one person a day, and that really helped me build my confidence, but also learn English in a rapid pace. And doing all this hard work and getting off my comfort zone, I managed to do really well in my GCSEs. Not only that, I also learned English really fast and also made lifelong friends. And I'm really, really proud of that. And to this day, it gives me confidence that if you put hard work and get out of your comfort zone, you can achieve your dreams.",
    modelFeatures: {
      Words_Per_Second: 2.786944623309723,
      Pause_Frequency: 10.830324909747292,
      Avg_Pause_Duration: 0.557866666666667,
      Medium_Pauses: 0,
      Long_Pauses: 0,
      Response_Duration: 99.392,
    },
    Feedback: {
      content:
        '```json\n{\n    "overall_classification_score": 3,\n    "overall_classification": "Good",\n    "scores": {\n        "Relevance": 4,\n        "Structure": 3,\n        "Fluency": 3,\n        "Depth of Insight": 3,\n        "Conciseness": 2,\n        "Delivery Impact": 3,\n        "Confidence & Authenticity": 4\n    },\n    "explanations": {\n        "Relevance": "The response directly pertains to the question about the proudest achievement, providing a clear answer with a personal experience.",\n        "Structure": "The response follows a somewhat logical flow but lacks a clearer separation of the Situation, Task, Action, and Result elements, which could enhance clarity.",\n        "Fluency": "The response is generally clear, but some sentences are long and can be improved for better readability. There are minor grammatical issues.",\n        "Depth of Insight": "The response demonstrates personal growth and resilience, but could benefit from deeper reflection on the impact of this achievement on current skills or future aspirations.",\n        "Conciseness": "The response includes some repetitive elements and could be more succinct while still conveying the essence of the story.",\n        "Delivery Impact": "The emotional resonance of the story and the personal connection make it engaging, but a few moments of clearer articulation could increase its impact.",\n        "Confidence & Authenticity": "The speaker comes across as genuine and confident in sharing their experience, which adds to the strength of the narrative."\n    },\n    "improvement_feedback": "To enhance the response, consider refining the structure by clearly delineating the elements of the STAR method. Additionally, try to make sentences more concise and direct to maintain engagement. Reflecting on how this achievement impacts your current role or aspirations could deepen insights.",\n    "rewritten_response": "My proudest achievement is my performance in my GCSE exams, which I sat for just a year after moving to the UK at age 14. Initially, I faced significant challenges, including a language barrier and cultural adjustment. Rather than taking the suggested route of retaking year 10, I decided to push myself; I committed to studying for three to four hours daily after school. Furthermore, I set a personal goal to speak to one new person each day to build my English skills and confidence. This hard work paid off—I not only excelled in my GCSEs but also learned English rapidly and forged lasting friendships. This experience taught me that hard work and stepping outside my comfort zone can lead to achieving dreams, instilling a confidence in me that I carry into every challenge I face today."\n}\n```',
      refusal: null,
      role: "assistant",
      audio: null,
      function_call: null,
      tool_calls: null,
    },
    "Body Predictions": [1],
    "Body Features": {
      Duration: 100.43330017683466,
      positive: 0.00865051903114187,
      hand_count: 0.07957559681697612,
      hand_movement: 0.07176232039451073,
    },
    "Audio Predictions": [2],
  })

  const [parsedFeedback, setParsedFeedback] = useState({
    overall_classification_score: 0,
    overall_classification: "",
    scores: {},
    explanations: {},
    improvement_feedback: "",
    rewritten_response: "",
  })

  useEffect(() => {
    try {
      // Extract JSON from the content string (it's wrapped in \`\`\`json ... \`\`\`)
      const jsonContent = feedback.Feedback.content.replace(/```json\n|\n```/g, "")
      const parsed = JSON.parse(jsonContent)
      setParsedFeedback(parsed)
    } catch (error) {
      console.error("Error parsing feedback JSON:", error)
    }
  }, [feedback])

  // Calculate total score and max possible score
  const totalScore = Object.values(parsedFeedback.scores).reduce((a: number, b: number) => a + b, 0)
  const maxPossibleScore = Object.keys(parsedFeedback.scores).length * 4
  const overallPercentage = (totalScore / maxPossibleScore) * 100

  // Map body and audio predictions to meaningful labels
  const bodyPredictionLabels = {
    1: "Positive Body Language",
    2: "Neutral Body Language",
    3: "Negative Body Language",
  }

  const audioPredictionLabels = {
    1: "Excellent Audio Delivery",
    2: "Good Audio Delivery",
    3: "Needs Improvement",
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Interview Feedback</h1>

      {/* Summary Card */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Overall Performance</CardTitle>
          <CardDescription>
            {parsedFeedback.overall_classification} ({parsedFeedback.overall_classification_score}/4)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Score</span>
                <span className="text-sm font-medium">
                  {totalScore}/{maxPossibleScore}
                </span>
              </div>
              <Progress value={overallPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-2xl font-bold">{feedback.modelFeatures.Response_Duration.toFixed(0)}s</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Body Language</p>
                  <p className="text-lg font-medium">{bodyPredictionLabels[feedback["Body Predictions"][0]]}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Audio Delivery</p>
                  <p className="text-lg font-medium">{audioPredictionLabels[feedback["Audio Predictions"][0]]}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="feedback" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
          <TabsTrigger value="transcription">Transcription</TabsTrigger>
          <TabsTrigger value="speech">Speech Analysis</TabsTrigger>
          <TabsTrigger value="body">Body Language</TabsTrigger>
        </TabsList>

        {/* Detailed Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Detailed scores for each evaluation metric</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(parsedFeedback.scores).map(([metric, score]) => (
                  <div key={metric} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{metric}</span>
                      <span>{score}/4</span>
                    </div>
                    <Progress value={(Number(score) / 4) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground">{parsedFeedback.explanations[metric]}</p>
                  </div>
                ))}
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
                  <p className="whitespace-pre-line">{parsedFeedback.rewritten_response}</p>
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
              <CardDescription>Transcription of your interview answer</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <p className="whitespace-pre-line">{feedback.transcription}</p>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Speech Analysis Tab */}
        <TabsContent value="speech">
          <Card>
            <CardHeader>
              <CardTitle>Speech Metrics</CardTitle>
              <CardDescription>Analysis of your speaking patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-1">
                      WPS
                    </Badge>
                    <span className="font-medium">Words Per Second</span>
                  </div>
                  <p className="text-2xl font-bold">{feedback.modelFeatures.Words_Per_Second.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {feedback.modelFeatures.Words_Per_Second > 2.5
                      ? "Your speaking pace is slightly fast. Consider slowing down for clarity."
                      : "Your speaking pace is good, clear and understandable."}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-1">
                      PF
                    </Badge>
                    <span className="font-medium">Pause Frequency</span>
                  </div>
                  <p className="text-2xl font-bold">{feedback.modelFeatures.Pause_Frequency.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    Pauses per minute in your speech. Strategic pauses can emphasize important points.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-1">
                      APD
                    </Badge>
                    <span className="font-medium">Average Pause Duration</span>
                  </div>
                  <p className="text-2xl font-bold">{feedback.modelFeatures.Avg_Pause_Duration.toFixed(2)}s</p>
                  <p className="text-sm text-muted-foreground">
                    Your pauses are of appropriate length, not too long to create awkward silences.
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Medium/Long Pauses</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {feedback.modelFeatures.Medium_Pauses + feedback.modelFeatures.Long_Pauses}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You had minimal extended pauses, which suggests good preparation and fluency.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Response Duration</span>
                  </div>
                  <p className="text-2xl font-bold">{feedback.modelFeatures.Response_Duration.toFixed(0)} seconds</p>
                  <p className="text-sm text-muted-foreground">
                    {feedback.modelFeatures.Response_Duration > 90
                      ? "Your response is comprehensive but slightly long. Aim for 60-90 seconds for most interview questions."
                      : "Your response is of appropriate length for an interview answer."}
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
              <CardDescription>Assessment of your non-verbal communication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Overall Body Language</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`px-3 py-1 ${
                          feedback["Body Predictions"][0] === 1
                            ? "bg-green-100 text-green-800"
                            : feedback["Body Predictions"][0] === 2
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bodyPredictionLabels[feedback["Body Predictions"][0]]}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Positivity Score</h3>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Confidence & Engagement</span>
                      <span className="text-sm font-medium">
                        {(feedback["Body Features"].positive * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={feedback["Body Features"].positive * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {feedback["Body Features"].positive > 0.7
                        ? "You displayed confident and positive body language throughout your response."
                        : feedback["Body Features"].positive > 0.4
                          ? "Your body language was mostly positive with some room for improvement."
                          : "Consider working on displaying more confident and engaged body language."}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Hand Gestures</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Hand Movement Frequency</span>
                          <span className="text-sm font-medium">
                            {(feedback["Body Features"].hand_count * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={feedback["Body Features"].hand_count * 100} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Hand Movement Intensity</span>
                          <span className="text-sm font-medium">
                            {(feedback["Body Features"].hand_movement * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={feedback["Body Features"].hand_movement * 100} className="h-2" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {feedback["Body Features"].hand_count < 0.1
                        ? "You used minimal hand gestures. Consider incorporating more hand movements to emphasize key points."
                        : feedback["Body Features"].hand_count > 0.3
                          ? "You used a good amount of hand gestures to support your communication."
                          : "Your hand gesture frequency is appropriate, neither too much nor too little."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

