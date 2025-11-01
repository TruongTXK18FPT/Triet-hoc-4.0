'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Redo, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type Question = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
  author: {
    id: string;
    name: string | null;
  };
};

type AnswersState = {
  [questionId: string]: number; // index of selected option
};

export default function QuizPage() {
  const params = useParams();
  const { slug } = params; // This is now the quiz ID
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [isFinished, setIsFinished] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  // Calculate score function
  const calculateScore = useCallback(() => {
    if (!quiz) return 0;
    return quiz.questions.reduce((score, question) => {
      return score + (answers[question.id] === question.answer ? 1 : 0);
    }, 0);
  }, [quiz, answers]);

  useEffect(() => {
    async function fetchQuiz() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/quiz/${slug}`);
        if (!response.ok) {
          throw new Error('Quiz not found');
        }
        const data = await response.json();
        setQuiz(data.quiz);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuiz();
  }, [slug]);

  // Award XP when quiz is completed
  useEffect(() => {
    async function awardXP() {
      if (!isFinished || !quiz || xpAwarded) return;
      
      try {
        const score = calculateScore();
        const percentage = Math.round((score / quiz.questions.length) * 100);
        
        // Always award 100 XP for quiz completion
        const activityType = 'QUIZ_COMPLETED';
        
        const response = await fetch('/api/gamification/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityType,
            metadata: {
              title: quiz.title,
              score: percentage
            }
          })
        });
        
        if (response.ok) {
          setXpAwarded(true);
          console.log('✅ XP awarded successfully');
        } else {
          const error = await response.json();
          console.error('❌ Failed to award XP:', error);
        }
      } catch (err) {
        console.error('❌ XP award error:', err);
      }
    }
    
    awardXP();
  }, [isFinished, quiz, xpAwarded, calculateScore]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !quiz) {
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

  const handleOptionChange = (value: string) => {
    const optionIndex = parseInt(value);
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
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

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsFinished(false);
    setXpAwarded(false); // Reset XP awarded flag
  };
  
  if (isFinished) {
    const score = calculateScore();
    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);
    
    // Fixed XP: 100 XP per quiz completion
    const xpEarned = 100;

    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
            <Card className="w-full max-w-3xl border-2 shadow-2xl bg-card/95 backdrop-blur-sm">
                <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
                    <CardTitle className="font-headline text-4xl text-primary mb-2">🎉 Kết quả Quiz</CardTitle>
                    <CardDescription className="text-lg">{quiz.title}</CardDescription>
                </CardHeader>
                <CardContent className="text-center pt-8">
                    <div className="mb-8 p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
                      <p className="text-7xl font-bold text-primary mb-4">
                          {score} / {total}
                      </p>
                      <p className="text-2xl text-muted-foreground mb-4">
                          {percentage}% chính xác
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                        <span className="text-2xl">⭐</span>
                        <span className="font-bold text-lg text-yellow-600 dark:text-yellow-400">+{xpEarned} XP</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      {percentage >= 80 && (
                        <p className="text-xl text-green-600 font-semibold">🌟 Xuất sắc! Bạn đã nắm vững kiến thức!</p>
                      )}
                      {percentage >= 60 && percentage < 80 && (
                        <p className="text-xl text-blue-600 font-semibold">👍 Tốt lắm! Tiếp tục cố gắng!</p>
                      )}
                      {percentage < 60 && (
                        <p className="text-xl text-orange-600 font-semibold">💪 Cần cố gắng thêm! Hãy xem lại kiến thức.</p>
                      )}
                    </div>

                    <div className="space-y-4 text-left">
                        <h3 className="font-semibold text-xl mb-4 text-center">Chi tiết câu trả lời</h3>
                        {quiz.questions.map((q, index) => {
                            const userAnswer = answers[q.id];
                            const isCorrect = userAnswer === q.answer;
                            const correctOptionText = q.options[q.answer];
                            const userAnswerText = userAnswer !== undefined ? q.options[userAnswer] : null;

                            return (
                                <div key={q.id} className={cn(
                                  "p-4 rounded-xl border-2 transition-all",
                                  isCorrect ? "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900" : "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                                )}>
                                    <p className="font-semibold mb-2 flex items-start gap-2">
                                      <span className="text-muted-foreground shrink-0">Câu {index + 1}:</span>
                                      <span>{q.prompt}</span>
                                    </p>
                                    {isCorrect ? (
                                        <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2 ml-6">
                                          <CheckCircle className="w-4 h-4 shrink-0"/> 
                                          <span>Đúng: <strong>{userAnswerText}</strong></span>
                                        </p>
                                    ) : (
                                        <div className="ml-6 space-y-1">
                                            <p className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                                              <AlertCircle className="w-4 h-4 shrink-0"/> 
                                              <span>Bạn chọn: <strong>{userAnswerText || "Chưa trả lời"}</strong></span>
                                            </p>
                                            <p className="text-sm text-green-700 dark:text-green-400">
                                              Đáp án đúng: <strong>{correctOptionText}</strong>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button onClick={restartQuiz} className="w-full sm:w-auto" variant="secondary" size="lg">
                      <Redo className="mr-2"/>Làm lại
                    </Button>
                    <Button asChild className="w-full sm:w-auto" size="lg">
                      <Link href="/quiz">Chọn quiz khác</Link>
                    </Button>
                    <Button asChild className="w-full sm:w-auto" variant="outline" size="lg">
                      <Link href="/quiz/create">Tạo quiz mới</Link>
                    </Button>
                </CardFooter>
            </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
        <Card className="w-full max-w-3xl border-2 shadow-2xl bg-card/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <Progress value={progress} className="w-full mb-6 h-3" />
            <CardTitle className="font-headline text-3xl text-primary">{quiz.title}</CardTitle>
            <CardDescription className="text-base">
              Câu {currentQuestionIndex + 1} trên {quiz.questions.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <p className="text-xl font-semibold mb-8 leading-relaxed">{currentQuestion.prompt}</p>
            <RadioGroup 
              value={selectedOption !== undefined ? selectedOption.toString() : undefined} 
              onValueChange={handleOptionChange}
            >
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <Label
                    key={index}
                    className={cn(
                        "flex items-start p-5 rounded-xl border-2 transition-all cursor-pointer",
                        selectedOption === index 
                          ? 'bg-primary/10 border-primary shadow-md' 
                          : 'bg-background/50 hover:bg-accent/10 hover:border-primary/30'
                    )}
                  >
                    <RadioGroupItem value={index.toString()} id={`opt-${index}`} className="mr-4 mt-1 shrink-0" />
                    <span className="text-base leading-relaxed">{option}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={goToPrevious} 
              disabled={currentQuestionIndex === 0}
              size="lg"
            >
              <ChevronLeft className="mr-2" />
              Câu trước
            </Button>
            <Button 
              onClick={goToNext} 
              disabled={selectedOption === undefined}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80"
            >
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