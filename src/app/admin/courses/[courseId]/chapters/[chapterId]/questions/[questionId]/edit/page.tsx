"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export default function EditQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { courseId, chapterId, questionId } = params;

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
  });

  useEffect(() => {
    if (questionId) {
      loadQuestion();
    }
  }, [questionId]);

  const loadQuestion = async () => {
    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}/questions/${questionId}`
      );
      if (response.ok) {
        const questionData = await response.json();
        setQuestion(questionData);
        setFormData({
          question: questionData.question,
          options: questionData.options,
          correctIndex: questionData.correctIndex,
          explanation: questionData.explanation || "",
        });
      }
    } catch (error) {
      console.error("Error loading question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập câu hỏi",
        variant: "destructive",
      });
      return;
    }

    if (formData.options.some((opt) => !opt.trim())) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ 4 đáp án",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}/questions/${questionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật câu hỏi",
        });
        router.push(`/admin/courses/${courseId}/chapters/${chapterId}/edit`);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update question");
      }
    } catch (error) {
      console.error("Error updating question:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật câu hỏi. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
  };

  const handleDeleteQuestion = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa câu hỏi này? Hành động này không thể hoàn tác."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa câu hỏi",
        });
        router.push(`/admin/courses/${courseId}/chapters/${chapterId}/edit`);
      } else {
        throw new Error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa câu hỏi. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44392d] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải câu hỏi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Không tìm thấy câu hỏi</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <a
                  href={`/admin/courses/${courseId}/chapters/${chapterId}/edit`}
                >
                  Quay lại
                </a>
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
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#44392d]">
                Chỉnh sửa câu hỏi
              </h1>
              <p className="text-slate-600">Cập nhật thông tin câu hỏi</p>
            </div>
            <Button variant="destructive" onClick={handleDeleteQuestion}>
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          </div>

          {/* Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Thông tin câu hỏi</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="question">Câu hỏi *</Label>
                  <Input
                    id="question"
                    value={formData.question}
                    onChange={(e) =>
                      handleInputChange("question", e.target.value)
                    }
                    placeholder="Nhập câu hỏi..."
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Các đáp án *</Label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex items-center gap-2 min-w-[60px]">
                        <input
                          type="radio"
                          name="correctIndex"
                          checked={formData.correctIndex === index}
                          onChange={() =>
                            handleInputChange("correctIndex", index)
                          }
                          className="w-4 h-4"
                        />
                        <Label className="text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </Label>
                      </div>
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Đáp án ${String.fromCharCode(
                          65 + index
                        )}...`}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="explanation">Giải thích (tùy chọn)</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) =>
                      handleInputChange("explanation", e.target.value)
                    }
                    placeholder="Nhập giải thích cho câu trả lời đúng..."
                    rows={3}
                  />
                  <p className="text-xs text-slate-500">
                    Giải thích sẽ hiển thị khi người dùng trả lời đúng
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Đánh dấu radio button để chọn đáp án
                    đúng.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-[#44392d] hover:bg-[#5a4a3a] text-white"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={saving}
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
