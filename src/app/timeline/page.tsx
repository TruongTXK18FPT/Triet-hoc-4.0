'use client';

import { useState, useTransition } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { timelineEvents, type TimelineEvent } from '@/lib/timeline-events';
import { ScrollText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { explainConcept } from '@/ai/flows/explain-philosophical-concepts';
import type { ExplainConceptOutput } from '@/ai/flows/explain-philosophical-concepts';

const years = timelineEvents.map(e => parseInt(e.year));
const minYear = Math.min(...years);
const maxYear = Math.max(...years);

export default function TimelinePage() {
  const [range, setRange] = useState<[number, number]>([minYear, maxYear]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [explanation, setExplanation] = useState<ExplainConceptOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredEvents = timelineEvents.filter(event => {
    const eventYear = parseInt(event.year);
    return eventYear >= range[0] && eventYear <= range[1];
  });

  const handleRangeChange = (newRange: [number, number]) => {
    setRange(newRange);
  };

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block p-3 bg-amber-100 rounded-full mb-4 shadow-lg">
              <ScrollText className="w-12 h-12 text-amber-700" />
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-700 via-orange-600 to-rose-600 bg-clip-text text-transparent tracking-tight">
              Dòng Thời Gian Triết Học
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mt-4 max-w-2xl mx-auto">
              Khám phá hành trình phát triển của chủ nghĩa Mác – Lênin qua các
              sự kiện và tác phẩm kinh điển.
            </p>
          </div>

          <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-2 border-amber-200/50 mb-12">
            <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
              <CardTitle className="font-headline text-xl text-amber-800 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Lọc theo khoảng thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <span className="font-bold text-amber-800 text-lg min-w-[60px]">{range[0]}</span>
                <Slider
                  min={minYear}
                  max={maxYear}
                  step={1}
                  value={range}
                  onValueChange={handleRangeChange}
                  className="w-full"
                />
                <span className="font-bold text-amber-800 text-lg min-w-[60px]">{range[1]}</span>
              </div>
              <p className="text-sm text-foreground/60 mt-3 text-center">
                Đang hiển thị {filteredEvents.length} sự kiện
              </p>
            </CardContent>
          </Card>

          <div className="relative mx-auto max-w-4xl">
            {/* Vertical Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-300/80 via-orange-300/60 to-rose-300/80 rounded-full shadow-lg" aria-hidden />
            
            {filteredEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div 
                  key={index} 
                  className={`relative mb-12 flex ${isLeft ? 'justify-start pr-[52%]' : 'justify-end pl-[52%]'}`}
                  style={{
                    animation: `fadeInScale 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-6 z-10 group">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-8 ring-background shadow-xl flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      </div>
                      {/* Animated Pulse */}
                      <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-20"></div>
                    </div>
                  </div>

                  {/* Event Card */}
                  <Card 
                    className={`
                      w-full bg-white/95 backdrop-blur-xl 
                      border-2 border-amber-200/50 
                      shadow-xl hover:shadow-2xl 
                      hover:border-amber-300 
                      transition-all duration-300 
                      hover:-translate-y-2
                      ${isLeft ? 'mr-8' : 'ml-8'}
                      relative overflow-hidden
                      group
                    `}
                  >
                    {/* Decorative corner accent */}
                    <div className={`absolute top-0 ${isLeft ? 'right-0' : 'left-0'} w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity`}>
                      <div className={`absolute ${isLeft ? 'top-2 right-2' : 'top-2 left-2'} w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500`}></div>
                    </div>

                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {event.year.slice(-2)}
                        </div>
                        <p className="text-3xl font-extrabold text-amber-700 font-headline">{event.year}</p>
                      </div>
                      <CardTitle className="font-headline text-xl md:text-2xl text-amber-900 pt-1 leading-tight group-hover:text-amber-700 transition-colors">
                        {event.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80 leading-relaxed text-base">{event.description}</p>
                    </CardContent>
                    <CardFooter className="border-t border-amber-100 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
                      <Button 
                        variant="link" 
                        className="text-amber-700 hover:text-amber-900 font-semibold p-0 group/button" 
                        onClick={() => handleExplainClick(event)}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5 group-hover/button:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span>AI Giải thích chi tiết</span>
                          <svg className="w-4 h-4 group-hover/button:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              );
            })}
             
            {filteredEvents.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <div className="inline-block p-4 bg-amber-100 rounded-full mb-4">
                  <svg className="w-16 h-16 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl text-foreground/60 font-semibold">Không có sự kiện nào trong khoảng thời gian đã chọn.</p>
                <p className="text-sm text-foreground/50 mt-2">Hãy điều chỉnh khoảng thời gian để xem thêm sự kiện</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
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
    </div>
  );
}
