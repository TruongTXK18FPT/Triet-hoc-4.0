import { BrainCircuit, Puzzle, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const missionCards = [
  {
    icon: <BrainCircuit className="w-10 h-10 text-accent mb-4" />,
    title: 'AI Tạo Lộ Trình Học',
    description: 'Công nghệ AI tiên tiến xây dựng lộ trình học tập được cá nhân hóa, giúp bạn tiếp cận kiến thức một cách logic và hiệu quả.',
  },
  {
    icon: <Puzzle className="w-10 h-10 text-accent mb-4" />,
    title: 'Quiz Ôn Tập Trí Tuệ',
    description: 'Các câu hỏi trắc nghiệm thông minh giúp củng cố kiến thức, nhận diện lỗ hổng và ôn tập một cách chủ động.',
  },
  {
    icon: <Users className="w-10 h-10 text-accent mb-4" />,
    title: 'Cộng Đồng Chia Sẻ',
    description: 'Tham gia cộng đồng học tập, trao đổi, và cùng nhau phát triển tư duy triết học trong một môi trường cởi mở.',
  },
];

export function Mission() {
  return (
    <section id="mission" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">Sứ Mệnh Của Triết Học 4.0</h2>
          <p className="text-lg text-foreground/80">
            Chúng tôi tin rằng triết học không phải là những trang sách khô khan. Bằng cách kết hợp giữa chiều sâu tư tưởng và sức mạnh công nghệ, Triết Học 4.0 mang đến một phương pháp học tập hiện đại, truyền cảm hứng và dễ dàng tiếp cận cho mọi sinh viên.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {missionCards.map((card, index) => (
            <Card key={index} className="text-center p-6 border-transparent shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 rounded-xl bg-white/50">
              <div className="flex justify-center">{card.icon}</div>
              <CardHeader className="p-0">
                <CardTitle className="font-headline text-2xl text-primary mt-2">{card.title}</CardTitle>
                <CardDescription className="text-foreground/70 mt-3 text-base">{card.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
