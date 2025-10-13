'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Redo } from 'lucide-react';
import Link from 'next/link';

// Sample quiz data. This would typically be fetched from a database or CMS.
const sampleQuiz = {
  title: 'Phép biện chứng duy vật',
  description: 'Kiểm tra kiến thức của bạn về các nguyên lý, quy luật và phạm trù cơ bản của phép biện chứng duy vật.',
  questions: [
    {
      id: 'q1',
      text: 'Theo chủ nghĩa Mác-Lênin, hai nguyên lý cơ bản của phép biện chứng duy vật là gì?',
      options: [
        { id: 'o1', text: 'Nguyên lý về mối liên hệ phổ biến và nguyên lý về sự phát triển.' },
        { id: 'o2', text: 'Nguyên lý về vật chất và ý thức.' },
        { id: 'o3', text: 'Nguyên lý về tồn tại xã hội và ý thức xã hội.' },
        { id 'o4', text: 'Nguyên lý về đấu tranh giai cấp và cách mạng xã hội.' },
      ],
      correctOptionId: 'o1',
    },
    {
      id: 'q2',
      text: 'Quy luật nào được Lênin coi là "hạt nhân" của phép biện chứng?',
      options: [
        { id: 'o1', text: 'Quy luật từ những thay đổi về lượng dẫn đến những thay đổi về chất và ngược lại.' },
        { id: 'o2', text: 'Quy luật thống nhất và đấu tranh của các mặt đối lập.' },
        { id: 'o3', text: 'Quy luật phủ định của phủ định.' },
        { id: 'o4', text: 'Quy luật về sự phù hợp của quan hệ sản xuất với tính chất và trình độ của lực lượng sản xuất.' },
      ],
      correctOptionId: 'o2',
    },
    {
      id: 'q3',
      text: 'Cặp phạm trù nào sau đây thể hiện mối quan hệ giữa cái riêng và cái chung?',
      options: [
        { id: 'o1', text: 'Nguyên nhân và kết quả' },
        { id: 'o2', text: 'Bản chất và hiện tượng' },
        { id: 'o3', text: 'Tất nhiên và ngẫu nhiên' },
        { id: 'o4', text: 'Cái đơn nhất và cái phổ biến' },
      ],
      correctOptionId: 'o4',
    },
  ],
};

type AnswersState = {
  [questionId: string]: string; // optionId
};

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [isFinished, setIsFinished] = useState(false);

  const progress = ((currentQuestionIndex + 1) / sampleQuiz.questions.length) * 100;
  const currentQuestion = sampleQuiz.questions[currentQuestionIndex];
  const selectedOption = answers[currentQuestion.id];

  const handleOptionChange = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
  };

  const goToNext = () => {
    if (currentQuestionIndex < sampleQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    return sampleQuiz.questions.reduce((score, question) => {
      return score + (answers[question.id] === question.correctOptionId ? 1 : 0);
    }, 0);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsFinished(false);
  };
  
  if (isFinished) {
    const score = calculateScore();
    const total = sampleQuiz.questions.length;

    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
            <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl text-primary">Kết quả Quiz</CardTitle>
                    <CardDescription>{sampleQuiz.title}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-5xl font-bold text-accent mb-2">
                        {score} / {total}
                    </p>
                    <p className="text-lg text-foreground/80 mb-6">
                        Bạn đã trả lời đúng {score} trên {total} câu hỏi.
                    </p>
                    <div className="space-y-4">
                        {sampleQuiz.questions.map(q => {
                            const userAnswer = answers[q.id];
                            const isCorrect = userAnswer === q.correctOptionId;
                            const correctOptionText = q.options.find(o => o.id === q.correctOptionId)?.text;
                            const userAnswerText = q.options.find(o => o.id === userAnswer)?.text;

                            return (
                                <div key={q.id} className="p-3 bg-background/50 rounded-lg text-left">
                                    <p className="font-semibold">{q.text}</p>
                                    {isCorrect ? (
                                        <p className="text-sm text-green-600 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Bạn đã chọn đúng: {userAnswerText}</p>
                                    ) : (
                                        <>
                                            <p className="text-sm text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Bạn đã chọn: {userAnswerText || "Chưa trả lời"}</p>
                                            <p className="text-sm text-green-600">Đáp án đúng: {correctOptionText}</p>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row gap-4">
                    <Button onClick={restartQuiz} className="w-full sm:w-auto" variant="secondary"><Redo className="mr-2"/>Làm lại</Button>
                    <Button asChild className="w-full sm:w-auto"><Link href="/quiz">Chọn chủ đề khác</Link></Button>
                    <Button asChild className="w-full sm:w-auto"><Link href="/quiz/create">Tạo quiz mới</Link></Button>
                </CardFooter>
            </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <Progress value={progress} className="w-full mb-4" />
            <CardTitle className="font-headline text-2xl text-primary">{sampleQuiz.title}</CardTitle>
            <CardDescription>Câu {currentQuestionIndex + 1} trên {sampleQuiz.questions.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold mb-6">{currentQuestion.text}</p>
            <RadioGroup value={selectedOption} onValueChange={handleOptionChange}>
              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <Label
                    key={option.id}
                    className={cn(
                        "flex items-center p-4 rounded-lg border transition-all cursor-pointer",
                        selectedOption === option.id ? 'bg-accent/20 border-accent' : 'bg-background/50 hover:bg-accent/10'
                    )}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="mr-4" />
                    <span>{option.text}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goToPrevious} disabled={currentQuestionIndex === 0}>
              <ChevronLeft className="mr-2" />
              Câu trước
            </Button>
            <Button onClick={goToNext} disabled={!selectedOption}>
              {currentQuestionIndex === sampleQuiz.questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
              <ChevronRight className="ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
