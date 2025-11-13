import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/home/hero';
import { Mission } from '@/components/home/mission';
import { Features } from '@/components/home/features';
import { BlogPreview } from '@/components/home/blog-preview';
import { TimelinePreview } from '@/components/home/timeline-preview';
import { Testimonials } from '@/components/home/testimonials';
import { CheckInButton } from '@/components/gamification/CheckInButton';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* Check-in Section */}
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-md mx-auto">
            <CheckInButton />
          </div>
        </section>
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
