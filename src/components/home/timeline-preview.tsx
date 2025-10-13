'use client';

import { useState, useTransition } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { explainConcept } from '@/ai/flows/explain-philosophical-concepts';
import type { ExplainConceptOutput } from '@/ai/flows/explain-philosophical-concepts';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

const timelineEvents: TimelineEvent[] = [
  {
    year: '1848',
    title: 'Tuyên ngôn của Đảng Cộng sản',
    description: 'Marx và Engels xuất bản tác phẩm, đặt nền móng cho chủ nghĩa cộng sản.',
  },
  {
    year: '1867',
    title: 'Tư bản, Quyển I',
    description: 'Marx xuất bản công trình phân tích sâu sắc về phương thức sản xuất tư bản chủ nghĩa.',
  },
  {
    year: '1902',
    title: 'Làm gì?',
    description: 'Lenin xuất bản tác phẩm về vai trò của đảng tiên phong trong cách mạng vô sản.',
  },
  {
    year: '1916',
    title: 'Chủ nghĩa đế quốc, giai đoạn tột cùng của chủ nghĩa tư bản',
    description: 'Lenin phân tích sự phát triển của chủ nghĩa tư bản thành chủ nghĩa đế quốc.',
  },
  {
    year: '1917',
    title: 'Cách mạng Tháng Mười Nga',
    description: 'Cuộc cách mạng vô sản đầu tiên trên thế giới thành công, do Đảng Bolshevik lãnh đạo.',
  },
  {
    year: '1920',
    title: 'Bệnh ấu trĩ "tả" của chủ nghĩa cộng sản',
    description: 'Lenin phê phán các khuynh hướng tả khuynh trong phong trào cộng sản quốc tế.',
  },
];

export function TimelinePreview() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [explanation, setExplanation] = useState<ExplainConceptOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleExplainClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
    setExplanation(null);
    startTransition(async () => {
      const result = await explainConcept({ concept: event.title });
      setExplanation(result);
    });
  };

  return (
    <section id="timeline" className="py-20 md:py-32" style={{backgroundColor: 'rgba(211, 204, 201, 0.5)'}}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Dòng Thời Gian Triết Học</h2>
          <p className="text-lg text-foreground/80 mt-4 max-w-3xl mx-auto">
            Một hành trình qua các sự kiện và tư tưởng lớn đã định hình nên chủ nghĩa Mác – Lênin.
          </p>
        </div>

        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent className="-ml-4">
            {timelineEvents.map((event) => (
              <CarouselItem key={event.title} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="flex flex-col h-full overflow-hidden rounded-xl shadow-md bg-card/70 backdrop-blur-sm border-coffee-dark/20" style={{'--tw-shadow-color': 'hsl(var(--primary) / 0.1)'} as React.CSSProperties}>
                    <CardHeader>
                      <p className="text-4xl font-bold text-accent font-headline">{event.year}</p>
                      <CardTitle className="font-headline text-xl text-primary pt-2">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-foreground/70">{event.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="link" className="text-accent font-semibold p-0" onClick={() => handleExplainClick(event)}>
                        AI Explain &rarr;
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary">{selectedEvent?.title}</DialogTitle>
            <DialogDescription>{selectedEvent?.year}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="prose prose-sm max-w-none pr-6 -mr-6">
            {isPending ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="ml-4 text-foreground/70">AI đang tư duy...</p>
              </div>
            ) : (
              <div className="text-foreground/90 whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: explanation?.explanation ?? ''}}/>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
}
