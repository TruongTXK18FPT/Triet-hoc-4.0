'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { PlusCircle, User, Calendar } from 'lucide-react';
import { samplePosts } from '@/lib/sample-posts';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function BlogListPage() {
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
            {samplePosts.map((post) => (
              <Card key={post.slug} className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden rounded-xl">
                <CardHeader className="p-0">
                  <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      data-ai-hint={post.imageHint}
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                   <CardTitle className="font-headline text-xl text-primary mb-2">
                     <Link href={`/blog/${post.slug}`} className="hover:text-accent transition-colors">{post.title}</Link>
                   </CardTitle>
                  <CardDescription className="line-clamp-3">{post.description}</CardDescription>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                   <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={post.authorAvatar} alt={post.author} />
                            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{post.author}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <Calendar className="w-4 h-4"/>
                     <span>{post.date}</span>
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
