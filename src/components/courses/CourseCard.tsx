"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: {
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
  };
  userProgress?: {
    completedPercent: number;
    completedChapters: string[];
  } | null;
}

export function CourseCard({ course, userProgress }: CourseCardProps) {
  const isStarted = userProgress && userProgress.completedPercent > 0;
  const isCompleted = userProgress && userProgress.completedPercent === 100;

  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative">
      {/* Badge "Hoàn thành" bên ngoài */}
      {isCompleted && (
        <div className="absolute top-4 right-4 z-10">
          <Badge
            variant="default"
            className="bg-green-600 text-white shadow-lg"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="aspect-video bg-gradient-to-br from-[#44392d] to-[#5a4a3a] rounded-lg mb-4 flex items-center justify-center">
          {course.coverUrl ? (
            <img
              src={course.coverUrl}
              alt={course.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <BookOpen className="h-12 w-12 text-white/60" />
          )}
        </div>
        <CardTitle className="font-headline text-xl text-primary line-clamp-2">
          {course.title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {course.description || "Không có mô tả"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow pb-4">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>{course._count.chapters} chương</span>
          </div>

          {userProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tiến độ</span>
                <span className="font-medium">
                  {userProgress.completedPercent}%
                </span>
              </div>
              <Progress value={userProgress.completedPercent} className="h-2" />
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {isCompleted && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Hoàn thành
              </Badge>
            )}
            {isStarted && !isCompleted && (
              <Badge variant="secondary">Đang học</Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link href={`/courses/${course.id}`}>
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Xem lại
              </>
            ) : isStarted ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Tiếp tục học
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Bắt đầu học
              </>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
