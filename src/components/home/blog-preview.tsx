'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, FileText, Loader2 } from 'lucide-react';

type PostCard = {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string | null;
  createdAt: string;
  publishedAt?: string | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export function BlogPreview() {
  const [posts, setPosts] = useState<PostCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/blog');
        if (res.ok) {
          const data = await res.json();
          const postsArray = Array.isArray(data) ? data : [];
          // Limit to 6 posts for preview
          setPosts(postsArray.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <section id="blog-preview" className="py-20 md:py-32 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">
            Bài Viết Nổi Bật
          </h2>
          <p className="text-lg text-foreground/80 mt-4 max-w-3xl mx-auto">
            Khám phá các bài viết chuyên sâu về triết học Mác – Lênin, được chọn lọc và cập nhật thường xuyên.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-6">
              Chưa có bài viết nào. Hãy quay lại sau!
            </p>
            <Button asChild>
              <Link href="/blog">Xem Blog</Link>
            </Button>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {posts.map((post) => (
                <Card
                  key={post.slug}
                  className="bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden rounded-xl group hover:-translate-y-2"
                >
                  <CardHeader className="p-0">
                    <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                      <Image
                        src={post.coverUrl || '/favicon.ico'}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    <CardTitle className="font-headline text-xl text-primary mb-3 line-clamp-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-accent transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={post.author?.image || ''}
                          alt={post.author?.name || ''}
                        />
                        <AvatarFallback>
                          {(post.author?.name || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate max-w-[100px]">
                        {post.author?.name || 'Tác giả'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(
                          post.publishedAt || post.createdAt
                        ).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">Xem tất cả bài viết →</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

