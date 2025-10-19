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

export default function CreateQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { courseId, chapterId } = params;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
  });

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

    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Đã tạo câu hỏi mới",
        });
        router.push(`/admin/courses/${courseId}/chapters/${chapterId}/edit`);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to create question");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo câu hỏi. Vui lòng thử lại.",
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

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
    }));
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
                Tạo câu hỏi mới
              </h1>
              <p className="text-slate-600">Thêm câu hỏi warm-up cho chương</p>
            </div>
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
                        Tạo câu hỏi
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
