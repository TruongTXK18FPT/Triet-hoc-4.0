"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MousePointer, Key } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerInputProps {
  answer: string;
  keywordCharIndex: number;
  keywordColumn?: number;
  onAnswerChange: (answer: string) => void;
  onKeywordCharIndexChange: (index: number) => void;
  onKeywordColumnChange?: (column: number) => void;
  disabled?: boolean;
}

export function AnswerInput({
  answer,
  keywordCharIndex,
  keywordColumn,
  onAnswerChange,
  onKeywordCharIndexChange,
  onKeywordColumnChange,
  disabled = false,
}: AnswerInputProps) {
  const [localAnswer, setLocalAnswer] = useState(answer);

  // Sync localAnswer with prop changes
  useEffect(() => {
    setLocalAnswer(answer);
  }, [answer]);

  const handleAnswerChange = (value: string) => {
    setLocalAnswer(value);
    onAnswerChange(value);
  };

  const handleCharClick = (index: number) => {
    if (index < localAnswer.length) {
      onKeywordCharIndexChange(index);
    }
  };

  const getCharClass = (index: number) => {
    const isKeywordChar = index === keywordCharIndex;
    const isClickable = index < localAnswer.length;

    return cn(
      "inline-block w-8 h-8 border-2 rounded text-center text-sm font-bold cursor-pointer transition-all duration-200 flex items-center justify-center",
      {
        "bg-gradient-to-b from-red-500 to-red-700 text-white border-red-600":
          isKeywordChar,
        "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200":
          !isKeywordChar && isClickable,
        "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed":
          !isClickable,
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#44392d]">
          <MousePointer className="h-5 w-5" />
          Nhập đáp án
        </CardTitle>
        <p className="text-sm text-gray-600">
          Click vào chữ cái để chọn làm keyword
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Answer input */}
        <div>
          <Label htmlFor="answer">Đáp án:</Label>
          <Input
            id="answer"
            value={localAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Nhập đáp án..."
            disabled={disabled}
            className="mt-1"
          />
        </div>

        {/* Character selector */}
        {localAnswer && (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Chọn chữ cái tạo keyword:
            </Label>
            <div className="flex gap-1 flex-wrap">
              {localAnswer.split("").map((char, index) => (
                <div
                  key={index}
                  className={getCharClass(index)}
                  onClick={() => handleCharClick(index)}
                  title={`Chữ cái thứ ${index + 1}: "${char}"`}
                >
                  {char}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Chữ cái được chọn: {keywordCharIndex + 1} - "
              {localAnswer[keywordCharIndex] || "N/A"}"
            </p>
          </div>
        )}

        {/* Preview */}
        {localAnswer && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Preview:
              </span>
            </div>
            <div className="flex gap-1">
              {localAnswer.split("").map((char, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-6 h-6 border rounded text-xs font-bold flex items-center justify-center",
                    {
                      "bg-red-100 border-red-300 text-red-800":
                        index === keywordCharIndex,
                      "bg-white border-gray-300 text-gray-600":
                        index !== keywordCharIndex,
                    }
                  )}
                >
                  {char}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Chữ cái keyword: "{localAnswer[keywordCharIndex] || "N/A"}"
            </p>
            {keywordColumn !== undefined && (
              <p className="text-xs text-gray-500 mt-1">
                Cột keyword: {keywordColumn + 1}
              </p>
            )}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Độ dài: {localAnswer.length}
          </Badge>
          {keywordCharIndex >= 0 && (
            <Badge variant="outline" className="text-xs">
              Keyword char: {keywordCharIndex + 1}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
