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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Plus, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  isPublished: boolean;
  order: number;
  chapters: Array<{
    id: string;
    title: string;
    order: number;
  }>;
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { courseId } = params;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverUrl: "",
    isPublished: false,
  });

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`);
      if (response.ok) {
        const courseData = await response.json();
        console.log("Loaded course data:", courseData);
        console.log("Chapters:", courseData.chapters);
        setCourse(courseData);
        setFormData({
          title: courseData.title,
          description: courseData.description || "",
          coverUrl: courseData.coverUrl || "",
          isPublished: courseData.isPublished,
        });
      }
    } catch (error) {
      console.error("Error loading course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề khóa học",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật khóa học",
        });
        await loadCourse();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật khóa học. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteCourse = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa khóa học này? Hành động này không thể hoàn tác."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Đã xóa khóa học",
        });
        router.push("/admin");
      } else {
        throw new Error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa khóa học. Vui lòng thử lại.",
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
            <p className="text-muted-foreground">Đang tải khóa học...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Không tìm thấy khóa học</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <a href="/admin">Quay lại admin</a>
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
                Chỉnh sửa khóa học
              </h1>
              <p className="text-slate-600">{course.title}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/courses/${courseId}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem
              </Button>
              <Button variant="destructive" onClick={handleDeleteCourse}>
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
                  <CardTitle className="text-xl">Thông tin khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề khóa học *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Nhập tiêu đề khóa học..."
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
                        placeholder="Mô tả chi tiết về khóa học..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverUrl">URL ảnh bìa</Label>
                      <Input
                        id="coverUrl"
                        value={formData.coverUrl}
                        onChange={(e) =>
                          handleInputChange("coverUrl", e.target.value)
                        }
                        placeholder="https://example.com/image.jpg"
                        type="url"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isPublished"
                        checked={formData.isPublished}
                        onCheckedChange={(checked) =>
                          handleInputChange("isPublished", checked)
                        }
                      />
                      <Label htmlFor="isPublished">Xuất bản</Label>
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

            {/* Chapters */}
            <div>
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Chương học ({course.chapters.length})
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/admin/courses/${courseId}/chapters/create`
                        )
                      }
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.chapters.length === 0 ? (
                      <p className="text-center text-slate-500 py-4">
                        Chưa có chương nào
                      </p>
                    ) : (
                      course.chapters.map((chapter, index) => (
                        <div
                          key={chapter.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              Chương {index + 1}
                            </p>
                            <p className="text-xs text-slate-600 truncate">
                              {chapter.title}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                router.push(
                                  `/admin/courses/${courseId}/chapters/${chapter.id}/edit`
                                )
                              }
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
