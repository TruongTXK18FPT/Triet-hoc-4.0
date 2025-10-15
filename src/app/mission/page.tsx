'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Heart, BookOpen, Lightbulb } from 'lucide-react';

export default function MissionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <span className="text-amber-800 font-semibold">Sứ mệnh của chúng tôi</span>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-6">
              Khai sáng tư duy – Gắn kết tri thức
            </h1>
            <p className="text-2xl md:text-3xl text-amber-800 font-semibold max-w-4xl mx-auto">
              Nuôi dưỡng lý tưởng nhân văn trong thời đại số.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto space-y-8">
            <Card className="bg-white/95 backdrop-blur shadow-2xl border-2 border-amber-200">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary mb-4">🧭 Sứ mệnh của Triết học 4.0</h2>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      Trong thời đại mà công nghệ và tốc độ đôi khi lấn át chiều sâu tư duy, <strong>Triết học 4.0</strong> ra đời với một sứ mệnh:
                    </p>
                  </div>
                </div>

                <div className="space-y-6 mt-8">
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                    <span className="text-3xl">🔸</span>
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900 mb-2">Khai sáng trí tuệ</h3>
                      <p className="text-slate-700">
                        Giúp sinh viên và người học tiếp cận triết học, kinh tế học và chủ nghĩa xã hội khoa học theo cách gần gũi, sinh động và có tính ứng dụng.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
                    <span className="text-3xl">🔸</span>
                    <div>
                      <h3 className="font-semibold text-lg text-purple-900 mb-2">Kết nối giá trị cổ điển và trí tuệ hiện đại</h3>
                      <p className="text-slate-700">
                        Đưa tinh thần Mác – Lênin, Ăng-ghen, và Hồ Chí Minh hòa quyện cùng tư duy AI – dữ liệu – sáng tạo số.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-l-4 border-amber-500">
                    <span className="text-3xl">🔸</span>
                    <div>
                      <h3 className="font-semibold text-lg text-amber-900 mb-2">Truyền cảm hứng học tập nhân văn</h3>
                      <p className="text-slate-700">
                        Giúp con người không chỉ học để hiểu, mà còn hiểu để sống tốt hơn, tự tin hơn, và nhân ái hơn.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl border-2 border-amber-300">
                  <div className="flex items-start gap-4">
                    <Heart className="h-8 w-8 text-amber-700 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xl text-amber-900 leading-relaxed font-medium italic">
                        Với <strong>Triết học 4.0</strong>, triết học không còn là "môn học khô khan", mà là nghệ thuật tư duy về cuộc sống, 
                        là <strong>"ánh sáng lý trí"</strong> soi rọi hành trình con người trong thời đại 4.0.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="font-semibold text-xl mb-2">Học tập</h3>
                  <p className="text-blue-100">Khám phá tri thức triết học với AI</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="font-semibold text-xl mb-2">Sáng tạo</h3>
                  <p className="text-purple-100">Tư duy phản biện và đổi mới</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="font-semibold text-xl mb-2">Nhân văn</h3>
                  <p className="text-amber-100">Giá trị con người là trung tâm</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
