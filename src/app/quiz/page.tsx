'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { PlusCircle, BookOpen, Loader2, User, Calendar, Lock, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

type Quiz = {
  id: string;
  title: string;
  isPublic: boolean;
  createdAt: string;
  questions: Array<{
    id: string;
    prompt: string;
    options: string[];
    answer: number;
  }>;
  author: {
    id: string;
    name: string | null;
  };
};

export default function QuizListPage() {
  const [publicQuizzes, setPublicQuizzes] = useState<Quiz[]>([]);
  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    fetchQuizzes();
  }, [session]);

  async function fetchQuizzes() {
    setIsLoading(true);
    try {
      // Fetch public quizzes
      const publicResponse = await fetch('/api/quiz?isPublic=true');
      if (publicResponse.ok) {
        const data = await publicResponse.json();
        setPublicQuizzes(data.quizzes || []);
      }

      // Fetch user's quizzes if logged in
      if (session?.user) {
        const userResponse = await fetch('/api/quiz');
        if (userResponse.ok) {
          const data = await userResponse.json();
          const userQuizzes = data.quizzes || [];
          setMyQuizzes(userQuizzes);
        }
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const QuizGrid = ({ quizzes, emptyMessage }: { quizzes: Quiz[], emptyMessage: string }) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      );
    }

    if (quizzes.length === 0) {
      return (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-xl text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col border-2 hover:border-primary/50 group">
            <CardHeader className="bg-gradient-to-br from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/15 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <Badge variant={quiz.isPublic ? "default" : "secondary"} className="mb-2">
                  {quiz.isPublic ? (
                    <><Globe className="w-3 h-3 mr-1" /> Công khai</>
                  ) : (
                    <><Lock className="w-3 h-3 mr-1" /> Riêng tư</>
                  )}
                </Badge>
              </div>
              <CardTitle className="font-headline text-xl text-primary line-clamp-2 group-hover:text-primary/80 transition-colors">
                {quiz.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow pt-4 space-y-3">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="font-medium">{quiz.questions.length} câu hỏi</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{quiz.author.name || 'Ẩn danh'}</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(quiz.createdAt)}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                <Link href={`/quiz/${quiz.id}`}>Bắt đầu làm bài</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Kho tàng Quiz Triết học
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kiểm tra kiến thức triết học của bạn hoặc chia sẻ quiz với cộng đồng
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              <Link href="/quiz/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                Tạo Quiz Mới
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="public" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="public" className="text-base">
                <Globe className="w-4 h-4 mr-2" />
                Quiz Công Khai
              </TabsTrigger>
              <TabsTrigger value="my" className="text-base" disabled={!session}>
                <User className="w-4 h-4 mr-2" />
                Quiz Của Tôi
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="public" className="mt-8">
              <QuizGrid 
                quizzes={publicQuizzes} 
                emptyMessage="Chưa có quiz công khai nào. Hãy là người đầu tiên tạo quiz!" 
              />
            </TabsContent>
            
            <TabsContent value="my" className="mt-8">
              {session ? (
                <QuizGrid 
                  quizzes={myQuizzes} 
                  emptyMessage="Bạn chưa tạo quiz nào. Bắt đầu tạo quiz đầu tiên!" 
                />
              ) : (
                <div className="text-center py-20">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-xl text-muted-foreground mb-4">Vui lòng đăng nhập để xem quiz của bạn</p>
                  <Button asChild>
                    <Link href="/login">Đăng nhập</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}