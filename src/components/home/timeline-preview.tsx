'use client';

import { useState, useTransition, useEffect } from 'react';
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
import type { TimelineEvent } from '@/lib/timeline-events';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';

export function TimelinePreview() {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [explanation, setExplanation] = useState<ExplainConceptOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  
  useEffect(() => {
    async function fetchTimelineEvents() {
      try {
        const res = await fetch('/api/timeline');
        if (res.ok) {
          const events = await res.json();
          setTimelineEvents(events);
        }
      } catch (error) {
        console.error('Error fetching timeline events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTimelineEvents();
  }, []);
  
  // Get first 6 events for preview
  const previewEvents = timelineEvents.slice(0, 6);

  const handleExplainClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
    setExplanation(null);
    startTransition(async () => {
      const result = await explainConcept({ concept: `${event.title} (${event.year})` });
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

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : previewEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-6">
              Chưa có sự kiện timeline nào.
            </p>
          </div>
        ) : (
        <Carousel className="w-full max-w-6xl mx-auto animate-fade-in-up">
          <CarouselContent className="-ml-4">
            {previewEvents.map((event) => (
              <CarouselItem key={event.title} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="flex flex-col h-full overflow-hidden rounded-xl shadow-md bg-card/70 backdrop-blur-sm border-coffee-dark/20 transition-transform duration-500 hover:-translate-y-1" style={{'--tw-shadow-color': 'hsl(var(--primary) / 0.1)'} as React.CSSProperties}>
                    <CardHeader>
                      <p className="text-4xl font-bold text-accent font-headline">{event.year}</p>
                      <CardTitle className="font-headline text-xl text-primary pt-2">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-foreground/70">{event.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="link" className="text-accent font-semibold p-0 hover:translate-x-1 transition-transform" onClick={() => handleExplainClick(event)}>
                        AI Explain →
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
        )}
        <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
                <Link href="/timeline">Xem Toàn Bộ Dòng Thời Gian</Link>
            </Button>
        </div>
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
              <div className="text-foreground/90 whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: explanation?.explanation.replaceAll('\n', '<br />') ?? ''}}/>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
}
