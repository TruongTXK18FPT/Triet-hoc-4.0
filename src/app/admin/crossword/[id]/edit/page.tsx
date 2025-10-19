"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Save, Eye, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AnswerInput } from "@/components/crossword/AnswerInput";

interface CrosswordQuestion {
  id?: string;
  order: number;
  question: string;
  answer: string;
  explanation: string;
  keywordCharIndex: number;
  keywordColumn: number;
}

interface CrosswordGame {
  id: string;
  title: string;
  description?: string;
  keyword: string;
  theme?: string;
  isPublic: boolean;
  questions: CrosswordQuestion[];
}

export default function EditCrosswordGame() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keyword, setKeyword] = useState("");
  const [theme, setTheme] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [questions, setQuestions] = useState<CrosswordQuestion[]>([]);

  // Load game data
  useEffect(() => {
    if (params.id) {
      loadGameData();
    }
  }, [params.id]);

  const loadGameData = async () => {
    try {
      setDataLoading(true);
      const response = await fetch(`/api/crossword/${params.id}`);
      if (response.ok) {
        const game: CrosswordGame = await response.json();

        setTitle(game.title);
        setDescription(game.description || "");
        setKeyword(game.keyword);
        setTheme(game.theme || "");
        setIsPublic(game.isPublic);

        // Sort questions by order and add id if missing
        const sortedQuestions = game.questions
          .sort((a, b) => a.order - b.order)
          .map((q) => ({
            ...q,
            id: q.id || `temp-${q.order}`, // Add temp id if missing
          }));

        setQuestions(sortedQuestions);
      } else {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy trò chơi",
          variant: "destructive",
        });
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error loading game:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu trò chơi",
        variant: "destructive",
      });
      router.push("/admin");
    } finally {
      setDataLoading(false);
    }
  };

  if (status === "loading" || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#44392d] mx-auto mb-4" />
            <p>Đang tải dữ liệu trò chơi...</p>
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
      const newOrder = questions.length + 1;
      setQuestions([
        ...questions,
        {
          order: newOrder,
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
    if (questions.length <= 1) {
      toast({
        title: "Lỗi",
        description: "Cần ít nhất 1 câu hỏi",
        variant: "destructive",
      });
      return;
    }

    const newQuestions = questions.filter((_, i) => i !== index);
    // Reorder questions
    const reorderedQuestions = newQuestions.map((q, i) => ({
      ...q,
      order: i + 1,
    }));
    setQuestions(reorderedQuestions);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !keyword.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ tiêu đề và keyword",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Lỗi",
        description: "Cần ít nhất 1 câu hỏi",
        variant: "destructive",
      });
      return;
    }

    // Validate questions
    for (const q of questions) {
      if (!q.question.trim() || !q.answer.trim()) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ câu hỏi và đáp án",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/crossword/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          keyword,
          theme,
          isPublic,
          questions,
        }),
      });

      if (response.ok) {
        toast({
          title: "Thành công",
          description: "Đã cập nhật trò chơi crossword",
        });
        router.push("/admin");
      } else {
        const error = await response.json();
        toast({
          title: "Lỗi",
          description: error.message || "Không thể cập nhật trò chơi",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating game:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trò chơi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#44392d] via-[#5a4a3a] to-[#44392d] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-extrabold font-headline">
                  Sửa trò chơi Crossword
                </h1>
                <p className="text-white/80 mt-1">
                  Chỉnh sửa thông tin và câu hỏi của trò chơi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push(`/crossword/${params.id}`)}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Xem trò chơi
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#44392d]">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Crossword: Chủ nghĩa xã hội khoa học"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả về trò chơi..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="keyword">Keyword (từ khóa dọc) *</Label>
                  <Input
                    id="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value.toUpperCase())}
                    placeholder="VD: CÔNGNHÂNXÃHỘI"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="theme">Chủ đề</Label>
                  <Input
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="VD: CHỦ NGHĨA XÃ HỘI KHOA HỌC"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="isPublic">Công khai</Label>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#44392d]">
                  Câu hỏi ({questions.length}/20)
                </CardTitle>
                {questions.length < 20 && (
                  <Button
                    type="button"
                    onClick={addQuestion}
                    className="bg-[#44392d] hover:bg-[#5a4a3a] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm câu hỏi
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gray-50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-sm">
                      Câu {question.order}
                    </Badge>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <AnswerInput
                    answer={question.answer}
                    keywordCharIndex={question.keywordCharIndex}
                    keywordColumn={question.keywordColumn}
                    onAnswerChange={(answer) =>
                      updateQuestion(index, "answer", answer)
                    }
                    onKeywordCharIndexChange={(keywordCharIndex) =>
                      updateQuestion(
                        index,
                        "keywordCharIndex",
                        keywordCharIndex
                      )
                    }
                    onKeywordColumnChange={(keywordColumn) =>
                      updateQuestion(index, "keywordColumn", keywordColumn)
                    }
                  />

                  <div>
                    <Label htmlFor={`question-${index}`}>Câu hỏi *</Label>
                    <Textarea
                      id={`question-${index}`}
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(index, "question", e.target.value)
                      }
                      placeholder="Nhập câu hỏi..."
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`explanation-${index}`}>Giải thích</Label>
                    <Textarea
                      id={`explanation-${index}`}
                      value={question.explanation}
                      onChange={(e) =>
                        updateQuestion(index, "explanation", e.target.value)
                      }
                      placeholder="Giải thích đáp án..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#44392d] hover:bg-[#5a4a3a] text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? "Đang cập nhật..." : "Cập nhật trò chơi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
