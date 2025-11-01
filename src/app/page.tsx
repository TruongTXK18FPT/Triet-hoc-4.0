import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { Mission } from '@/components/home/mission';
import { Features } from '@/components/home/features';
import { BlogPreview } from '@/components/home/blog-preview';
import { TimelinePreview } from '@/components/home/timeline-preview';
import { Testimonials } from '@/components/home/testimonials';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Mission />
        <Features />
        <BlogPreview />
        <TimelinePreview />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
