"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CrosswordQuestion {
  id: string;
  order: number;
  question: string;
  answer: string;
  explanation?: string;
  keywordCharIndex: number;
  keywordColumn: number;
}

interface CrosswordGridProps {
  questions: CrosswordQuestion[];
  keyword: string;
  answeredQuestions: Set<number>;
  onQuestionClick: (questionOrder: number) => void;
  selectedQuestion?: number;
}

export function CrosswordGrid({
  questions,
  keyword,
  answeredQuestions,
  onQuestionClick,
  selectedQuestion,
}: CrosswordGridProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [keywordPositions, setKeywordPositions] = useState<boolean[][]>([]);
  const [keywordColumn, setKeywordColumn] = useState<number>(0);

  useEffect(() => {
    // BƯỚC 1: Phân tích các câu hỏi để tìm layout tối ưu
    const analysis = questions.map((q) => ({
      ...q,
      distanceFromStart: q.keywordCharIndex, // Số ô từ đầu câu đến keyword
      distanceFromEnd: q.answer.length - q.keywordCharIndex - 1, // Số ô từ keyword đến cuối câu
    }));

    // BƯỚC 2: Tính toán cột keyword tối ưu
    // - Đặt cột keyword đủ xa để chứa câu có distanceFromStart lớn nhất
    // - Thêm padding 2 ô bên trái
    const maxDistanceFromStart = Math.max(
      ...analysis.map((a) => a.distanceFromStart)
    );
    const maxDistanceFromEnd = Math.max(
      ...analysis.map((a) => a.distanceFromEnd)
    );

    const optimalKeywordColumn = maxDistanceFromStart + 2; // +2 padding bên trái
    const gridWidth = optimalKeywordColumn + maxDistanceFromEnd + 3; // +3 padding bên phải

    // BƯỚC 3: Tạo grid với spacing giữa các câu (3 hàng cho mỗi câu)
    const gridHeight = questions.length * 3; // 3 hàng: 1 trống, 1 câu trả lời, 1 trống

    const newGrid: string[][] = Array(gridHeight)
      .fill(null)
      .map(() => Array(gridWidth).fill(""));
    const newKeywordPositions: boolean[][] = Array(gridHeight)
      .fill(null)
      .map(() => Array(gridWidth).fill(false));

    // BƯỚC 4: Điền từng câu trả lời vào grid
    questions.forEach((question, index) => {
      const answer = question.answer.toUpperCase();
      const rowIndex = index * 3 + 1; // Hàng giữa của mỗi block 3 hàng

      // Tính vị trí bắt đầu để chữ cái keyword nằm đúng cột optimalKeywordColumn
      const startColumn = optimalKeywordColumn - question.keywordCharIndex;

      // Điền các chữ cái
      for (let i = 0; i < answer.length; i++) {
        const colIndex = startColumn + i;
        if (colIndex >= 0 && colIndex < gridWidth) {
          newGrid[rowIndex][colIndex] = answer[i];
        }
      }

      // Đánh dấu vị trí chữ cái keyword
      const keywordColIndex = startColumn + question.keywordCharIndex;
      if (keywordColIndex >= 0 && keywordColIndex < gridWidth) {
        newKeywordPositions[rowIndex][keywordColIndex] = true;
      }
    });

    setGrid(newGrid);
    setKeywordPositions(newKeywordPositions);
    setKeywordColumn(optimalKeywordColumn);
  }, [questions, keyword]);

  const getCellClass = (row: number, col: number, char: string) => {
    // Tính index của câu hỏi từ row (mỗi câu chiếm 3 hàng)
    const questionIndex = Math.floor(row / 3);
    const isAnswerRow = row % 3 === 1; // Chỉ hàng giữa mới có câu trả lời
    const isKeyword = keywordPositions[row]?.[col];
    const isKeywordColumn = col === keywordColumn; // Toàn bộ cột keyword
    const question = questions[questionIndex];
    const isAnswered = question ? answeredQuestions.has(question.order) : false;
    const isSelected = question ? selectedQuestion === question.order : false;

    // Ô trống (không có chữ) - transparent
    if (!char || char === "") {
      return cn(
        "w-8 h-8 flex items-center justify-center transition-all duration-200",
        {
          // Hiển thị visual guide cho cột keyword
          "border-l-2 border-red-200": isKeywordColumn && !isAnswerRow,
          "bg-red-50/20": isKeywordColumn && !isAnswerRow,
        }
      );
    }

    return cn(
      "w-8 h-8 border-2 flex items-center justify-center text-sm font-semibold transition-all duration-200 cursor-pointer",
      {
        // Keyword cell - chữ cái nằm trong cột keyword
        "bg-gradient-to-br from-red-500 to-red-700 text-white border-red-600 shadow-md":
          isKeyword && isAnswered,
        "bg-red-100 border-red-300 text-red-800": isKeyword && !isAnswered,

        // Answered cells - không phải keyword
        "bg-green-100 border-green-400 text-green-800":
          isAnswered && !isKeyword && isAnswerRow,
        
        // Not answered yet
        "bg-white border-gray-300 text-gray-800 hover:bg-gray-50":
          !isAnswered && isAnswerRow,

        // Selected question highlight
        "ring-2 ring-[#44392d] scale-105": isSelected && isAnswerRow,
        
        // Empty spacing rows
        "opacity-0 pointer-events-none": !isAnswerRow,
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#44392d] mb-2">
          Lưới ô chữ
        </h3>
        <p className="text-sm text-gray-600">
          Cột đỏ là keyword. Click vào hàng câu hỏi để trả lời.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Grid với spacing tự động */}
          {grid.map((row, rowIndex) => {
            const questionIndex = Math.floor(rowIndex / 3);
            const isAnswerRow = rowIndex % 3 === 1;
            const question = questions[questionIndex];

            // Chỉ hiển thị hàng có nội dung hoặc là spacing row
            if (!isAnswerRow && row.every((cell) => !cell)) {
              // Spacing row - chỉ hiển thị visual guide cho cột keyword
              return (
                <div key={rowIndex} className="flex gap-1" style={{ height: '12px' }}>
                  <div className="w-8"></div>
                  {row.map((_, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cn("w-8", {
                        "border-l-2 border-red-200": colIndex === keywordColumn,
                      })}
                    ></div>
                  ))}
                </div>
              );
            }

            return (
              <div key={rowIndex} className="flex gap-1 items-center mb-1">
                {/* Số thứ tự câu hỏi - chỉ hiển thị ở hàng answer */}
                {isAnswerRow ? (
                  <div className="w-8 h-8 flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-[#44392d] to-[#5a4a3a] rounded shadow-sm">
                    {question?.order}
                  </div>
                ) : (
                  <div className="w-8"></div>
                )}

                {/* Các ô chữ */}
                {row.map((char, colIndex) => {
                  const cellClass = getCellClass(rowIndex, colIndex, char);
                  const shouldShowChar =
                    isAnswerRow &&
                    question &&
                    answeredQuestions.has(question.order);

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cellClass}
                      onClick={() => {
                        if (isAnswerRow && question) {
                          onQuestionClick(question.order);
                        }
                      }}
                    >
                      {shouldShowChar ? char : ""}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-700 rounded shadow-sm"></div>
          <span className="text-gray-700">Chữ cái keyword</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded"></div>
          <span className="text-gray-700">Đã trả lời đúng</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
          <span className="text-gray-700">Chưa trả lời</span>
        </div>
      </div>
    </div>
  );
}
