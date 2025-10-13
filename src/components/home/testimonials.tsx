import Image from 'next/image';
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
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 'student-1',
    name: 'Nguyễn Văn An',
    role: 'Sinh viên năm 2',
    quote: '"Triết Học 4.0 đã thay đổi hoàn toàn cách mình học triết. AI Roadmap thực sự hiệu quả, giúp mình hệ thống hóa kiến thức một cách logic. Không còn cảm thấy môn này khô khan nữa!"',
  },
  {
    id: 'student-2',
    name: 'Trần Thị Bình',
    role: 'Sinh viên năm 3',
    quote: '"Các bài quiz rất hay và bám sát chương trình. Nhờ có LeninBot, mình có thể hỏi đáp mọi lúc mọi nơi, rất tiện lợi cho việc ôn thi cuối kỳ. Highly recommended!"',
  },
  {
    id: 'student-3',
    name: 'Lê Minh Cường',
    role: 'Sinh viên năm 1',
    quote: '"Là sinh viên năm nhất, mình khá bỡ ngỡ với môn triết. Nhưng với Triết Học 4.0, mình đã tìm thấy niềm vui và sự hứng thú. Giao diện đẹp, nội dung dễ hiểu, tuyệt vời!"',
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-b from-transparent to-white/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Sinh Viên Nói Gì Về Chúng Tôi?</h2>
          <p className="text-lg text-foreground/80 mt-4 max-w-3xl mx-auto">
            Những chia sẻ chân thực từ cộng đồng sinh viên đã và đang trải nghiệm Triết Học 4.0.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => {
              const studentImage = PlaceHolderImages.find(p => p.id === testimonial.id);
              return (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="flex flex-col h-full justify-between shadow-lg rounded-xl overflow-hidden bg-card/80 backdrop-blur-sm">
                      <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                        <div className="flex text-yellow-500 mb-4">
                            {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
                        </div>
                        <p className="text-foreground/80 italic mb-6 flex-grow">{testimonial.quote}</p>
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-4">
                             {studentImage && <AvatarImage src={studentImage.imageUrl} alt={testimonial.name} data-ai-hint={studentImage.imageHint} />}
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-primary">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
