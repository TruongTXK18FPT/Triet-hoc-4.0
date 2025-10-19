"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock } from "lucide-react";

interface ProgressBarProps {
  completedPercent: number;
  completedChapters: string[];
  totalChapters: number;
  lastAccessedAt?: string;
}

export function ProgressBar({
  completedPercent,
  completedChapters,
  totalChapters,
  lastAccessedAt,
}: ProgressBarProps) {
  const isCompleted = completedPercent === 100;
  const isStarted = completedPercent > 0;

  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-lg font-semibold text-primary">
              Tiến độ học tập
            </h3>
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Hoàn thành</span>
                </div>
              ) : isStarted ? (
                <div className="flex items-center gap-1 text-accent">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Đang học</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Chưa bắt đầu
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Tiến độ tổng thể</span>
              <span className="font-medium">{completedPercent}%</span>
            </div>
            <Progress value={completedPercent} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent">
                {completedChapters.length}
              </div>
              <div className="text-muted-foreground">Đã hoàn thành</div>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">
                {totalChapters || 0}
              </div>
              <div className="text-muted-foreground">Tổng số chương</div>
            </div>
          </div>

          {lastAccessedAt && (
            <div className="text-xs text-muted-foreground text-center">
              Lần cuối truy cập:{" "}
              {new Date(lastAccessedAt).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
