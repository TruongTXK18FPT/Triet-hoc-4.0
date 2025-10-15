'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, 'Tiêu đề cần có ít nhất 3 ký tự').max(100).optional(),
  content: z.string().min(10, 'Nội dung cần có ít nhất 10 ký tự').max(1000),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

type Review = {
  id: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};

export default function ReviewPage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch('/api/review?limit=50');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(values: ReviewFormValues) {
    if (status !== 'authenticated') {
      toast({ title: 'Cần đăng nhập', description: 'Vui lòng đăng nhập để viết đánh giá.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: selectedRating || values.rating,
          title: values.title,
          content: values.content,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Không thể tạo đánh giá');
      }

      toast({ title: 'Thành công!', description: 'Đánh giá của bạn đã được gửi.' });
      form.reset();
      setSelectedRating(0);
      fetchReviews();
    } catch (e: any) {
      toast({ title: 'Lỗi', description: e.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
              💬 Đánh Giá Của Cộng Đồng
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Chia sẻ trải nghiệm của bạn về Triết Học 4.0 và đọc những nhận xét từ cộng đồng sinh viên.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <Card className="bg-white/95 backdrop-blur shadow-xl sticky top-24">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                  <CardTitle className="font-headline text-2xl text-primary">Viết Đánh Giá</CardTitle>
                  <CardDescription>Chia sẻ suy nghĩ của bạn với chúng tôi</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {status === 'authenticated' ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Star Rating */}
                        <div>
                          <FormLabel>Đánh giá</FormLabel>
                          <div className="flex gap-2 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => {
                                  setSelectedRating(star);
                                  form.setValue('rating', star);
                                }}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`h-8 w-8 ${
                                    star <= (hoveredRating || selectedRating || form.watch('rating'))
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tiêu đề (tùy chọn)</FormLabel>
                              <FormControl>
                                <Input placeholder="Tóm tắt đánh giá của bạn..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nội dung</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Viết chi tiết về trải nghiệm của bạn..."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>Tối thiểu 10 ký tự</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full" disabled={submitting}>
                          {submitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Đang gửi...
                            </>
                          ) : (
                            'Gửi Đánh Giá'
                          )}
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Bạn cần đăng nhập để viết đánh giá
                      </p>
                      <Button asChild>
                        <Link href="/login">Đăng nhập</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Tất cả đánh giá ({reviews.length})
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : reviews.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur">
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">
                      Chưa có đánh giá nào. Hãy là người đầu tiên!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="bg-white/95 backdrop-blur shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.user.image} />
                          <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                            {review.user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg text-primary">
                                {review.user.name || 'Người dùng'}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? 'fill-yellow-400 text-yellow-400'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {review.title && (
                            <h4 className="font-semibold mt-3 text-amber-900">{review.title}</h4>
                          )}
                          <p className="mt-2 text-foreground/80 leading-relaxed">{review.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
