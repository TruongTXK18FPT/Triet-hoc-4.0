'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { timelineEvents, type TimelineEvent } from '@/lib/timeline-events';
import { ScrollText } from 'lucide-react';

const years = timelineEvents.map(e => parseInt(e.year));
const minYear = Math.min(...years);
const maxYear = Math.max(...years);

export default function TimelinePage() {
  const [range, setRange] = useState<[number, number]>([minYear, maxYear]);

  const filteredEvents = timelineEvents.filter(event => {
    const eventYear = parseInt(event.year);
    return eventYear >= range[0] && eventYear <= range[1];
  });

  const handleRangeChange = (newRange: [number, number]) => {
    setRange(newRange);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">
              Dòng Thời Gian Triết Học
            </h1>
            <p className="text-lg text-foreground/80 mt-4">
              Khám phá hành trình phát triển của chủ nghĩa Mác – Lênin qua các
              sự kiện và tác phẩm kinh điển.
            </p>
          </div>

          <Card className="bg-card/80 backdrop-blur-sm shadow-lg mb-12">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">
                Lọc theo khoảng thời gian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground/80">{range[0]}</span>
                <Slider
                  min={minYear}
                  max={maxYear}
                  step={1}
                  value={range}
                  onValueChange={handleRangeChange}
                  className="w-full"
                />
                <span className="font-medium text-foreground/80">{range[1]}</span>
              </div>
            </CardContent>
          </Card>

          <div className="relative pl-8 border-l-2 border-primary/20">
            {filteredEvents.map((event, index) => (
              <div key={index} className="mb-12 relative">
                <div className="absolute -left-[41px] top-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center ring-8 ring-background">
                  <ScrollText className="w-5 h-5 text-accent-foreground" />
                </div>
                <Card className="bg-card/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <p className="text-2xl font-bold text-accent font-headline">{event.year}</p>
                    <CardTitle className="font-headline text-xl text-primary pt-1">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{event.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
             {filteredEvents.length === 0 && (
                <div className="text-center text-foreground/60 py-16">
                    <p>Không có sự kiện nào trong khoảng thời gian đã chọn.</p>
                </div>
             )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
