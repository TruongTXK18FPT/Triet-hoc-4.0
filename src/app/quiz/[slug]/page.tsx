'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Redo } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { sampleQuizzes } from '@/lib/sample-quizzes';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type AnswersState = {
  [questionId: string]: string; // optionId
};

export default function QuizPage() {
  const params = useParams();
  const { slug } = params;
  
  const quiz = sampleQuizzes.find(q => q.slug === slug);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [isFinished, setIsFinished] = useState(false);

  if (!quiz) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
            <Alert variant="destructive" className="max-w-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Không tìm thấy Quiz!</AlertTitle>
              <AlertDescription>
                Bài quiz bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng quay lại trang danh sách.
                <Button asChild variant="link" className="p-0 h-auto mt-2 block">
                  <Link href="/quiz">Quay lại danh sách</Link>
                </Button>
              </AlertDescription>
            </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selectedOption = answers[currentQuestion.id];

  const handleOptionChange = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
  };

  const goToNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
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
    return quiz.questions.reduce((score, question) => {
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
    const total = quiz.questions.length;

    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
            <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl text-primary">Kết quả Quiz</CardTitle>
                    <CardDescription>{quiz.title}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-5xl font-bold text-accent mb-2">
                        {score} / {total}
                    </p>
                    <p className="text-lg text-foreground/80 mb-6">
                        Bạn đã trả lời đúng {score} trên {total} câu hỏi.
                    </p>
                    <div className="space-y-4">
                        {quiz.questions.map(q => {
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
            <CardTitle className="font-headline text-2xl text-primary">{quiz.title}</CardTitle>
            <CardDescription>Câu {currentQuestionIndex + 1} trên {quiz.questions.length}</CardDescription>
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
              {currentQuestionIndex === quiz.questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
              <ChevronRight className="ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
