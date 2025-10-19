"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string | null;
}

interface WarmupQuizProps {
  questions: Question[];
  onComplete: () => void;
}

export function WarmupQuiz({ questions, onComplete }: WarmupQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestion.id];

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleComplete = () => {
    setQuizCompleted(true);
    onComplete();
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
  };

  const getScore = () => {
    return questions.reduce((score, question) => {
      return score + (answers[question.id] === question.correctIndex ? 1 : 0);
    }, 0);
  };

  if (quizCompleted) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl text-primary flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Chúc mừng!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Bạn đã hoàn thành câu hỏi warm-up cho chương này.
          </p>
          <Button onClick={handleRestart} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Làm lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = getScore();
    const total = questions.length;

    return (
      <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl text-primary">
            Kết quả Warm-up
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-4xl font-bold text-accent mb-2">
              {score} / {total}
            </p>
            <p className="text-lg text-muted-foreground">
              Bạn đã trả lời đúng {score} trên {total} câu hỏi.
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctIndex;
              const correctOption = question.options[question.correctIndex];
              const userOption = question.options[userAnswer];

              return (
                <div
                  key={question.id}
                  className="p-4 bg-background/50 rounded-lg"
                >
                  <p className="font-semibold mb-2">{question.question}</p>
                  {isCorrect ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Đúng: {correctOption}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Bạn chọn: {userOption || "Chưa trả lời"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Đáp án đúng: {correctOption}
                        </span>
                      </div>
                    </div>
                  )}
                  {question.explanation && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {question.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleRestart}
              variant="outline"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Làm lại
            </Button>
            <Button onClick={handleComplete} className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Đánh dấu hoàn thành
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">
          Câu hỏi Warm-up
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Câu {currentQuestionIndex + 1} trên {questions.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-semibold">{currentQuestion.question}</p>

        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => handleAnswerSelect(parseInt(value))}
        >
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Label
                key={index}
                className={cn(
                  "flex items-center p-4 rounded-lg border transition-all cursor-pointer",
                  selectedAnswer === index
                    ? "bg-accent/20 border-accent"
                    : "bg-background/50 hover:bg-accent/10"
                )}
              >
                <RadioGroupItem value={index.toString()} className="mr-4" />
                <span>{option}</span>
              </Label>
            ))}
          </div>
        </RadioGroup>

        <Button
          onClick={handleNext}
          disabled={selectedAnswer === undefined}
          className="w-full"
        >
          {currentQuestionIndex === questions.length - 1
            ? "Xem kết quả"
            : "Câu tiếp theo"}
        </Button>
      </CardContent>
    </Card>
  );
}

