'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/review?limit=5');
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
    fetchReviews();
  }, []);

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-b from-transparent to-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Sinh Viên Nói Gì Về Chúng Tôi?</h2>
          <p className="text-lg text-foreground/80 mt-4 max-w-3xl mx-auto">
            Những chia sẻ chân thực từ cộng đồng sinh viên đã và đang trải nghiệm Triết Học 4.0.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-6">
              Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!
            </p>
            <Button asChild>
              <Link href="/review">Viết đánh giá</Link>
            </Button>
          </div>
        ) : (
          <>
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full max-w-4xl mx-auto"
            >
              <CarouselContent>
                {reviews.map((review) => (
                  <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col h-full justify-between shadow-lg rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                          <div className="flex text-yellow-500 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                fill={star <= review.rating ? "currentColor" : "none"} 
                                className="w-5 h-5" 
                              />
                            ))}
                          </div>
                          {review.title && (
                            <h4 className="font-semibold text-primary mb-2">{review.title}</h4>
                          )}
                          <p className="text-foreground/80 italic mb-6 flex-grow line-clamp-4">
                            "{review.content}"
                          </p>
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                              <AvatarImage src={review.user.image} alt={review.user.name} />
                              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                                {review.user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-primary">{review.user.name || 'Người dùng'}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
            
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href="/review">
                  Xem tất cả đánh giá →
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
