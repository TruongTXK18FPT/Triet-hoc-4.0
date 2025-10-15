'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { PlusCircle, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type PostCard = {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string | null;
  createdAt: string;
  publishedAt?: string | null;
  author: { id: string; name: string | null; image: string | null };
};

export default function BlogListPage() {
  const [posts, setPosts] = useState<PostCard[]>([]);
  useEffect(() => {
    fetch('/api/blog').then(async (r) => setPosts(await r.json()));
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-background/50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Tri thức Blog
            </h1>
            <p className="text-lg text-foreground/80 mt-4 max-w-3xl mx-auto">
              Khám phá các bài viết chuyên sâu, phân tích và bình luận về thế giới triết học và kinh tế chính trị.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Button asChild size="lg">
              <Link href="/blog/create">
                <PlusCircle className="mr-2 h-5 w-5" />
                Viết Blog Mới
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.slug} className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden rounded-xl">
                <CardHeader className="p-0">
                  <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                    <Image
                      src={post.coverUrl || '/favicon.ico'}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                   <CardTitle className="font-headline text-xl text-primary mb-2">
                     <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">{post.title}</Link>
                   </CardTitle>
                  <CardDescription className="line-clamp-3">{post.author?.name}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                   <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author?.image || ''} alt={post.author?.name || ''} />
                            <AvatarFallback>{(post.author?.name || 'U').charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{post.author?.name}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <Calendar className="w-4 h-4"/>
                     <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN')}</span>
                   </div>
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
