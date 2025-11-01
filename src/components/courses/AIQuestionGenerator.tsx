"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AIQuestionGeneratorProps {
  courseId: string;
  chapterId: string;
  chapterTitle: string;
  onQuestionsGenerated: () => void;
}

interface GeneratedQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
}

export function AIQuestionGenerator({
  courseId,
  chapterId,
  chapterTitle,
  onQuestionsGenerated,
}: AIQuestionGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<
    GeneratedQuestion[]
  >([]);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập chủ đề để tạo câu hỏi",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic || chapterTitle,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();
      setGeneratedQuestions(data.questions || []);

      toast({
        title: "Thành công",
        description: `Đã tạo ${data.questions?.length || 0} câu hỏi bằng AI`,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo câu hỏi. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async (question: GeneratedQuestion, index: number) => {
    setSavingIndex(index);
    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.questionText,
            options: question.options,
            correctIndex: question.correctOptionIndex,
            explanation: "",
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Đã lưu",
          description: "Câu hỏi đã được thêm vào chương",
        });
        
        // Remove saved question from list
        setGeneratedQuestions((prev) =>
          prev.filter((_, i) => i !== index)
        );
        
        onQuestionsGenerated();
      } else {
        throw new Error("Failed to save question");
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu câu hỏi",
        variant: "destructive",
      });
    } finally {
      setSavingIndex(null);
    }
  };

  const handleReset = () => {
    setGeneratedQuestions([]);
    setTopic("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 hover:text-amber-800 shadow-md"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Tạo câu hỏi bằng AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto vintage-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-amber-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            AI Tạo Câu Hỏi Warm-up
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Sử dụng AI để tự động tạo câu hỏi trắc nghiệm cho chương:{" "}
            <span className="font-semibold text-amber-800">{chapterTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Input Section */}
          <div className="space-y-3 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-200">
            <Label htmlFor="topic" className="text-amber-900 font-semibold">
              Chủ đề câu hỏi (tùy chọn)
            </Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={`Ví dụ: Phép biện chứng duy vật của Marx, Lịch sử triết học Mác-Lênin...
              
Để trống sẽ dùng tiêu đề chương: "${chapterTitle}"`}
              rows={4}
              className="border-amber-300 focus:border-amber-500 vintage-input"
              disabled={loading || generatedQuestions.length > 0}
            />
            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={loading || generatedQuestions.length > 0}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    AI đang suy nghĩ...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Tạo 5 câu hỏi
                  </>
                )}
              </Button>
              {generatedQuestions.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-amber-600 text-amber-700"
                >
                  Tạo lại
                </Button>
              )}
            </div>
          </div>

          {/* Generated Questions */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-amber-900">
                  Câu hỏi đã tạo ({generatedQuestions.length})
                </h3>
                <p className="text-sm text-slate-600">
                  Nhấn "Thêm vào chương" để lưu câu hỏi
                </p>
              </div>

              {generatedQuestions.map((q, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-amber-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow vintage-card"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm">
                          {index + 1}
                        </span>
                        <h4 className="font-semibold text-amber-900">
                          {q.questionText}
                        </h4>
                      </div>

                      <div className="space-y-2 ml-10">
                        {q.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center gap-2 p-2 rounded ${
                              optIndex === q.correctOptionIndex
                                ? "bg-green-50 border border-green-300"
                                : "bg-slate-50"
                            }`}
                          >
                            <span className="font-bold text-sm text-slate-700 min-w-[24px]">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="text-sm">{option}</span>
                            {optIndex === q.correctOptionIndex && (
                              <span className="ml-auto text-xs font-semibold text-green-700 bg-green-200 px-2 py-1 rounded">
                                ✓ Đúng
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleSaveQuestion(q, index)}
                      disabled={savingIndex === index}
                      className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                    >
                      {savingIndex === index ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Thêm vào chương
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && generatedQuestions.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-dashed border-amber-300">
              <Sparkles className="w-16 h-16 mx-auto text-amber-400 mb-4" />
              <p className="text-slate-600 text-lg">
                Nhập chủ đề và nhấn <strong>Tạo câu hỏi</strong>
              </p>
              <p className="text-sm text-slate-500 mt-2">
                AI sẽ tạo 5 câu hỏi trắc nghiệm chất lượng cao
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
