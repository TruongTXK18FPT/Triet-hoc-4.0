'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { 
  BookOpen, 
  Target, 
  Users, 
  Lightbulb, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  Sparkles,
  Brain,
  Code,
  MessageSquare,
  Map,
  TrendingUp,
  QrCode,
  ScanLine,
  ZoomIn
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/proposal.webp"
            alt="Proposal Background"
            fill
            className="object-cover"
            priority
            quality={90}
            style={{
              filter: 'sepia(10%) contrast(1.05) brightness(1.05)',
            }}
          />
        </div>
        
        {/* Overlay for better text readability - reduced opacity for clearer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-stone-100/45 to-amber-50/50 z-[1]" />
        
        {/* Vintage paper texture overlay - multiple layers */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-[2]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Aged paper stains effect - reduced opacity */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-[2]" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139, 90, 43, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, rgba(101, 67, 33, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(120, 80, 40, 0.15) 0%, transparent 50%)`,
        }} />
        
        {/* Vintage sepia overlay - reduced opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/3 via-transparent to-stone-800/3 pointer-events-none z-[2]" />
        
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-[3]">
          {/* Hero Section - Vintage Style */}
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-900/20 via-stone-800/20 to-amber-900/20 border-2 border-amber-800/40 rounded-full mb-6 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="text-amber-900 font-semibold text-lg tracking-wide relative z-10">PROPOSAL DỰ ÁN</span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold text-amber-900 mb-4 tracking-tight relative" style={{
              textShadow: '3px 3px 6px rgba(0,0,0,0.15), 1px 1px 2px rgba(139, 90, 43, 0.3)',
              letterSpacing: '-0.02em',
              filter: 'drop-shadow(0 2px 4px rgba(139, 90, 43, 0.2))'
            }}>
              <span className="relative inline-block">
                TRIẾT HỌC 4.0
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-stone-700 font-medium italic max-w-3xl mx-auto mb-8 leading-relaxed" style={{
              textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
            }}>
              Website học tập tương tác về Triết học Mác – Lênin ứng dụng trí tuệ nhân tạo
            </p>
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-stone-700/20 to-amber-800/20 border-2 border-stone-600/40 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <span className="text-stone-800 font-semibold">Môn học: Chủ nghĩa xã hội khoa học</span>
            </div>
          </div>

          {/* QR Code Section - Vintage Style */}
          <div className={`max-w-5xl mx-auto mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Card className="bg-gradient-to-br from-amber-50/95 via-stone-50/95 to-amber-50/95 backdrop-blur-sm shadow-2xl border-2 border-amber-800/30 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
              {/* Vintage paper edge effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              
              {/* Corner decorations */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-800/30" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-800/30" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-800/30" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-800/30" />
              
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-800/20 to-stone-700/20 border-2 border-amber-800/40 flex items-center justify-center flex-shrink-0 shadow-md">
                        <QrCode className="h-6 w-6 text-amber-900" />
                      </div>
                      <h2 className="text-3xl font-bold text-amber-900" style={{
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        Quét mã QR để truy cập
                      </h2>
                    </div>
                    <p className="text-stone-700 mb-4 leading-relaxed text-lg">
                      Sử dụng camera điện thoại để quét mã QR và truy cập trực tiếp vào website Triết Học 4.0
                    </p>
                    <div className="flex items-center gap-2 text-stone-600 text-sm">
                      <ScanLine className="h-4 w-4 animate-pulse" />
                      <span>Quét mã để khám phá ngay</span>
                    </div>
                  </div>
                  <div className="relative group/qr">
                    {/* Vintage frame effect */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-amber-800/20 to-stone-700/20 rounded-lg blur-sm opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300" />
                    <button
                      type="button"
                      className="relative bg-white p-6 rounded-lg shadow-2xl border-4 border-amber-800/40 transform transition-all duration-300 group-hover/qr:scale-105 group-hover/qr:rotate-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-800 focus:ring-offset-2"
                      onClick={() => setIsQROpen(true)}
                      aria-label="Mở QR Code để xem lớn hơn"
                    >
                      {/* Vintage paper texture on QR frame */}
                      <div className="absolute inset-0 opacity-10 rounded-lg" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z'/%3E%3C/g%3E%3C/svg%3E")`,
                      }} />
                      <Image
                        src="/assets/QRCODE.png"
                        alt="QR Code - Triết Học 4.0"
                        width={200}
                        height={200}
                        className="relative z-10 rounded-sm"
                        style={{
                          filter: 'sepia(10%) contrast(1.1)',
                        }}
                      />
                      {/* Scan line animation effect */}
                      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent animate-scan" />
                      </div>
                      {/* Zoom icon overlay */}
                      <div className="absolute top-2 right-2 bg-amber-800/80 text-white p-2 rounded-full opacity-0 group-hover/qr:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
                        <ZoomIn className="h-4 w-4" />
                      </div>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Vintage Paper Style */}
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Giới thiệu dự án */}
            <Card className={`bg-gradient-to-br from-amber-50/95 via-stone-50/95 to-amber-50/95 backdrop-blur-sm shadow-2xl border-2 border-amber-800/30 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
              {/* Vintage paper edge effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              
              {/* Aged paper texture */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              }} />
              
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-800/20 to-stone-700/20 border-2 border-amber-800/40 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-amber-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-amber-900 mb-4" style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>Giới thiệu dự án</h2>
                  </div>
                </div>

                {/* Lý do chọn dự án */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2" style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    <Lightbulb className="h-6 w-6 text-amber-800" />
                    Lý do chọn dự án
                  </h3>
                  <div className="space-y-4 ml-8">
                    <div className="p-4 bg-white/70 rounded-lg border-l-4 border-amber-800/60 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-x-1">
                      <h4 className="font-semibold text-amber-900 mb-2">Bối cảnh</h4>
                      <p className="text-stone-700 leading-relaxed">
                        Trong bối cảnh Cách mạng Công nghiệp 4.0 đang phát triển mạnh mẽ, việc học các môn Lý luận Chính trị, 
                        đặc biệt là Triết học Mác – Lênin, cần có sự đổi mới để phù hợp với thế hệ sinh viên năng động, quen với công nghệ số.
                      </p>
                    </div>
                    <div className="p-4 bg-white/70 rounded-lg border-l-4 border-stone-700/60 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-x-1">
                      <h4 className="font-semibold text-amber-900 mb-2">Vấn đề</h4>
                      <p className="text-stone-700 leading-relaxed">
                        Phần lớn sinh viên hiện nay gặp khó khăn khi học Triết học vì nội dung trừu tượng, khô khan, 
                        thiếu ví dụ thực tiễn và không có nhiều hình thức học tập trực quan. Các tài liệu học tập thường ở dạng văn bản dài, 
                        gây khó tiếp thu và ghi nhớ.
                      </p>
                    </div>
                    <div className="p-4 bg-white/70 rounded-lg border-l-4 border-amber-700/60 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-x-1">
                      <h4 className="font-semibold text-amber-900 mb-2">Giải pháp</h4>
                      <p className="text-stone-700 leading-relaxed">
                        Dự án "Triết Học 4.0" ra đời nhằm số hóa việc học Triết học Mác – Lênin theo hướng tương tác – trực quan – gắn thực tiễn – ứng dụng AI. 
                        Website không chỉ là nơi cung cấp kiến thức mà còn giúp sinh viên học Triết thông qua mindmap triết học, quiz, 
                        chatbot giải thích tư tưởng, và dashboard phân tích quá trình học, tạo nên một hệ sinh thái học tập thông minh và gần gũi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mục tiêu dự án */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2" style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    <Target className="h-6 w-6 text-amber-800" />
                    Mục tiêu dự án
                  </h3>
                  <div className="p-4 bg-white/70 rounded-lg border-l-4 border-amber-800/60 mb-4 shadow-md hover:shadow-lg transition-all duration-300">
                    <h4 className="font-semibold text-amber-900 mb-2">Mục tiêu tổng quát</h4>
                    <p className="text-stone-700 leading-relaxed">
                      Xây dựng một website học tập thông minh và trực quan, giúp sinh viên dễ dàng tiếp cận, hiểu và vận dụng 
                      các tư tưởng Triết học Mác – Lênin trong thực tiễn đời sống thông qua tương tác công nghệ.
                    </p>
                  </div>
                  <div className="p-4 bg-white/70 rounded-lg border-l-4 border-stone-700/60 shadow-md hover:shadow-lg transition-all duration-300">
                    <h4 className="font-semibold text-amber-900 mb-3">Mục tiêu cụ thể</h4>
                    <ul className="space-y-2 text-stone-700">
                      <li className="flex items-start gap-2 hover:translate-x-1 transition-transform duration-200">
                        <CheckCircle className="h-5 w-5 text-amber-800 flex-shrink-0 mt-0.5" />
                        <span>Thiết kế giao diện website thân thiện, hiện đại, sử dụng công nghệ Next.js + Tailwind CSS.</span>
                      </li>
                      <li className="flex items-start gap-2 hover:translate-x-1 transition-transform duration-200">
                        <CheckCircle className="h-5 w-5 text-amber-800 flex-shrink-0 mt-0.5" />
                        <span>Tích hợp AI Chatbot Triết học có khả năng tóm tắt, giải thích và gợi ý ví dụ thực tiễn.</span>
                      </li>
                      <li className="flex items-start gap-2 hover:translate-x-1 transition-transform duration-200">
                        <CheckCircle className="h-5 w-5 text-amber-800 flex-shrink-0 mt-0.5" />
                        <span>Tạo Mindmap tương tác giúp sinh viên hệ thống hóa kiến thức theo từng chương.</span>
                      </li>
                      <li className="flex items-start gap-2 hover:translate-x-1 transition-transform duration-200">
                        <CheckCircle className="h-5 w-5 text-amber-800 flex-shrink-0 mt-0.5" />
                        <span>Xây dựng bộ câu hỏi trắc nghiệm và flashcard tự ôn luyện.</span>
                      </li>
                      <li className="flex items-start gap-2 hover:translate-x-1 transition-transform duration-200">
                        <CheckCircle className="h-5 w-5 text-amber-800 flex-shrink-0 mt-0.5" />
                        <span>Cho phép người học đăng nhập, theo dõi tiến độ, điểm quiz, và chia sẻ bài viết thảo luận triết học.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Đối tượng */}
                <div>
                  <h3 className="text-2xl font-bold text-amber-900 mb-4 flex items-center gap-2" style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                  }}>
                    <Users className="h-6 w-6 text-amber-800" />
                    Đối tượng hướng tới
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/70 rounded-lg border-2 border-amber-800/40 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                      <h4 className="font-semibold text-amber-900 mb-2">Đối tượng chính</h4>
                      <p className="text-stone-700">
                        Sinh viên đại học, cao đẳng đang học các môn Triết học, CNXHKH, Kinh tế học Mác – Lênin
                      </p>
                    </div>
                    <div className="p-4 bg-white/70 rounded-lg border-2 border-stone-700/40 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
                      <h4 className="font-semibold text-amber-900 mb-2">Đối tượng mở rộng</h4>
                      <p className="text-stone-700">
                        Giảng viên, nhà nghiên cứu, và người quan tâm đến triết học và tư tưởng cách mạng.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tính mới và điểm khác biệt */}
            <Card className={`bg-gradient-to-br from-amber-50/95 via-stone-50/95 to-amber-50/95 backdrop-blur-sm shadow-2xl border-2 border-amber-800/30 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-800/20 to-stone-700/20 border-2 border-amber-800/40 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-6 w-6 text-amber-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-amber-900 mb-4" style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>Tính mới và điểm khác biệt</h2>
                    <p className="text-stone-700 mb-6 leading-relaxed">
                      "Triết Học 4.0" không chỉ là một website học tập thông thường, mà là một nền tảng đổi mới với những đặc điểm nổi bật:
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: Brain, title: 'Ứng dụng trí tuệ nhân tạo (AI)', desc: 'Chatbot hỗ trợ học tập – người dùng có thể đặt câu hỏi và được trả lời ngay.', color: 'from-amber-800/30 to-stone-700/30' },
                    { icon: Map, title: 'Mindmap Triết học', desc: 'Kiến thức được trình bày theo sơ đồ hóa, giúp ghi nhớ nhanh.', color: 'from-stone-700/30 to-amber-800/30' },
                    { icon: MessageSquare, title: 'Trải nghiệm tương tác', desc: 'Quiz nhanh, mini game "Triết học hành động", bảng xếp hạng học tập.', color: 'from-amber-800/30 to-stone-700/30' },
                    { icon: Sparkles, title: 'Giao diện hiện đại', desc: 'Thiết kế tối giản, dễ hiểu, màu sắc thân thiện với sinh viên.', color: 'from-stone-700/30 to-amber-800/30' },
                    { icon: BookOpen, title: 'Storytelling Triết học', desc: 'Mỗi học thuyết được kể lại như một "câu chuyện tư duy" thay vì định nghĩa khô cứng.', color: 'from-amber-800/30 to-stone-700/30' },
                    { icon: Code, title: 'Công nghệ hiện đại', desc: 'Next.js, Tailwind CSS, Prisma, Neon Database, OpenAI API (hoặc Mistral API).', color: 'from-stone-700/30 to-amber-800/30' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="p-4 bg-white/70 rounded-lg border-l-4 border-amber-800/60 hover:shadow-lg hover:translate-x-1 transition-all duration-300 group/item">
                        <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${item.color} border-2 border-amber-800/40 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300`}>
                            <Icon className="h-5 w-5 text-amber-900" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-amber-900 mb-1">{item.title}</h4>
                            <p className="text-sm text-stone-700">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className={`bg-gradient-to-br from-amber-50/95 via-stone-50/95 to-amber-50/95 backdrop-blur-sm shadow-2xl border-2 border-amber-800/30 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '500ms' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-800/20 to-stone-700/20 border-2 border-amber-800/40 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-6 w-6 text-amber-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-amber-900 mb-4" style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>Lộ trình thực hiện dự án (5 tuần)</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { phase: 'Khởi động & Lên kế hoạch', time: 'Tuần 1 - 2', tasks: ['Hoàn thiện proposal', 'Xác định nội dung triết học theo từng chương', 'Thiết kế wireframe, sitemap', 'Lên ý tưởng UI/UX'] },
                    { phase: 'Phát triển & Xây dựng website', time: 'Tuần 3', tasks: ['Thiết kế giao diện (Next.js + Tailwind)', 'Xây dựng database Neon/PostgreSQL', 'Phát triển module Mindmap & Quiz'] },
                    { phase: 'Tích hợp AI & Nội dung', time: 'Tuần 3 - 4', tasks: ['Tích hợp API Chatbot (OpenAI/Mistral)', 'Biên soạn kiến thức các chương', 'Kiểm thử phản hồi AI & nhập liệu'] },
                    { phase: 'Kiểm thử & Hoàn thiện', time: 'Tuần 4', tasks: ['Test giao diện, hiệu năng', 'Chạy thử AI, quiz, mindmap', 'Sửa lỗi và tối ưu trải nghiệm'] },
                    { phase: 'Báo cáo & Showcase', time: 'Tuần 5', tasks: ['Triển khai lên Vercel', 'Viết báo cáo tổng kết', 'Chuẩn bị poster & demo'] },
                  ].map((item, index) => (
                    <div key={item.phase} className="p-5 bg-white/70 rounded-lg border-l-4 border-amber-800/60 hover:shadow-lg hover:translate-x-1 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                        <h3 className="font-bold text-lg text-amber-900">{item.phase}</h3>
                        <span className="text-sm font-semibold text-amber-900 bg-amber-800/20 border border-amber-800/40 px-3 py-1 rounded-full inline-block md:ml-auto shadow-sm">
                          {item.time}
                        </span>
                      </div>
                      <ul className="space-y-1 ml-4">
                        {item.tasks.map((task) => (
                          <li key={task} className="flex items-start gap-2 text-stone-700 hover:text-amber-900 transition-colors duration-200">
                            <span className="text-amber-800 mt-1.5 font-bold">•</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ngân sách */}
            <Card className={`bg-gradient-to-br from-amber-50/95 via-stone-50/95 to-amber-50/95 backdrop-blur-sm shadow-2xl border-2 border-amber-800/30 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-800/20 to-stone-700/20 border-2 border-amber-800/40 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-6 w-6 text-amber-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-amber-900 mb-4" style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>Ngân sách dự kiến</h2>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-amber-800/20 border-b-2 border-amber-800/40">
                        <th className="p-3 text-left font-semibold text-amber-900">Hạng mục</th>
                        <th className="p-3 text-left font-semibold text-amber-900">Chi tiết</th>
                        <th className="p-3 text-right font-semibold text-amber-900">Chi phí (VND)</th>
                        <th className="p-3 text-left font-semibold text-amber-900">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { item: 'Xây dựng website', detail: 'Domain riêng (tùy chọn), Hosting: Vercel (free), Database: Neon (free tier), Thiết kế Figma miễn phí', cost: '51.600', note: 'Mua domain nếu cần' },
                        { item: 'Tích hợp AI', detail: 'API OpenAI/Mistral (dùng gói free), Tích hợp Chatbot Triết học', cost: '0', note: 'Free trial' },
                        { item: 'Nội dung học tập', detail: 'Biên soạn bài giảng, hình ảnh, infographic, Thiết kế Mindmap', cost: '0', note: 'Tự thực hiện' },
                        { item: 'Showcase', detail: 'In poster, standee, QR code demo, Trang trí booth nhỏ', cost: '0', note: 'Linh hoạt' },
                        { item: 'Dự phòng', detail: 'Chi phí kỹ thuật, lỗi phát sinh', cost: '125.000', note: 'Dự phòng nhỏ' },
                      ].map((row) => (
                        <tr key={row.item} className="border-b border-amber-800/20 hover:bg-white/60 transition-colors duration-200">
                          <td className="p-3 font-medium text-amber-900">{row.item}</td>
                          <td className="p-3 text-stone-700 text-sm">{row.detail}</td>
                          <td className="p-3 text-right font-semibold text-amber-900">{row.cost}</td>
                          <td className="p-3 text-stone-600 text-sm">{row.note}</td>
                        </tr>
                      ))}
                      <tr className="bg-amber-800/20 font-bold border-t-2 border-amber-800/40">
                        <td colSpan={2} className="p-3 text-amber-900">Tổng cộng</td>
                        <td className="p-3 text-right text-amber-900">~200,000 VND</td>
                        <td className="p-3"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* KPI */}
            <Card className={`bg-gradient-to-br from-amber-50/95 via-stone-50/95 to-amber-50/95 backdrop-blur-sm shadow-2xl border-2 border-amber-800/30 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '700ms' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-800/40 via-amber-700/50 to-amber-800/40" />
              <CardContent className="p-8 md:p-12 relative z-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-800/20 to-stone-700/20 border-2 border-amber-800/40 flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-amber-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-amber-900 mb-4" style={{
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}>KPI mong muốn & Kết quả dự kiến</h2>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-amber-800/20 border-b-2 border-amber-800/40">
                        <th className="p-3 text-left font-semibold text-amber-900">Hạng mục</th>
                        <th className="p-3 text-left font-semibold text-amber-900">Mục tiêu cụ thể</th>
                        <th className="p-3 text-left font-semibold text-amber-900">Cách đo lường</th>
                        <th className="p-3 text-left font-semibold text-amber-900">Thời gian đạt được</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { category: 'Lượng truy cập website', goal: 'Đạt ≥ 1.000 lượt truy cập', measure: 'Vercel Analytics', time: 'Trong 3 tuần sau khi ra mắt' },
                        { category: 'Người dùng đăng ký', goal: 'Đạt ≥ 100 người dùng thực', measure: 'CSDL hệ thống (Neon DB / Prisma Log)', time: 'Trong 5 tuần triển khai' },
                        { category: 'Tỷ lệ hoàn thành quiz', goal: '≥ 60% người học hoàn thành ít nhất 1 quiz', measure: 'Quiz API log / dashboard nội bộ', time: 'Sau 5 tuần' },
                        { category: 'Phản hồi tích cực', goal: '≥ 80% người dùng đánh giá trải nghiệm tốt', measure: 'Form Google Feedback / khảo sát', time: 'Sau showcase' },
                        { category: 'Tương tác truyền thông', goal: '≥ 500 lượt tương tác trên mạng xã hội', measure: 'Facebook Insights', time: 'Trong thời gian truyền thông' },
                      ].map((row) => (
                        <tr key={row.category} className="border-b border-amber-800/20 hover:bg-white/60 transition-colors duration-200">
                          <td className="p-3 font-medium text-amber-900">{row.category}</td>
                          <td className="p-3 text-stone-700">{row.goal}</td>
                          <td className="p-3 text-stone-700 text-sm">{row.measure}</td>
                          <td className="p-3 text-stone-700 text-sm">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Quote Section */}
            <Card className={`bg-gradient-to-br from-amber-100/90 via-stone-100/90 to-amber-100/90 backdrop-blur-sm shadow-2xl border-2 border-amber-800/40 relative overflow-hidden group hover:shadow-3xl transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
              {/* Vintage decorative borders */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-800/50 via-amber-700/60 to-amber-800/50" />
              <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-amber-800/50 via-amber-700/60 to-amber-800/50" />
              
              {/* Corner decorations */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-amber-800/40" />
              <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-amber-800/40" />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-amber-800/40" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-amber-800/40" />
              
              <CardContent className="p-8 md:p-12 text-center relative z-10">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-4 inline-block">
                    <span className="text-6xl text-amber-800/30 leading-none">"</span>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-amber-900 mb-6 italic leading-relaxed" style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                    fontFamily: 'serif'
                  }}>
                    Triết học không còn khô khan — hãy để AI giúp bạn hiểu triết bằng cách trò chuyện, khám phá và trải nghiệm.
                  </p>
                  <div className="inline-block mb-4">
                    <span className="text-6xl text-amber-800/30 leading-none">"</span>
                  </div>
                  <div className="w-24 h-0.5 bg-amber-800/40 mx-auto mb-4" />
                  <p className="text-xl text-amber-800 font-semibold italic">— Triết Học 4.0</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* QR Code Zoom Modal */}
      <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
        <DialogContent className="max-w-md bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 border-2 border-amber-800/40">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-amber-900 text-center">
              QR Code - Triết Học 4.0
            </DialogTitle>
            <DialogDescription className="text-center text-stone-700">
              Quét mã QR để truy cập website
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative bg-white p-8 rounded-lg shadow-2xl border-4 border-amber-800/40">
              {/* Vintage paper texture */}
              <div className="absolute inset-0 opacity-10 rounded-lg" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
              <Image
                src="/assets/QRCODE.png"
                alt="QR Code - Triết Học 4.0"
                width={400}
                height={400}
                className="relative z-10 rounded-sm"
                style={{
                  filter: 'sepia(10%) contrast(1.1)',
                }}
              />
              {/* Scan line animation effect */}
              <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent animate-scan" />
              </div>
            </div>
            <p className="text-sm text-stone-600 text-center">
              Sử dụng camera điện thoại để quét mã QR
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

