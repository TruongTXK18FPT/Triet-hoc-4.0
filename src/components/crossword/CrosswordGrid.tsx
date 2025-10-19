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

  useEffect(() => {
    // Tìm cột keyword tối ưu nếu chưa có
    const optimalKeywordColumn = findOptimalKeywordColumn(questions);

    // Cập nhật questions với keywordColumn nếu chưa có
    const updatedQuestions = questions.map((q) => ({
      ...q,
      keywordColumn: q.keywordColumn || optimalKeywordColumn,
    }));

    // Tạo grid với keyword column cố định
    const gridHeight = updatedQuestions.length;

    // Tính gridWidth động để chứa tất cả các trường hợp
    const calculateGridWidth = () => {
      let minStartCol = 0;
      let maxEndCol = 0;

      updatedQuestions.forEach((q) => {
        const offset = q.keywordColumn - q.keywordCharIndex;
        const startCol = offset;
        const endCol = offset + q.answer.length - 1;

        minStartCol = Math.min(minStartCol, startCol);
        maxEndCol = Math.max(maxEndCol, endCol);
      });

      // Đảm bảo keyword column nằm trong grid
      const keywordColumnInRange = Math.max(
        0,
        Math.min(optimalKeywordColumn, maxEndCol)
      );

      // Grid width = khoảng cách từ cột đầu đến cột cuối + padding
      const calculatedWidth = maxEndCol - minStartCol + 2; // +2 cho padding

      return Math.max(
        calculatedWidth,
        keyword.length,
        15 // minimum width
      );
    };

    const gridWidth = calculateGridWidth();

    const newGrid: string[][] = Array(gridHeight)
      .fill(null)
      .map(() => Array(gridWidth).fill(""));
    const newKeywordPositions: boolean[][] = Array(gridHeight)
      .fill(null)
      .map(() => Array(gridWidth).fill(false));

    // Điền câu trả lời với offset để keyword characters thẳng hàng
    updatedQuestions.forEach((question, rowIndex) => {
      const answer = question.answer.toUpperCase();
      const offset = question.keywordColumn - question.keywordCharIndex;

      // Điều chỉnh offset nếu cần thiết để tránh mất chữ
      const adjustedOffset = Math.max(0, offset);

      for (let i = 0; i < answer.length; i++) {
        const colIndex = i + adjustedOffset;
        if (colIndex >= 0 && colIndex < gridWidth) {
          newGrid[rowIndex][colIndex] = answer[i];
        }
      }

      // Đánh dấu vị trí keyword (có thể khác với vị trí thực tế nếu offset bị điều chỉnh)
      const actualKeywordColumn = Math.max(0, question.keywordColumn);
      if (actualKeywordColumn < gridWidth) {
        newKeywordPositions[rowIndex][actualKeywordColumn] = true;
      }
    });

    setGrid(newGrid);
    setKeywordPositions(newKeywordPositions);
  }, [questions, keyword]);

  // Thuật toán tìm cột keyword tối ưu
  function findOptimalKeywordColumn(questions: any[]): number {
    if (questions.length === 0) return 5;

    const maxAnswerLength = Math.max(...questions.map((q) => q.answer.length));
    const estimatedGridWidth = Math.max(maxAnswerLength, keyword.length, 15);

    // Tìm cột có nhiều chữ cái keyword nhất
    const columnCounts = Array(estimatedGridWidth).fill(0);

    questions.forEach((q) => {
      const possibleColumns = [];
      for (let col = 0; col < estimatedGridWidth; col++) {
        const startPos = col - q.keywordCharIndex;
        if (startPos >= 0 && startPos + q.answer.length <= estimatedGridWidth) {
          possibleColumns.push(col);
        }
      }
      possibleColumns.forEach((col) => columnCounts[col]++);
    });

    const maxCount = Math.max(...columnCounts);
    const optimalColumn = columnCounts.indexOf(maxCount);

    // Nếu không tìm được cột tối ưu, dùng cột giữa
    return optimalColumn >= 0
      ? optimalColumn
      : Math.floor(estimatedGridWidth / 2);
  }

  const getCellClass = (row: number, col: number, char: string) => {
    const isKeyword = keywordPositions[row]?.[col];
    const isAnswered = answeredQuestions.has(questions[row]?.order);
    const isSelected = selectedQuestion === questions[row]?.order;

    return cn(
      "w-8 h-8 border border-[#44392d]/30 flex items-center justify-center text-sm font-semibold transition-all duration-200",
      {
        // Keyword column styling
        "bg-gradient-to-b from-red-500 to-red-700 text-white border-red-600":
          isKeyword,
        "bg-red-100 border-red-300": isKeyword && !isAnswered,

        // Answered styling
        "bg-green-100 border-green-400 text-green-800":
          isAnswered && !isKeyword,
        "bg-green-200 border-green-500 text-green-900": isAnswered && isKeyword,

        // Selected styling
        "ring-2 ring-[#44392d] ring-opacity-50": isSelected,

        // Default styling
        "bg-white hover:bg-gray-50": !isAnswered && !isKeyword,
        "text-gray-400": !isAnswered && char === "",
        "text-gray-800": isAnswered && char !== "",
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
          Cột đỏ là keyword. Click vào câu hỏi để trả lời.
        </p>
      </div>

      <div className="grid gap-1 mb-4">
        {/* Header với số thứ tự */}
        <div className="flex gap-1 mb-2">
          <div className="w-8 h-6 flex items-center justify-center text-xs font-bold text-[#44392d]"></div>
          {Array.from({ length: grid[0]?.length || 0 }, (_, i) => (
            <div
              key={i}
              className="w-8 h-6 flex items-center justify-center text-xs font-bold text-[#44392d]"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Grid */}
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {/* Số thứ tự câu hỏi */}
            <div className="w-8 h-8 flex items-center justify-center text-xs font-bold text-[#44392d] bg-gray-100 rounded">
              {questions[rowIndex]?.order}
            </div>

            {/* Các ô chữ */}
            {row.map((char, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(rowIndex, colIndex, char)}
                onClick={() => onQuestionClick(questions[rowIndex]?.order)}
              >
                {answeredQuestions.has(questions[rowIndex]?.order) ? char : ""}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-b from-red-500 to-red-700 rounded"></div>
          <span>Cột keyword</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
          <span>Đã trả lời</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
          <span>Chưa trả lời</span>
        </div>
      </div>
    </div>
  );
}
