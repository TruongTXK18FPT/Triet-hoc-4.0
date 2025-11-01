"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, X, Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { courseId } = params;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    order: 1,
  });

  const [questions, setQuestions] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề chương",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Tạo chapter trước
      const chapterResponse = await fetch(
        `/api/admin/courses/${courseId}/chapters`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!chapterResponse.ok) {
        const error = await chapterResponse.json();
        throw new Error(error.error || "Failed to create chapter");
      }

      const chapter = await chapterResponse.json();
      console.log("Created chapter:", chapter);

      // Tạo questions nếu có
      const validQuestions = questions.filter(
        (q) => q.question.trim() && q.options.every((opt) => opt.trim())
      );

      if (validQuestions.length > 0) {
        for (const question of validQuestions) {
          const questionResponse = await fetch(
            `/api/admin/courses/${courseId}/chapters/${chapter.id}/questions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(question),
            }
          );

          if (!questionResponse.ok) {
            console.error("Failed to create question:", question);
          }
        }
      }

      toast({
        title: "Thành công",
        description: `Đã tạo chương mới${
          validQuestions.length > 0
            ? ` với ${validQuestions.length} câu hỏi`
            : ""
        }`,
      });
      router.push(`/admin/courses/${courseId}/edit`);
    } catch (error) {
      console.error("Error creating chapter:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo chương. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctIndex: 0,
        explanation: "",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // AI Question Generator state
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const handleAIGenerate = async () => {
    const topic = aiTopic.trim() || formData.title || "Chủ đề triết học Mác-Lênin";
    
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const data = await response.json();
      const formattedQuestions = (data.questions || []).map((q: any) => ({
        question: q.questionText,
        options: q.options,
        correctIndex: q.correctOptionIndex,
        explanation: "",
      }));
      
      setGeneratedQuestions(formattedQuestions);
      toast({
        title: "Thành công",
        description: `Đã tạo ${formattedQuestions.length} câu hỏi bằng AI`,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo câu hỏi. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddGeneratedQuestion = (question: any, index: number) => {
    setQuestions((prev) => [...prev, question]);
    setGeneratedQuestions((prev) => prev.filter((_, i) => i !== index));
    toast({
      title: "Đã thêm",
      description: "Câu hỏi đã được thêm vào form",
    });
  };

  const handleAddAllGeneratedQuestions = () => {
    setQuestions((prev) => [...prev, ...generatedQuestions]);
    setGeneratedQuestions([]);
    toast({
      title: "Đã thêm tất cả",
      description: `Đã thêm ${generatedQuestions.length} câu hỏi vào form`,
    });
  };

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Không có quyền truy cập</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <a href="/">Về trang chủ</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#44392d]">
                Tạo chương mới
              </h1>
              <p className="text-slate-600">Thêm chương học vào khóa học</p>
            </div>
          </div>

          {/* Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Thông tin chương học</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề chương *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Nhập tiêu đề chương..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Mô tả chi tiết về chương học..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtubeUrl">URL Video YouTube</Label>
                  <Input
                    id="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={(e) =>
                      handleInputChange("youtubeUrl", e.target.value)
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    type="url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Thứ tự chương</Label>
                  <Input
                    id="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) =>
                      handleInputChange("order", Number.parseInt(e.target.value) || 1)
                    }
                    placeholder="1"
                  />
                </div>

                {/* Questions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <Label className="text-lg font-semibold">
                      Câu hỏi Warm-up
                    </Label>
                    <div className="flex gap-2">
                      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-2 border-amber-600 text-amber-700 hover:bg-amber-50"
                          >
                            <Sparkles className="w-4 h-4" />
                            Tạo bằng AI
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-headline text-amber-900 flex items-center gap-2">
                              <Sparkles className="w-5 h-5" />
                              AI Tạo Câu Hỏi Warm-up
                            </DialogTitle>
                            <DialogDescription>
                              Sử dụng AI để tự động tạo câu hỏi trắc nghiệm cho chương này
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6 py-4">
                            <div className="space-y-3 bg-amber-50/50 p-4 rounded-lg border-2 border-amber-200">
                              <Label htmlFor="ai-topic" className="text-amber-900 font-semibold">
                                Chủ đề câu hỏi (tùy chọn)
                              </Label>
                              <Textarea
                                id="ai-topic"
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                placeholder={`Ví dụ: Phép biện chứng duy vật của Marx, Lịch sử triết học Mác-Lênin...
                                
Để trống sẽ dùng tiêu đề chương: "${formData.title || "Chủ đề triết học Mác-Lênin"}"`}
                                rows={4}
                                className="border-amber-300 focus:border-amber-500"
                                disabled={aiLoading || generatedQuestions.length > 0}
                              />
                              <div className="flex gap-3">
                                <Button
                                  onClick={handleAIGenerate}
                                  disabled={aiLoading || generatedQuestions.length > 0}
                                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                                >
                                  {aiLoading ? (
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
                                  <>
                                    <Button
                                      variant="outline"
                                      onClick={handleAddAllGeneratedQuestions}
                                      className="border-green-600 text-green-700 hover:bg-green-50"
                                    >
                                      <Plus className="w-4 h-4 mr-2" />
                                      Thêm tất cả ({generatedQuestions.length})
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setGeneratedQuestions([]);
                                        setAiTopic("");
                                      }}
                                      className="border-amber-600 text-amber-700"
                                    >
                                      Tạo lại
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            {generatedQuestions.length > 0 && (
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-amber-900">
                                  Câu hỏi đã tạo ({generatedQuestions.length})
                                </h3>

                                {generatedQuestions.map((q, index) => (
                                  <div
                                    key={index}
                                    className="bg-white border-2 border-amber-300 rounded-lg p-4 shadow-md"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm">
                                            {index + 1}
                                          </span>
                                          <h4 className="font-semibold text-amber-900">
                                            {q.question}
                                          </h4>
                                        </div>

                                        <div className="space-y-2 ml-10">
                                          {q.options.map((option: string, optIndex: number) => (
                                            <div
                                              key={optIndex}
                                              className={`flex items-center gap-2 p-2 rounded ${
                                                optIndex === q.correctIndex
                                                  ? "bg-green-50 border border-green-300"
                                                  : "bg-slate-50"
                                              }`}
                                            >
                                              <span className="font-bold text-sm text-slate-700 min-w-[24px]">
                                                {String.fromCharCode(65 + optIndex)}.
                                              </span>
                                              <span className="text-sm">{option}</span>
                                              {optIndex === q.correctIndex && (
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
                                        onClick={() => handleAddGeneratedQuestion(q, index)}
                                        className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
                                      >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Thêm
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {!aiLoading && generatedQuestions.length === 0 && (
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
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addQuestion}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm thủ công
                      </Button>
                    </div>
                  </div>

                  {questions.map((question, questionIndex) => (
                    <Card
                      key={questionIndex}
                      className="p-4 border-2 border-dashed border-slate-200"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Câu hỏi {questionIndex + 1}
                          </Label>
                          {questions.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(questionIndex)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`question-${questionIndex}`}>
                            Nội dung câu hỏi
                          </Label>
                          <Input
                            id={`question-${questionIndex}`}
                            value={question.question}
                            onChange={(e) =>
                              handleQuestionChange(
                                questionIndex,
                                "question",
                                e.target.value
                              )
                            }
                            placeholder="Nhập câu hỏi..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Các đáp án</Label>
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-[60px]">
                                <input
                                  type="radio"
                                  name={`correct-${questionIndex}`}
                                  checked={
                                    question.correctIndex === optionIndex
                                  }
                                  onChange={() =>
                                    handleQuestionChange(
                                      questionIndex,
                                      "correctIndex",
                                      optionIndex
                                    )
                                  }
                                  className="w-4 h-4"
                                />
                                <Label className="text-sm font-medium">
                                  {String.fromCharCode(65 + optionIndex)}
                                </Label>
                              </div>
                              <Input
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    questionIndex,
                                    optionIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Đáp án ${String.fromCharCode(
                                  65 + optionIndex
                                )}...`}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`explanation-${questionIndex}`}>
                            Giải thích đáp án
                          </Label>
                          <Textarea
                            id={`explanation-${questionIndex}`}
                            value={question.explanation}
                            onChange={(e) =>
                              handleQuestionChange(
                                questionIndex,
                                "explanation",
                                e.target.value
                              )
                            }
                            placeholder="Giải thích tại sao đáp án này đúng..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}

                  {questions.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <p>Chưa có câu hỏi nào</p>
                      <p className="text-sm">Click "Thêm câu hỏi" để bắt đầu</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#44392d] hover:bg-[#5a4a3a] text-white"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Tạo chương
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
