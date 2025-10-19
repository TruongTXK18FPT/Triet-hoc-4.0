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
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
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
                      handleInputChange("order", parseInt(e.target.value) || 1)
                    }
                    placeholder="1"
                  />
                </div>

                {/* Questions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">
                      Câu hỏi Warm-up
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addQuestion}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm câu hỏi
                    </Button>
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
