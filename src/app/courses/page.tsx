"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { BookOpen, PlusCircle } from "lucide-react";
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
}

export default function CoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<{
    [courseId: string]: UserProgress;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses);
        setUserProgress(data.userProgress || {});
      }
    } catch (error) {
      console.error("Error loading courses:", error);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
              Khóa học Triết học
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Khám phá thế giới triết học qua các khóa học được thiết kế chuyên
              nghiệp, với video bài giảng và câu hỏi warm-up để củng cố kiến
              thức.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-card/50 rounded-lg">
              <BookOpen className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">
                {courses.length}
              </div>
              <div className="text-sm text-muted-foreground">Khóa học</div>
            </div>
            <div className="text-center p-6 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {courses.reduce(
                  (total, course) => total + course._count.chapters,
                  0
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Tổng số chương
              </div>
            </div>
            <div className="text-center p-6 bg-card/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {session ? "Có sẵn" : "Cần đăng nhập"}
              </div>
              <div className="text-sm text-muted-foreground">
                Theo dõi tiến độ
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                Chưa có khóa học nào
              </h3>
              <p className="text-muted-foreground mb-6">
                Các khóa học sẽ được thêm vào sớm. Hãy quay lại sau!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  userProgress={userProgress[course.id] || null}
                />
              ))}
            </div>
          )}

          {/* Call to Action */}
          {session && (
            <div className="text-center mt-12 p-8 bg-gradient-to-r from-[#44392d] to-[#5a4a3a] rounded-lg text-white">
              <h3 className="text-2xl font-bold mb-2">
                Bắt đầu hành trình học tập
              </h3>
              <p className="text-white/80 mb-4">
                Chọn một khóa học phù hợp và bắt đầu khám phá thế giới triết học
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-[#44392d] hover:bg-white/90"
              >
                <Link href="#courses">Xem tất cả khóa học</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
