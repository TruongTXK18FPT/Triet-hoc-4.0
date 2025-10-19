"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Save, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AnswerInput } from "@/components/crossword/AnswerInput";

interface CrosswordQuestion {
  order: number;
  question: string;
  answer: string;
  explanation: string;
  keywordCharIndex: number;
  keywordColumn: number;
}

export default function CreateCrosswordGame() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keyword, setKeyword] = useState("");
  const [theme, setTheme] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [questions, setQuestions] = useState<CrosswordQuestion[]>([
    {
      order: 1,
      question: "",
      answer: "",
      explanation: "",
      keywordCharIndex: 0,
      keywordColumn: 5,
    },
  ]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44392d] mx-auto mb-4"></div>
            <p>Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    session?.user?.email !== "admin@mln131.com"
  ) {
    router.push("/");
    return null;
  }

  const addQuestion = () => {
    if (questions.length < 20) {
      setQuestions([
        ...questions,
        {
          order: questions.length + 1,
          question: "",
          answer: "",
          explanation: "",
          keywordCharIndex: 0,
          keywordColumn: 5,
        },
      ]);
    }
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      // Cập nhật order
      const updatedQuestions = newQuestions.map((q, i) => ({
        ...q,
        order: i + 1,
      }));
      setQuestions(updatedQuestions);
    }
  };

  const updateQuestion = (
    index: number,
    field: keyof CrosswordQuestion,
    value: any
  ) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };

  const handleSubmit = async (publish: boolean = false) => {
    if (
      !title.trim() ||
      !keyword.trim() ||
      questions.some((q) => !q.question.trim() || !q.answer.trim())
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/crossword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          keyword,
          theme,
          isPublic: publish,
          questions,
        }),
      });

      if (response.ok) {
        const game = await response.json();
        toast({
          title: "Thành công",
          description: publish
            ? "Đã tạo và xuất bản game"
            : "Đã tạo game thành công",
        });
        router.push("/admin");
      } else {
        const error = await response.json();
        toast({
          title: "Lỗi",
          description: error.error || "Không thể tạo game",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating game:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo game",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#44392d] via-[#5a4a3a] to-[#44392d] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
          <h1 className="text-4xl font-extrabold font-headline">
            🎯 Tạo Trò chơi Crossword
          </h1>
          <p className="text-white/80 mt-2">
            Tạo trò chơi ô chữ tìm keyword theo chủ đề Marx-Lenin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form chính */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin cơ bản */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#44392d]">
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Chủ nghĩa xã hội khoa học"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả ngắn về trò chơi..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="theme">Chủ đề</Label>
                  <Input
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="VD: CHỦ NGHĨA XÃ HỘI KHOA HỌC"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="keyword">Keyword (từ khóa dọc) *</Label>
                  <Input
                    id="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                    placeholder="VD: CÔNGNHÂNXÃHỘI"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Keyword sẽ được hiển thị theo chiều dọc trong lưới ô chữ
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="isPublic">
                    Công khai (người dùng có thể chơi)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Câu hỏi */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#44392d]">
                    Câu hỏi ({questions.length}/20)
                  </CardTitle>
                  {questions.length < 20 && (
                    <Button onClick={addQuestion} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm câu hỏi
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">Câu {question.order}</Badge>
                      {questions.length > 1 && (
                        <Button
                          onClick={() => removeQuestion(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Câu hỏi *</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(index, "question", e.target.value)
                          }
                          placeholder="Nhập câu hỏi gợi ý..."
                          rows={2}
                          className="mt-1"
                        />
                      </div>

                      <AnswerInput
                        answer={question.answer}
                        keywordCharIndex={question.keywordCharIndex}
                        keywordColumn={question.keywordColumn}
                        onAnswerChange={(answer) =>
                          updateQuestion(index, "answer", answer)
                        }
                        onKeywordCharIndexChange={(charIndex) =>
                          updateQuestion(index, "keywordCharIndex", charIndex)
                        }
                        onKeywordColumnChange={(column) =>
                          updateQuestion(index, "keywordColumn", column)
                        }
                      />

                      <div>
                        <Label>Giải thích (tùy chọn)</Label>
                        <Textarea
                          value={question.explanation}
                          onChange={(e) =>
                            updateQuestion(index, "explanation", e.target.value)
                          }
                          placeholder="Giải thích cho đáp án..."
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#44392d]">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Tiêu đề:</strong> {title || "Chưa có"}
                  </p>
                  <p>
                    <strong>Chủ đề:</strong> {theme || "Chưa có"}
                  </p>
                  <p>
                    <strong>Keyword:</strong> {keyword || "Chưa có"}
                  </p>
                  <p>
                    <strong>Số câu hỏi:</strong> {questions.length}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {isPublic ? "Công khai" : "Riêng tư"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#44392d]">Hành động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="w-full bg-[#44392d] hover:bg-[#5a4a3a] text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu nháp
                </Button>

                <Button
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Tạo và xuất bản
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
