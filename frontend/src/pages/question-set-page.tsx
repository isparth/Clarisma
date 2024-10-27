"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, PlayCircle } from "lucide-react";

// This would typically come from a database or API
const questionSet = {
  id: 1,
  name: "Investment Banking Question Pack",
  questions: [
    {
      id: 1,
      text: "Describe a time when you had to work under pressure to meet a deadline.",
    },
    {
      id: 2,
      text: "How would you value a company that has negative earnings?",
    },
    {
      id: 3,
      text: "What are the main differences between commercial and investment banking?",
    },
    {
      id: 4,
      text: "Walk me through the three financial statements and how they are interconnected.",
    },
    {
      id: 5,
      text: "What do you think are the key challenges facing the investment banking industry today?",
    },
  ],
};
function QuestionSetPageComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#171B42]">
            {questionSet.name}
          </h1>
          <Button className="bg-[#171B42] hover:bg-[#2a2f5e] text-white">
            Practice All <PlayCircle className="ml-2" />
          </Button>
        </div>

        <div className="space-y-4">
          {questionSet.questions.map((question, index) => (
            <Card key={question.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">
                      Question {index + 1}
                    </h2>
                    <p className="text-gray-700">{question.text}</p>
                  </div>
                  <Button className="ml-4 bg-[#171B42] hover:bg-[#2a2f5e] text-white">
                    Start <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionSetPageComponent;
