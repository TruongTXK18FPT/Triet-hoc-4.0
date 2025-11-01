"use client";

import { CheckCircle2, Circle, Award, Trophy, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseCompletionBadgeProps {
  completedPercent: number;
  totalChapters: number;
  completedChapters: number;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export function CourseCompletionBadge({
  completedPercent,
  totalChapters,
  completedChapters,
  size = "md",
  showDetails = true,
}: CourseCompletionBadgeProps) {
  const isCompleted = completedPercent === 100;
  const isInProgress = completedPercent > 0 && completedPercent < 100;

  // Size classes
  const sizeClasses = {
    sm: {
      icon: "w-4 h-4",
      text: "text-xs",
      badge: "text-xs px-2 py-1",
      container: "gap-2",
    },
    md: {
      icon: "w-5 h-5",
      text: "text-sm",
      badge: "text-sm px-3 py-1",
      container: "gap-3",
    },
    lg: {
      icon: "w-6 h-6",
      text: "text-base",
      badge: "text-base px-4 py-2",
      container: "gap-4",
    },
  };

  const classes = sizeClasses[size];

  // Vintage completion status
  if (isCompleted) {
    return (
      <div
        className={`flex items-center ${classes.container} bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-lg px-4 py-3 shadow-md vintage-badge-complete`}
      >
        <div className="relative">
          <Trophy className={`${classes.icon} text-amber-600 animate-bounce-slow`} />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-bold text-amber-900 ${classes.text}`}>
              HOÀN THÀNH
            </span>
            <Award className={`${classes.icon} text-amber-600`} />
          </div>
          {showDetails && (
            <p className="text-xs text-amber-700 mt-0.5">
              {completedChapters}/{totalChapters} chương • 100%
            </p>
          )}
        </div>

        <Badge className="bg-amber-600 text-white border-0 shadow-md vintage-badge">
          <Star className="w-3 h-3 mr-1 fill-current" />
          Xuất sắc
        </Badge>
      </div>
    );
  }

  if (isInProgress) {
    return (
      <div
        className={`flex items-center ${classes.container} bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg px-4 py-3 shadow-md vintage-badge-progress`}
      >
        <div className="relative">
          <CheckCircle2 className={`${classes.icon} text-blue-600`} />
          <svg className="absolute inset-0 -m-1" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${completedPercent * 1.13} 113`}
              strokeLinecap="round"
              className="text-blue-400"
              transform="rotate(-90 20 20)"
            />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-blue-900 ${classes.text}`}>
              ĐANG HỌC
            </span>
          </div>
          {showDetails && (
            <p className="text-xs text-blue-700 mt-0.5">
              {completedChapters}/{totalChapters} chương • {completedPercent}%
            </p>
          )}
        </div>

        <div className="text-right">
          <div className={`font-bold text-blue-900 ${classes.text}`}>
            {completedPercent}%
          </div>
          <div className="w-20 h-2 bg-blue-200 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${completedPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Not started
  return (
    <div
      className={`flex items-center ${classes.container} bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-300 rounded-lg px-4 py-3 shadow-sm vintage-badge-new`}
    >
      <Circle className={`${classes.icon} text-slate-400`} />
      
      <div className="flex-1">
        <span className={`font-medium text-slate-600 ${classes.text}`}>
          CHƯA BẮT ĐẦU
        </span>
        {showDetails && (
          <p className="text-xs text-slate-500 mt-0.5">
            0/{totalChapters} chương • 0%
          </p>
        )}
      </div>

      <Badge
        variant="outline"
        className="border-slate-400 text-slate-600 vintage-badge"
      >
        Mới
      </Badge>
    </div>
  );
}

// Chapter completion checkmark
interface ChapterCheckmarkProps {
  completed: boolean;
  size?: "sm" | "md" | "lg";
}

export function ChapterCheckmark({ completed, size = "md" }: ChapterCheckmarkProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  if (completed) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg vintage-checkmark-complete`}
      >
        <CheckCircle2 className="w-3/4 h-3/4 text-white" strokeWidth={3} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-2 border-slate-300 bg-white flex items-center justify-center vintage-checkmark-empty`}
    >
      <Circle className="w-3/4 h-3/4 text-slate-300" />
    </div>
  );
}
