"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Play, Lock } from "lucide-react";
import { ChapterCheckmark } from "./CourseCompletionBadge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ChapterListProps {
  chapters: Array<{
    id: string;
    title: string;
    order: number;
  }>;
  currentChapterId?: string;
  completedChapters?: string[];
  courseId: string;
}

export function ChapterList({
  chapters,
  currentChapterId,
  completedChapters = [],
  courseId,
}: ChapterListProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-lg border-2 border-amber-200 vintage-card">
      <CardContent className="p-6">
        <h3 className="font-headline text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
          📚 Nội dung khóa học
        </h3>
        <div className="space-y-3">
          {chapters.map((chapter, index) => {
            const isCompleted = completedChapters.includes(chapter.id);
            const isCurrent = chapter.id === currentChapterId;

            return (
              <Link
                key={chapter.id}
                href={`/courses/${courseId}/chapters/${chapter.id}`}
                className={cn(
                  "flex items-center p-4 rounded-lg transition-all duration-200 border-2",
                  "hover:shadow-md hover:-translate-y-0.5",
                  isCurrent && "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md",
                  isCompleted && !isCurrent && "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300",
                  !isCurrent && !isCompleted && "bg-white border-slate-200 hover:border-amber-300"
                )}
              >
                <div className="flex items-center flex-1 min-w-0 gap-4">
                  {/* Vintage Checkmark */}
                  <div className="flex-shrink-0">
                    <ChapterCheckmark completed={isCompleted} size="md" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded vintage-badge">
                        Chương {index + 1}
                      </span>
                      {isCompleted && (
                        <Badge variant="secondary" className="text-xs bg-amber-600 text-white border-0 vintage-badge">
                          ✓ Hoàn thành
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge variant="default" className="text-xs bg-blue-600 text-white border-0 vintage-badge">
                          👁️ Đang xem
                        </Badge>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCurrent && "text-blue-900",
                        isCompleted && "text-amber-900",
                        !isCurrent && !isCompleted && "text-slate-700"
                      )}
                    >
                      {chapter.title}
                    </p>
                  </div>

                  {/* Play Icon */}
                  {!isCompleted && (
                    <div className="flex-shrink-0">
                      <Play className={cn(
                        "w-5 h-5",
                        isCurrent ? "text-blue-600" : "text-slate-400"
                      )} />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

