"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrosswordQuestion {
  id: string;
  order: number;
  question: string;
  answer: string;
  explanation?: string;
  keywordCharIndex: number;
  keywordColumn: number;
}

interface QuestionPanelProps {
  questions: CrosswordQuestion[];
  answeredQuestions: Set<number>;
  correctAnswers: Set<number>;
  onAnswerSubmit: (questionOrder: number, answer: string) => void;
  selectedQuestion?: number;
  onQuestionSelect: (questionOrder: number) => void;
}

export function QuestionPanel({
  questions,
  answeredQuestions,
  correctAnswers,
  onAnswerSubmit,
  selectedQuestion,
  onQuestionSelect,
}: QuestionPanelProps) {
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleQuestionClick = (questionOrder: number) => {
    onQuestionSelect(questionOrder);
    setCurrentAnswer("");
    setShowModal(true);
  };

  const handleAnswerSubmit = () => {
    if (selectedQuestion && currentAnswer.trim()) {
      onAnswerSubmit(selectedQuestion, currentAnswer.trim());
      setCurrentAnswer("");
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAnswer("");
  };

  const getQuestionStatus = (questionOrder: number) => {
    if (correctAnswers.has(questionOrder)) {
      return "correct";
    } else if (answeredQuestions.has(questionOrder)) {
      return "incorrect";
    }
    return "unanswered";
  };

  return (
    <div className="space-y-4">
      {/* Dải ô compact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-[#44392d] flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Câu hỏi ({correctAnswers.size}/{questions.length})
          </CardTitle>
          <p className="text-sm text-gray-600">
            Click vào số câu hỏi để trả lời
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question) => {
              const status = getQuestionStatus(question.order);
              const isSelected = selectedQuestion === question.order;

              return (
                <button
                  key={question.id}
                  onClick={() => handleQuestionClick(question.order)}
                  className={cn(
                    "w-12 h-12 rounded-lg border-2 font-bold text-sm transition-all duration-200 flex items-center justify-center",
                    {
                      "border-[#44392d] bg-[#44392d] text-white shadow-lg":
                        isSelected,
                      "border-green-500 bg-green-100 text-green-800 hover:bg-green-200":
                        status === "correct",
                      "border-red-500 bg-red-100 text-red-800 hover:bg-red-200":
                        status === "incorrect",
                      "border-gray-300 bg-gray-100 text-gray-600 hover:border-gray-400 hover:bg-gray-200":
                        status === "unanswered",
                    }
                  )}
                >
                  {question.order}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border-2 border-gray-300 bg-gray-100"></div>
              <span>Chưa trả lời</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border-2 border-green-500 bg-green-100"></div>
              <span>Đúng</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded border-2 border-red-500 bg-red-100"></div>
              <span>Sai</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal trả lời */}
      {showModal &&
        selectedQuestion &&
        (() => {
          const currentQuestion = questions.find(
            (q) => q.order === selectedQuestion
          );
          if (!currentQuestion) return null;

          return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg text-[#44392d]">
                    Câu hỏi {selectedQuestion}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseModal}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {currentQuestion.question}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        <span className="font-medium">
                          Đáp án có {currentQuestion.answer.length} chữ cái
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đáp án của bạn:
                    </label>
                    <Input
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Nhập đáp án..."
                      className="mb-3"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAnswerSubmit();
                        }
                      }}
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAnswerSubmit}
                      disabled={!currentAnswer.trim()}
                      className="bg-[#44392d] hover:bg-[#5a4a3a] text-white flex-1"
                    >
                      Kiểm tra
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCloseModal}
                      className="flex-1"
                    >
                      Đóng
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })()}
    </div>
  );
}
