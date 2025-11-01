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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AIQuestionGenerator } from "@/components/courses/AIQuestionGenerator";

interface Chapter {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string | null;
  order: number;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
}

export default function EditChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { courseId, chapterId } = params;

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    order: 1,
  });

  useEffect(() => {
    if (chapterId) {
      loadChapter();
    }
  }, [chapterId]);

  const loadChapter = async () => {
    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}`
      );
      if (response.ok) {
        const chapterData = await response.json();
        setChapter(chapterData);
        setFormData({
          title: chapterData.title,
          description: chapterData.description || "",
          youtubeUrl: chapterData.youtubeUrl || "",
          order: chapterData.order,
        });
      }
    } catch (error) {
      console.error("Error loading chapter:", error);
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);
    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}`,
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
          description: "Đã cập nhật chương",
        });
        await loadChapter();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update chapter");
      }
    } catch (error) {
      console.error("Error updating chapter:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật chương. Vui lòng thử lại.",
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

  const handleDeleteChapter = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa chương này? Hành động này không thể hoàn tác."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/courses/${courseId}/chapters/${chapterId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa chương",
        });
        router.push(`/admin/courses/${courseId}/edit`);
      } else {
        throw new Error("Failed to delete chapter");
      }
    } catch (error) {
      console.error("Error deleting chapter:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa chương. Vui lòng thử lại.",
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
            <p className="text-muted-foreground">Đang tải chương...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Không tìm thấy chương</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <a href={`/admin/courses/${courseId}/edit`}>Quay lại</a>
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
        <div className="max-w-4xl mx-auto">
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
                Chỉnh sửa chương
              </h1>
              <p className="text-slate-600">{chapter.title}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/courses/${courseId}/chapters/${chapterId}`)
                }
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem
              </Button>
              <Button variant="destructive" onClick={handleDeleteChapter}>
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Thông tin chương</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề chương *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
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
                          handleInputChange(
                            "order",
                            parseInt(e.target.value) || 1
                          )
                        }
                        placeholder="1"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={saving}
                      className="w-full bg-[#44392d] hover:bg-[#5a4a3a] text-white"
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
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Questions */}
            <div>
              <Card className="shadow-xl border-2 border-amber-200 vintage-card">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <CardTitle className="text-lg text-amber-900 font-headline">
                      📝 Câu hỏi Warm-up ({chapter.questions.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <AIQuestionGenerator
                        courseId={courseId as string}
                        chapterId={chapterId as string}
                        chapterTitle={chapter.title}
                        onQuestionsGenerated={loadChapter}
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/admin/courses/${courseId}/chapters/${chapterId}/questions/create`
                          )
                        }
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm thủ công
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {chapter.questions.length === 0 ? (
                      <p className="text-center text-slate-500 py-4">
                        Chưa có câu hỏi nào
                      </p>
                    ) : (
                      chapter.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="flex items-start justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="font-medium text-sm text-slate-800">
                              Câu {index + 1}
                            </p>
                            <p className="text-xs text-slate-600 break-words line-clamp-2">
                              {question.question}
                            </p>
                            {question.explanation && (
                              <p className="text-xs text-blue-600 mt-1 line-clamp-1">
                                💡 {question.explanation}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                router.push(
                                  `/admin/courses/${courseId}/chapters/${chapterId}/questions/${question.id}/edit`
                                )
                              }
                              className="hover:bg-blue-100"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
