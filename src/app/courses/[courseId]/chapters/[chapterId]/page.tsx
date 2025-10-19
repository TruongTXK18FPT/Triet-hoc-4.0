"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { VideoPlayer } from "@/components/courses/VideoPlayer";
import { WarmupQuiz } from "@/components/courses/WarmupQuiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

interface Chapter {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  youtubeUrl: string | null;
  order: number;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string | null;
  }>;
  course: {
    id: string;
    title: string;
    chapters: Array<{
      id: string;
      title: string;
      order: number;
    }>;
  };
}

interface ChapterProgress {
  videoWatched: boolean;
  quizCompleted: boolean;
  completedAt: string | null;
}

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { courseId, chapterId } = params;

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapterProgress, setChapterProgress] =
    useState<ChapterProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (courseId && chapterId) {
      loadChapter();
    }
  }, [courseId, chapterId]);

  const loadChapter = async () => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}/chapters/${chapterId}`
      );
      if (response.ok) {
        const data = await response.json();
        setChapter(data.chapter);
        setChapterProgress(data.chapterProgress);
      }
    } catch (error) {
      console.error("Error loading chapter:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChapter = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Cần đăng nhập",
        description: "Bạn cần đăng nhập để theo dõi tiến độ học tập.",
        variant: "destructive",
      });
      return;
    }

    setCompleting(true);
    try {
      const response = await fetch(
        `/api/courses/${courseId}/chapters/${chapterId}/complete`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Chúc mừng!",
          description: `Bạn đã hoàn thành chương này. Tiến độ: ${data.completedPercent}%`,
        });

        // Reload chapter to update progress
        await loadChapter();
      } else {
        throw new Error("Failed to complete chapter");
      }
    } catch (error) {
      console.error("Error completing chapter:", error);
      toast({
        title: "Lỗi",
        description: "Không thể đánh dấu hoàn thành chương. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setCompleting(false);
    }
  };

  const getNavigationChapters = () => {
    if (!chapter) return { previous: null, next: null };

    const currentIndex = chapter.course.chapters.findIndex(
      (c) => c.id === chapterId
    );
    const previous =
      currentIndex > 0 ? chapter.course.chapters[currentIndex - 1] : null;
    const next =
      currentIndex < chapter.course.chapters.length - 1
        ? chapter.course.chapters[currentIndex + 1]
        : null;

    return { previous, next };
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44392d] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải chương học...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Không tìm thấy chương học</AlertTitle>
            <AlertDescription>
              Chương học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  const { previous, next } = getNavigationChapters();
  const isCompleted = chapterProgress?.quizCompleted;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/courses" className="hover:text-primary">
              Khóa học
            </Link>
            <span>/</span>
            <Link href={`/courses/${courseId}`} className="hover:text-primary">
              {chapter.course.title}
            </Link>
            <span>/</span>
            <span className="text-primary">Chương {chapter.order}</span>
          </div>

          {/* Chapter Header */}
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-2xl text-primary">
                    {chapter.title}
                  </CardTitle>
                  {chapter.description && (
                    <p className="text-muted-foreground mt-2">
                      {chapter.description}
                    </p>
                  )}
                </div>
                {isCompleted && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Đã hoàn thành</span>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Video Player */}
          <VideoPlayer
            youtubeUrl={chapter.youtubeUrl}
            videoUrl={chapter.videoUrl}
            title={chapter.title}
            description={chapter.description}
          />

          {/* Warm-up Quiz */}
          {chapter.questions.length > 0 && (
            <div className="mt-8">
              <WarmupQuiz
                questions={chapter.questions}
                onComplete={handleCompleteChapter}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href={`/courses/${courseId}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại khóa học
                </Link>
              </Button>

              {previous && (
                <Button asChild variant="outline">
                  <Link href={`/courses/${courseId}/chapters/${previous.id}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Chương trước
                  </Link>
                </Button>
              )}
            </div>

            <div>
              {next && (
                <Button asChild>
                  <Link href={`/courses/${courseId}/chapters/${next.id}`}>
                    Chương tiếp theo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

