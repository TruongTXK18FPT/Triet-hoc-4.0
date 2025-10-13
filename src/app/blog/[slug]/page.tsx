'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { samplePosts } from '@/lib/sample-posts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Calendar, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogPostPage() {
  const params = useParams();
  const { slug } = params;

  const post = samplePosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Không tìm thấy bài viết!</AlertTitle>
            <AlertDescription>
              Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              <Button asChild variant="link" className="p-0 h-auto mt-2 block">
                <Link href="/blog">Quay lại trang Blog</Link>
              </Button>
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }
  
  // A simple markdown to HTML converter
  const contentHtml = post.content
    .replace(/^### (.*$)/gim, '<h3 class="font-headline text-xl font-bold mt-8 mb-4 text-primary">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-headline text-2xl font-bold mt-10 mb-6 border-b pb-2 text-primary">$1</h2>')
    .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 md:py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <article className="max-w-3xl mx-auto">
            <header className="mb-8">
               <Button asChild variant="ghost" className="mb-6 pl-1">
                 <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại Blog
                 </Link>
               </Button>
              <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.authorAvatar} alt={post.author} />
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
              </div>
            </header>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
                <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={post.imageHint}
                />
            </div>

            <div 
              className="prose prose-lg max-w-none text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
