"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Shuffle } from "lucide-react";

interface QuestionPack {
  id: number;
  name: string;
  category: string;
  type: string;
}

const questionPacks: QuestionPack[] = [
  {
    id: 1,
    name: "Investment Banking Question Pack",
    category: "IB",
    type: "Competency",
  },
  {
    id: 2,
    name: "Sales and Trading Technical Pack",
    category: "ST",
    type: "Technical",
  },
  {
    id: 3,
    name: "Asset Management Brainteasers",
    category: "AM",
    type: "Brainteaser",
  },
  {
    id: 4,
    name: "IB Technical Interview Prep",
    category: "IB",
    type: "Technical",
  },
  {
    id: 5,
    name: "S&T Competency Questions",
    category: "ST",
    type: "Competency",
  },
  {
    id: 6,
    name: "Asset Management Case Studies",
    category: "AM",
    type: "Technical",
  },
];

const QuestionsPageComponent: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPacks = useMemo(() => {
    return questionPacks.filter(
      (pack) =>
        (selectedType === "all" || selectedType === pack.type) &&
        (selectedCategory === "all" || selectedCategory === pack.category)
    );
  }, [selectedType, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <h1 className="text-3xl font-bold text-[#171B42] mb-6">
        Practice Questions
      </h1>

      {/* Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div className="w-full sm:w-48">
          <Label
            htmlFor="category"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Category
          </Label>
          <Select onValueChange={(value: string) => setSelectedCategory(value)}>
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="IB">Investment Banking</SelectItem>
              <SelectItem value="ST">Sales and Trading</SelectItem>
              <SelectItem value="AM">Asset Management</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Question Type Filter */}
        <div className="w-full sm:w-48">
          <Label
            htmlFor="type"
            className="text-sm font-medium text-gray-700 mb-1 block"
          >
            Question Type
          </Label>
          <Select onValueChange={(value: string) => setSelectedType(value)}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Competency">Competency</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Brainteaser">Brainteaser</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Question Packs */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Random Practice Card */}
        <Card className="bg-[#171B42] text-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Shuffle className="mr-2" /> Random Practice
            </h2>
            <p className="mb-4">
              Practice with a mix of questions from all categories and types.
            </p>
            <Button variant="secondary" className="w-full">
              Start Random Practice <ArrowRight className="ml-2" />
            </Button>
          </CardContent>
        </Card>
        {/* Filtered Question Packs */}
        {filteredPacks.map((pack: QuestionPack) => (
          <Card key={pack.id}>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">{pack.name}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {pack.category === "IB"
                  ? "Investment Banking"
                  : pack.category === "ST"
                  ? "Sales and Trading"
                  : "Asset Management"}
                {" • "}
                {pack.type}
              </p>
              <Button className="w-full bg-[#171B42] hover:bg-[#2a2f5e] text-white">
                Start Practice <ArrowRight className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuestionsPageComponent;
