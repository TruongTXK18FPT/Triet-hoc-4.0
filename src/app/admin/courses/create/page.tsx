"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CreateCoursePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverUrl: "",
    isPublished: false,
  });
  const [uploading, setUploading] = useState(false);

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

    setLoading(true);
    try {
      const response = await fetch("/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const course = await response.json();
        toast({
          title: "Thành công",
          description: "Đã tạo khóa học mới",
        });
        router.push(`/admin/courses/${course.id}/edit`);
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to create course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo khóa học. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        setFormData((prev) => ({
          ...prev,
          coverUrl: url,
        }));
        toast({
          title: "Thành công",
          description: "Đã tải lên ảnh bìa",
        });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải lên ảnh. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
                Tạo khóa học mới
              </h1>
              <p className="text-slate-600">Thêm khóa học mới vào hệ thống</p>
            </div>
          </div>

          {/* Form */}
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
                    onChange={(e) => handleInputChange("title", e.target.value)}
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
                  <Label htmlFor="coverUrl">Ảnh bìa khóa học</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={uploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                        disabled={uploading}
                        className="flex items-center gap-2"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                            Đang tải...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Tải lên ảnh
                          </>
                        )}
                      </Button>
                      <span className="text-sm text-slate-500">
                        Hoặc nhập URL trực tiếp
                      </span>
                    </div>
                    <Input
                      id="coverUrl"
                      value={formData.coverUrl}
                      onChange={(e) =>
                        handleInputChange("coverUrl", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                      type="url"
                    />
                    {formData.coverUrl && (
                      <div className="mt-2">
                        <img
                          src={formData.coverUrl}
                          alt="Preview"
                          className="w-32 h-20 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPublished", checked)
                    }
                  />
                  <Label htmlFor="isPublished">Xuất bản ngay</Label>
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
                        Tạo khóa học
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
