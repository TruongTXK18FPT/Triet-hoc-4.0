'use client';

import Image from 'next/image';
import leninBg from '@/assets/leninBackground.jpg';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  // Background now uses local asset `leninBackground.jpg` for consistency

  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
      <Image
        src={leninBg}
        alt="Lenin background"
        fill
        className="object-cover scale-105"
        priority
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent"></div>

      {/* Light beam effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-radial-soft animate-pulse-slow"></div>

      <div className="relative z-10 p-4 animate-fade-in-up">
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
          Hiểu triết học – Hiểu thế giới.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-white/80">
          Triết Học 4.0 giúp bạn học Mác – Lênin dễ dàng hơn với AI.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-transform transform hover:scale-105">
            <Link href="#features">Bắt đầu học</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-transform transform hover:scale-105 backdrop-blur-sm">
            <Link href="/roadmap-ai">Khám phá AI Roadmap</Link>
          </Button>
        </div>
      </div>
      {/* styles moved to globals.css utilities */}
    </section>
  );
}
