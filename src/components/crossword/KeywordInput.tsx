"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Key, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeywordInputProps {
  keyword: string;
  revealedLetters: Set<number>;
  onKeywordSubmit: (keyword: string) => void;
  isCorrect?: boolean;
  isChecking?: boolean;
}

export function KeywordInput({
  keyword,
  revealedLetters,
  onKeywordSubmit,
  isCorrect = false,
  isChecking = false,
}: KeywordInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onKeywordSubmit(inputValue.trim());
      setInputValue("");
    }
  };

  const getKeywordDisplay = () => {
    return keyword.split("").map((char, index) => {
      const isRevealed = revealedLetters.has(index);
      return (
        <div
          key={index}
          className={cn(
            "w-8 h-8 border-2 rounded flex items-center justify-center text-sm font-bold transition-all duration-300",
            {
              "bg-gradient-to-b from-red-500 to-red-700 text-white border-red-600":
                isRevealed,
              "bg-gray-100 border-gray-300 text-gray-400": !isRevealed,
              "animate-pulse": isChecking,
            }
          )}
        >
          {isRevealed ? char : "?"}
        </div>
      );
    });
  };

  return (
    <Card className="bg-gradient-to-br from-[#44392d]/5 to-[#494f34]/5 border-[#44392d]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#44392d]">
          <Key className="h-5 w-5" />
          Keyword bí mật
        </CardTitle>
        <p className="text-sm text-gray-600">
          Trả lời đúng các câu hỏi để mở khóa từng chữ cái, hoặc đoán keyword
          ngay!
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hiển thị keyword */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keyword ({keyword.length} chữ cái):
          </label>
          <div className="flex gap-1 justify-center">{getKeywordDisplay()}</div>
        </div>

        {/* Progress */}
        <div className="text-center">
          <Badge variant="outline" className="text-sm">
            Đã mở: {revealedLetters.size}/{keyword.length} chữ cái
          </Badge>
        </div>

        {/* Input form */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đoán keyword:
            </label>
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                placeholder="Nhập keyword..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                disabled={isChecking}
              />
              <Button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isChecking}
                className={cn(
                  "bg-gradient-to-r from-[#44392d] to-[#5a4a3a] hover:from-[#5a4a3a] hover:to-[#44392d] text-white",
                  {
                    "animate-pulse": isChecking,
                  }
                )}
              >
                {isChecking ? (
                  <Sparkles className="h-4 w-4 animate-spin" />
                ) : (
                  "Đoán"
                )}
              </Button>
            </div>
          </div>

          {/* Status messages */}
          {isCorrect && (
            <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-300 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Chúc mừng! Bạn đã đoán đúng keyword!
              </span>
            </div>
          )}
        </div>

        {/* Hints */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 Mẹo: Trả lời đúng câu hỏi để mở khóa từng chữ cái</p>
          <p>💡 Bạn có thể đoán keyword bất cứ lúc nào</p>
        </div>
      </CardContent>
    </Card>
  );
}
