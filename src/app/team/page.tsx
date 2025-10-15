'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Code, BookOpen, Palette, Brain, Globe } from 'lucide-react';

const teamMembers = [
  { name: 'Nhà phát triển AI & hệ thống', icon: Brain, color: 'from-blue-500 to-indigo-600', description: 'Thiết kế kiến trúc học máy và giao diện đối thoại để AI hiểu và phản hồi triết học một cách tự nhiên, chuẩn xác.' },
  { name: 'Cố vấn học thuật', icon: BookOpen, color: 'from-purple-500 to-pink-600', description: 'Những giảng viên, sinh viên xuất sắc chuyên ngành triết học Mác–Lênin, kinh tế chính trị và CNXH khoa học – đảm bảo nội dung chính xác, khoa học, giàu giá trị nhân văn.' },
  { name: 'Nhà thiết kế & sáng tạo', icon: Palette, color: 'from-amber-500 to-orange-600', description: 'Mang tinh thần triết học vào hình ảnh, màu sắc, biểu tượng và trải nghiệm người dùng.' },
];

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-purple-800 font-semibold">Đội ngũ của chúng tôi</span>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-6">
              Những người kiến tạo tri thức
            </h1>
            <p className="text-xl md:text-2xl text-purple-700 max-w-4xl mx-auto">
              Kết nối giữa triết học, công nghệ và con người.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto space-y-8">
            <Card className="bg-white/95 backdrop-blur shadow-2xl border-2 border-purple-200">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-8">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary mb-4">👑 Đội ngũ đứng sau Triết học 4.0</h2>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      Chúng tôi là nhóm sinh viên và nhà phát triển trẻ đến từ <strong>FPT University</strong>, mang trong mình niềm tin rằng 
                      tri thức và công nghệ có thể song hành để tạo nên giá trị nhân văn.
                    </p>
                  </div>
                </div>

                {/* Team Roles */}
                <div className="space-y-6 mt-12">
                  <h3 className="text-2xl font-bold text-primary mb-6">Đội ngũ Triết học 4.0 bao gồm:</h3>
                  
                  {teamMembers.map((member, index) => {
                    const Icon = member.icon;
                    return (
                      <Card key={index} className="bg-gradient-to-r from-white to-slate-50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${member.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                              <Icon className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-semibold text-slate-900 mb-2">{member.name}</h4>
                              <p className="text-slate-700 leading-relaxed">{member.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Vision */}
                <div className="mt-12 p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-300">
                  <div className="flex items-start gap-4 mb-6">
                    <Globe className="h-8 w-8 text-purple-700 flex-shrink-0" />
                    <h3 className="text-2xl font-bold text-purple-900">🌍 Tầm nhìn chung</h3>
                  </div>
                  <p className="text-lg text-purple-800 leading-relaxed">
                    Mỗi thành viên <strong>Triết học 4.0</strong> tin rằng AI không thay thế con người – 
                    mà giúp con người hiểu sâu hơn về chính mình.
                  </p>
                </div>

                {/* Quote */}
                <div className="mt-8 p-6 border-l-4 border-amber-500 bg-amber-50 rounded-r-xl">
                  <p className="text-xl text-amber-900 italic font-medium mb-2">
                    "Tri thức là sức mạnh, nhưng trí tuệ là ánh sáng dẫn đường."
                  </p>
                  <p className="text-amber-700 font-semibold">— Triết học 4.0</p>
                </div>
              </CardContent>
            </Card>

            {/* Join Us CTA */}
            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-3xl font-bold mb-4">Tham gia cùng chúng tôi</h3>
                <p className="text-xl text-purple-100 mb-6">
                  Bạn có đam mê với triết học, công nghệ và giáo dục?
                </p>
                <a 
                  href="/careers" 
                  className="inline-block px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg"
                >
                  Xem cơ hội nghề nghiệp →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
