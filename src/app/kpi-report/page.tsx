'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { 
  Target, 
  TrendingUp,
  Award,
  Users,
  Eye,
  ThumbsUp,
  CheckCircle2,
  Star,
  GraduationCap,
  MessageSquare,
  Globe,
  BarChart3,
  Sparkles,
  ZoomIn
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// ClassTour images
const classTourMLN131Images = [
  '/assets/Classtour-MLN131_Half2_MC1703.png',
  '/assets/Classtour-MLN131_Half2_MC1703(1).png',
  '/assets/Classtour-MLN131_Half2_MC1703(2).png',
  '/assets/Classtour-MLN131_Half2_MC1703(3).png',
  '/assets/Classtour-MLN131_Half2_MC1703(4).png',
];

const classTourMLN122Images = [
  '/assets/Classtour-MLN122_Half2_SE1718.png',
  '/assets/Classtour-MLN122_Half2_SE1718(1).png',
  '/assets/Classtour-MLN122_Half2_SE1718 (2).png',
];

function ImageGallery({ images, altPrefix }: { images: string[]; altPrefix: string }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            className="relative aspect-video rounded-lg overflow-hidden border-2 border-amber-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            onClick={() => setSelectedImage(image)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedImage(image);
              }
            }}
            aria-label={`Xem hình ${index + 1} của ${altPrefix}`}
          >
            <Image
              src={image}
              alt={`${altPrefix} - Hình ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </button>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-primary">
              {altPrefix}
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full h-[70vh] p-6">
              <Image
                src={selectedImage}
                alt={altPrefix}
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function KPIReportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
        {/* Vintage decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-amber-400 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-orange-400 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mb-6 border-2 border-amber-300 shadow-md">
              <BarChart3 className="h-5 w-5 text-amber-700" />
              <span className="text-amber-800 font-semibold tracking-wide">BÁO CÁO KPI</span>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-6 drop-shadow-lg">
              Báo Cáo KPI Dự Án
            </h1>
            <p className="text-xl md:text-2xl text-amber-900 max-w-4xl mx-auto mb-8 font-medium">
              Tất cả các chỉ số đều đạt và vượt hoàn toàn KPI đặt ra ban đầu
            </p>
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-8 w-8 text-amber-500 fill-amber-500 animate-pulse" 
                  style={{ animationDelay: `${star * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          {/* Overall Achievement Badge */}
          <Card className="bg-white shadow-2xl mb-12 border-4 border-amber-300 vintage-card">
            <CardContent className="p-8 md:p-12 text-center">
              <Award className="h-16 w-16 mx-auto mb-6 text-amber-600 animate-bounce-slow" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-800">
                🎉 VƯỢT MỌI KPI ĐẶT RA
              </h2>
              <p className="text-xl md:text-2xl text-amber-700 mb-6 font-semibold">
                Tất cả chỉ số đều đạt và vượt hoàn toàn mục tiêu ban đầu
              </p>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg px-6 py-3 font-bold border-2 border-amber-400 shadow-lg">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                100% HOÀN THÀNH XUẤT SẮC
              </Badge>
            </CardContent>
          </Card>

          {/* KPI Sections */}
          <div className="space-y-12">
            {/* 1. ClassTour Section */}
            <Card className="bg-white/95 backdrop-blur shadow-2xl border-4 border-amber-200 vintage-card hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-4 border-amber-300">
                <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
                  <GraduationCap className="h-8 w-8 text-amber-700" />
                  <span>1. ClassTour - Phản Hồi Từ Giảng Viên</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  {/* Class MLN131 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="h-6 w-6 text-amber-600" />
                      <h3 className="text-xl font-bold text-primary">ClassTour-MLN131_Half2_MC1703</h3>
                    </div>
                    <p className="text-amber-800 font-semibold mb-3">Lớp thầy Lê Minh Trí</p>
                    <ImageGallery 
                      images={classTourMLN131Images}
                      altPrefix="ClassTour MLN131 - Thầy Lê Minh Trí"
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge className="bg-green-500 text-white px-4 py-2 text-sm font-bold">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Phản hồi tích cực
                      </Badge>
                      <Badge className="bg-amber-500 text-white px-4 py-2 text-sm font-bold">
                        {classTourMLN131Images.length} hình ảnh
                      </Badge>
                    </div>
                  </div>

                  {/* Class MLN122 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="h-6 w-6 text-amber-600" />
                      <h3 className="text-xl font-bold text-primary">ClassTour-MLN122_Half2_SE1718</h3>
                    </div>
                    <p className="text-amber-800 font-semibold mb-3">Lớp cô Nguyễn Thúy Phương</p>
                    <ImageGallery 
                      images={classTourMLN122Images}
                      altPrefix="ClassTour MLN122 - Cô Nguyễn Thúy Phương"
                    />
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge className="bg-green-500 text-white px-4 py-2 text-sm font-bold">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Phản hồi tích cực
                      </Badge>
                      <Badge className="bg-amber-500 text-white px-4 py-2 text-sm font-bold">
                        {classTourMLN122Images.length} hình ảnh
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-md">
                  <div className="flex items-start gap-4">
                    <ThumbsUp className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl font-bold text-green-900 mb-2">Phản Hồi Từ Giảng Viên</h4>
                      <p className="text-green-800 font-semibold mb-2">
                        ✅ <strong>100% ổn</strong> - Tất cả giảng viên đều hài lòng với dự án
                      </p>
                      <p className="text-green-800">
                        💬 <strong>Cô Phương đã nói:</strong> "Dự án này thầy cô cũng đang hướng đến và có kế hoạch thực hiện"
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. Facebook Interactions */}
            <Card className="bg-white/95 backdrop-blur shadow-2xl border-4 border-blue-200 vintage-card hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-4 border-blue-300">
                <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-blue-700" />
                  <span>2. Tương Tác Facebook</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-md">
                    <Users className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                    <div className="text-4xl font-bold text-blue-700 mb-2">221</div>
                    <p className="text-blue-800 font-semibold">Lượt theo dõi</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-md">
                    <ThumbsUp className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                    <div className="text-4xl font-bold text-blue-700 mb-2">535</div>
                    <p className="text-blue-800 font-semibold">Lượt tương tác</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 shadow-md">
                    <Eye className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                    <div className="text-4xl font-bold text-blue-700 mb-2">1.3K+</div>
                    <p className="text-blue-800 font-semibold">Lượt xem</p>
                  </div>
                </div>
                
                <div className="relative w-full h-96 rounded-lg overflow-hidden border-4 border-blue-200 shadow-lg mb-4">
                  <Image
                    src="/assets/facebookanalystic.png"
                    alt="Facebook Analytics - 221 followers, 538 interactions, 1.3K+ views"
                    fill
                    className="object-contain bg-white"
                  />
                </div>
                
                <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-md">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="text-xl font-bold text-green-900 mb-1">Kết Quả Xuất Sắc</h4>
                      <p className="text-green-800">
                        Đạt <strong>221 lượt theo dõi</strong>, <strong>535 lượt tương tác</strong> và <strong>hơn 1.3K lượt xem</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Web Traffic */}
            <Card className="bg-white/95 backdrop-blur shadow-2xl border-4 border-purple-200 vintage-card hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-4 border-purple-300">
                <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
                  <Globe className="h-8 w-8 text-purple-700" />
                  <span>3. Lượt Truy Cập Web</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-md">
                    <Globe className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                    <div className="text-5xl font-bold text-purple-700 mb-2">6K+</div>
                    <p className="text-purple-800 font-semibold text-lg">Lượt truy cập</p>
                    <Badge className="mt-3 bg-green-500 text-white px-4 py-2 text-sm font-bold">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Vượt KPI 500%
                    </Badge>
                  </div>
                  <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 shadow-md">
                    <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                    <div className="text-5xl font-bold text-purple-700 mb-2">288</div>
                    <p className="text-purple-800 font-semibold text-lg">Visitors thực tế</p>
                    <Badge className="mt-3 bg-green-500 text-white px-4 py-2 text-sm font-bold">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Đạt mục tiêu
                    </Badge>
                  </div>
                </div>
                
                <div className="relative w-full h-96 rounded-lg overflow-hidden border-4 border-purple-200 shadow-lg mb-4">
                  <Image
                    src="/assets/Traffic.png"
                    alt="Web Traffic - Hơn 6K lượt truy cập, 228 visitors"
                    fill
                    className="object-contain bg-white"
                  />
                </div>
                
                <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-md">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="text-xl font-bold text-green-900 mb-1">Vượt KPI 1000 Lượt Truy Cập</h4>
                      <p className="text-green-800">
                        Đạt <strong>hơn 6K lượt truy cập</strong> và <strong>288 visitors thực tế</strong> - Vượt KPI ban đầu 500%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Users */}
            <Card className="bg-white/95 backdrop-blur shadow-2xl border-4 border-rose-200 vintage-card hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-rose-100 to-pink-100 border-b-4 border-rose-300">
                <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
                  <Users className="h-8 w-8 text-rose-700" />
                  <span>4. Người Dùng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-block p-12 bg-gradient-to-br from-rose-50 to-pink-50 rounded-full border-4 border-rose-200 shadow-lg">
                    <Users className="h-24 w-24 mx-auto mb-4 text-rose-600" />
                    <div className="text-7xl font-bold text-rose-700 mb-3">138</div>
                    <p className="text-rose-800 font-semibold text-2xl mb-4">Người dùng</p>
                    <Badge className="bg-green-500 text-white px-6 py-3 text-lg font-bold">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Vượt KPI 38%
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-md">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="text-xl font-bold text-green-900 mb-1">Vượt KPI 100 Người Dùng</h4>
                      <p className="text-green-800">
                        Đạt <strong>138 người dùng</strong> - Vượt KPI ban đầu 38% với chất lượng cao
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Section */}
          <Card className="!bg-gradient-to-br !from-amber-600 !via-orange-600 !to-rose-600 text-white shadow-2xl mt-12 border-4 border-amber-300 vintage-card overflow-hidden">
            <CardContent className="p-8 md:p-12 !bg-transparent">
              <div className="text-center">
                <Award className="h-16 w-16 mx-auto mb-6 text-white animate-bounce-slow" />
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
                  🏆 TẤT CẢ KPI ĐỀU ĐẠT VÀ VƯỢT
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm border-2 border-white/30">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-white" />
                    <p className="font-semibold text-white">ClassTour</p>
                    <p className="text-white/90">100% phản hồi tích cực</p>
                  </div>
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm border-2 border-white/30">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-white" />
                    <p className="font-semibold text-white">Facebook</p>
                    <p className="text-white/90">221 followers, 535 tương tác</p>
                  </div>
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm border-2 border-white/30">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-white" />
                    <p className="font-semibold text-white">Web Traffic</p>
                    <p className="text-white/90">6K+ lượt truy cập, 288 visitors</p>
                  </div>
                  <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm border-2 border-white/30">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-white" />
                    <p className="font-semibold text-white">Người dùng</p>
                    <p className="text-white/90">138 users</p>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="h-10 w-10 text-white fill-white" 
                    />
                  ))}
                </div>
                <p className="text-2xl text-white font-semibold drop-shadow-md">
                  Dự án hoàn thành xuất sắc với tất cả chỉ số vượt mọi kỳ vọng!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

