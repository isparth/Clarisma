// QuestionSetPageComponent.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// This would typically come from a database or API
const questionSet = {
  id: 1,
  name: "Investment Banking Question Pack",
  questions: [
    {
      id: 1,
      text: "Describe a time when you had to work under pressure to meet a deadline.",
      time: 90,
    },
    {
      id: 2,
      text: " Tell me about yourself ?",
      time: 120,
    },
    {
      id: 3,
      text: "Tell me about a time when you missed an important deadline?",
      time: 120,
    },
    {
      id: 4,
      text: "Tell me about a time that you worked well in a team ?",
      time: 120,
    },
    {
      id: 5,
      text: "Tell me about your proudest acheivement?",
      time: 120,
    },
  ],
};

function QuestionSetPageComponent() {
  const navigate = useNavigate();

  // Redirect to Home page with query parameters for question and time
  const handleStart = (question: { id?: number; text: any; time: any }) => {
    navigate(
      `/choice?question=${encodeURIComponent(
        question.text
      )}&time=${encodeURIComponent(question.time)}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#171B42]">
            {questionSet.name}
          </h1>
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
                  <Button
                    onClick={() => handleStart(question)}
                    className="ml-4 bg-[#171B42] hover:bg-[#2a2f5e] text-white"
                  >
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
