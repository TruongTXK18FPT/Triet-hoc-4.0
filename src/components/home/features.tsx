import {
  BrainCircuit,
  Puzzle,
  FileText,
  ScrollText,
  Bot,
  LayoutDashboard,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

const features = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-accent" />,
    title: 'AI Roadmap',
    description: 'Lộ trình học cá nhân hóa, tối ưu hóa quá trình tiếp thu kiến thức của bạn.',
    href: '/roadmap-ai',
  },
  {
    icon: <Puzzle className="w-8 h-8 text-accent" />,
    title: 'Quiz Zone',
    description: 'Kiểm tra và củng cố kiến thức qua các bài quiz thông minh, đầy thử thách.',
    href: '/quiz',
  },
  {
    icon: <FileText className="w-8 h-8 text-accent" />,
    title: 'Blog',
    description: 'Khám phá các bài viết chuyên sâu, phân tích đa chiều về triết học Mác – Lênin.',
    href: '#',
  },
  {
    icon: <ScrollText className="w-8 h-8 text-accent" />,
    title: 'Timeline',
    description: 'Theo dõi dòng chảy lịch sử của các tư tưởng triết học qua các cột mốc quan trọng.',
    href: '/timeline',
  },
  {
    icon: <Bot className="w-8 h-8 text-accent" />,
    title: 'Chatbot "LeninBot"',
    description: 'Trò chuyện và giải đáp thắc mắc mọi lúc, mọi nơi với trợ lý AI chuyên nghiệp.',
    href: '#',
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-accent" />,
    title: 'Dashboard Analytics',
    description: 'Theo dõi tiến độ học tập của bạn qua các biểu đồ và số liệu trực quan.',
    href: '#',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-white/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Tính Năng Nổi Bật</h2>
          <p className="text-lg text-foreground/80 mt-4 max-w-3xl mx-auto">
            Khám phá những công cụ mạnh mẽ giúp bạn chinh phục triết học một cách hiệu quả và thú vị.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href} className="block">
                <Card className="h-full bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="font-headline text-2xl text-primary">{feature.title}</CardTitle>
                    <CardDescription className="pt-2 text-foreground/70">{feature.description}</CardDescription>
                </CardHeader>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
