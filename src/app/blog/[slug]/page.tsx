'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogPostPage() {
  const params = useParams();
  const { slug } = params;

  const [post, setPost] = React.useState<any>(null);
  const [notFound, setNotFound] = React.useState(false);
  React.useEffect(() => {
    if (!slug) return;
    fetch(`/api/blog/${slug}`)
      .then(async (r) => {
        if (!r.ok) {
          setNotFound(true);
          return null;
        }
        const data = await r.json();
        setPost(data);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
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
  
  if (!post) return null;

  // Enhanced markdown to HTML converter with better styling
  const contentHtml = (post.content || '')
    .replace(/^### (.*$)/gim, '<h3 class="font-headline text-2xl font-bold mt-10 mb-5 text-primary/90">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="font-headline text-3xl font-bold mt-12 mb-6 pb-3 border-b-2 border-primary/20 text-primary">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="font-headline text-4xl font-bold mt-8 mb-6 text-primary">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-2 py-1 bg-muted rounded text-sm font-mono text-primary">$1</code>')
    .replace(/\n\n/g, '</p><p class="mb-6">')
    .replace(/\n/g, '<br />');


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="flex-grow py-8 md:py-16">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto">
            <header className="mb-10">
               <Button asChild variant="ghost" className="mb-8 pl-1 hover:bg-primary/10 transition-colors">
                 <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại Blog
                 </Link>
               </Button>
              
              {/* Title with gradient background */}
              <div className="relative mb-8 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight mb-6">
                  {post.title}
                </h1>
                
                {/* Author and meta info */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm md:text-base">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarImage src={post.author?.image || ''} alt={post.author?.name || ''} />
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {(post.author?.name || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{post.author?.name}</span>
                      <span className="text-xs text-muted-foreground">Tác giả</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-background/60 rounded-lg border border-border">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Cover image with enhanced styling */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl ring-1 ring-border">
                <Image
                    src={post.coverUrl || '/favicon.ico'}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>

            {/* Content with improved typography */}
            <div className="bg-background/60 backdrop-blur-sm rounded-2xl border border-border p-8 md:p-12 shadow-lg">
              <div 
                className="prose prose-lg md:prose-xl max-w-none
                  prose-headings:font-headline prose-headings:scroll-mt-20
                  prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-em:text-foreground/80
                  prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-primary
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-ul:text-foreground/90 prose-ul:leading-relaxed
                  prose-ol:text-foreground/90 prose-ol:leading-relaxed
                  prose-li:text-lg prose-li:my-2
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 
                  prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:rounded-r-lg
                "
                dangerouslySetInnerHTML={{ __html: `<p class="mb-6">${contentHtml}</p>` }}
              />
            </div>

            {/* Back to blog button at bottom */}
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Khám phá thêm bài viết
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
