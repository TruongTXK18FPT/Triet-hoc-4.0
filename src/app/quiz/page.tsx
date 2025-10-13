'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { PlusCircle, BookOpen } from 'lucide-react';
import { sampleQuizzes } from '@/lib/sample-quizzes';

export default function QuizListPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Kho tàng Quiz Triết học
            </h1>
            <p className="text-lg text-foreground/80 mt-4">
              Chọn một chủ đề để kiểm tra kiến thức hoặc tạo quiz của riêng bạn để chia sẻ với cộng đồng.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Button asChild size="lg">
              <Link href="/quiz/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                Tạo Quiz Mới
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sampleQuizzes.map((quiz) => (
              <Card key={quiz.slug} className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary">{quiz.title}</CardTitle>
                  <CardDescription className="pt-2">{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{quiz.questions.length} câu hỏi</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/quiz/${quiz.slug}`}>Bắt đầu làm bài</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
