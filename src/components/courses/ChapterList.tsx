"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Play, Lock } from "lucide-react";
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
    <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <h3 className="font-headline text-lg font-semibold text-primary mb-4">
          Nội dung khóa học
        </h3>
        <div className="space-y-2">
          {chapters.map((chapter, index) => {
            const isCompleted = completedChapters.includes(chapter.id);
            const isCurrent = chapter.id === currentChapterId;

            return (
              <Link
                key={chapter.id}
                href={`/courses/${courseId}/chapters/${chapter.id}`}
                className={cn(
                  "flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-accent/20",
                  isCurrent && "bg-accent/30 border border-accent",
                  isCompleted && "bg-green-50 border border-green-200"
                )}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-shrink-0 mr-3">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : isCurrent ? (
                      <Play className="w-5 h-5 text-accent" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Chương {index + 1}
                      </span>
                      {isCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          Hoàn thành
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge variant="default" className="text-xs">
                          Đang xem
                        </Badge>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isCurrent && "text-accent",
                        isCompleted && "text-green-700"
                      )}
                    >
                      {chapter.title}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

