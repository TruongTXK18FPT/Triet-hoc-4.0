"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChapterList } from "@/components/courses/ChapterList";
import { ProgressBar } from "@/components/courses/ProgressBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  chapters: Array<{
    id: string;
    title: string;
    order: number;
  }>;
  _count: {
    chapters: number;
  };
}

interface UserProgress {
  completedPercent: number;
  completedChapters: string[];
  totalChapters: number;
  lastAccessedAt: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const { courseId } = params;

  const [course, setCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
        setUserProgress(data.userProgress);
      }
    } catch (error) {
      console.error("Error loading course:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#44392d] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải khóa học...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-primary">
                Không tìm thấy khóa học
              </CardTitle>
              <CardDescription>
                Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild>
                <Link href="/courses">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại danh sách
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const isCompleted = userProgress && userProgress.completedPercent === 100;
  const isStarted = userProgress && userProgress.completedPercent > 0;
  const nextChapter = course.chapters.find(
    (chapter) => !userProgress?.completedChapters?.includes(chapter.id)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/courses" className="hover:text-primary">
              Khóa học
            </Link>
            <span>/</span>
            <span className="text-primary">{course.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Header */}
              <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="aspect-video w-32 bg-gradient-to-br from-[#44392d] to-[#5a4a3a] rounded-lg flex items-center justify-center flex-shrink-0">
                      {course.coverUrl ? (
                        <img
                          src={course.coverUrl}
                          alt={course.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <BookOpen className="h-8 w-8 text-white/60" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="font-headline text-2xl text-primary mb-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {course.description || "Không có mô tả"}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-4">
                        <Badge variant="outline">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {course._count.chapters} chương
                        </Badge>
                        {isCompleted && (
                          <Badge className="bg-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Hoàn thành
                          </Badge>
                        )}
                        {isStarted && !isCompleted && (
                          <Badge variant="secondary">Đang học</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Progress Bar */}
              {userProgress && (
                <ProgressBar
                  completedPercent={userProgress.completedPercent}
                  completedChapters={userProgress.completedChapters || []}
                  totalChapters={userProgress.totalChapters}
                  lastAccessedAt={userProgress.lastAccessedAt}
                />
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {nextChapter ? (
                  <Button asChild size="lg" className="flex-1">
                    <Link
                      href={`/courses/${courseId}/chapters/${nextChapter.id}`}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      {isStarted ? "Tiếp tục học" : "Bắt đầu học"}
                    </Link>
                  </Button>
                ) : isCompleted ? (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="flex-1"
                  >
                    <Link
                      href={`/courses/${courseId}/chapters/${course.chapters[0].id}`}
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Xem lại khóa học
                    </Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="flex-1">
                    <Link
                      href={`/courses/${courseId}/chapters/${course.chapters[0].id}`}
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Bắt đầu học
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="lg">
                  <Link href="/courses">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Quay lại
                  </Link>
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ChapterList
                chapters={course.chapters}
                completedChapters={userProgress?.completedChapters || []}
                courseId={courseId as string}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
