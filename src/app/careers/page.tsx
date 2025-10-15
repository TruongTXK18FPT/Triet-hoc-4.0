'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Code, Brain, Palette, PenTool, CheckCircle, Mail, Heart } from 'lucide-react';

const positions = [
  { 
    title: 'Front-end Developer', 
    tech: 'Next.js, Tailwind', 
    icon: Code, 
    color: 'from-blue-500 to-indigo-600',
    emoji: '🧑‍💻'
  },
  { 
    title: 'Back-end Developer', 
    tech: 'Spring Boot / Node.js', 
    icon: Code, 
    color: 'from-green-500 to-emerald-600',
    emoji: '⚙️'
  },
  { 
    title: 'AI / NLP Research Intern', 
    tech: 'Chatbot & LLM Tuning', 
    icon: Brain, 
    color: 'from-purple-500 to-pink-600',
    emoji: '🧠'
  },
  { 
    title: 'Content Writer', 
    tech: 'Triết học học thuật & truyền thông', 
    icon: PenTool, 
    color: 'from-amber-500 to-orange-600',
    emoji: '✍️'
  },
  { 
    title: 'UI/UX Designer', 
    tech: 'Triết học & Giáo dục số', 
    icon: Palette, 
    color: 'from-pink-500 to-rose-600',
    emoji: '🎨'
  },
];

const requirements = [
  'Tư duy phản biện và lòng yêu tri thức',
  'Đam mê triết học, khoa học xã hội hoặc công nghệ AI',
  'Sự chủ động, trung thực và tinh thần hợp tác',
];

const benefits = [
  'Môi trường sáng tạo – học thuật – trẻ trung',
  'Tham gia xây dựng sản phẩm AI học thuật đầu tiên về triết học tại Việt Nam',
  'Cơ hội kết nối với các chuyên gia, giảng viên và startup AI giáo dục',
];

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-semibold">Tuyển dụng</span>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-6">
              Cùng kiến tạo tương lai
            </h1>
            <p className="text-xl md:text-2xl text-blue-700 max-w-4xl mx-auto">
              của triết học và trí tuệ nhân tạo tại Việt Nam.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="bg-white/95 backdrop-blur shadow-2xl border-2 border-blue-200">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-8">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary mb-4">💼 Cơ hội nghề nghiệp cùng Triết học 4.0</h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-4">
                      Chúng tôi tin rằng triết học không chỉ nằm trong sách vở – mà còn trong công nghệ, trong từng dòng code, 
                      trong từng ý tưởng hướng tới nhân loại tốt đẹp hơn.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      Nếu bạn là người trẻ yêu triết học, công nghệ, sáng tạo hoặc giáo dục – <strong>Triết học 4.0</strong> luôn chào đón bạn.
                    </p>
                  </div>
                </div>

                {/* Open Positions */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                    🔹 Vị trí đang mở
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {positions.map((position, index) => {
                      const Icon = position.icon;
                      return (
                        <Card key={index} className="bg-gradient-to-br from-white to-slate-50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${position.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                <span className="text-2xl">{position.emoji}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xl font-semibold text-slate-900 mb-2">{position.title}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {position.tech}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                  <h3 className="text-2xl font-bold text-purple-900 mb-6">🔹 Điều chúng tôi tìm kiếm</h3>
                  <div className="space-y-3">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-lg text-purple-800">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mt-8 p-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
                  <h3 className="text-2xl font-bold text-amber-900 mb-6">🔹 Quyền lợi</h3>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Heart className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-lg text-amber-800">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-12 p-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl border-2 border-blue-300 text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-blue-700" />
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">👉 Gửi CV hoặc portfolio của bạn về:</h3>
                  <a 
                    href="mailto:tranxuantin1234@gmail.com" 
                    className="inline-block text-2xl font-bold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-4"
                  >
                    tranxuantin1234@gmail.com
                  </a>
                </div>

                {/* Quote */}
                <div className="mt-8 p-6 border-l-4 border-amber-500 bg-amber-50 rounded-r-xl">
                  <p className="text-xl text-amber-900 italic font-medium mb-2">
                    "Hãy để tri thức và công nghệ cùng soi sáng con đường nhân văn."
                  </p>
                  <p className="text-amber-700 font-semibold">— Đội ngũ Triết học 4.0</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
