'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Star, 
  Users, 
  Briefcase, 
  Target, 
  TrendingUp,
  Award,
  Calendar,
  FileText,
  Code,
  Presentation,
  BookOpen,
  MessageSquare,
  DollarSign,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  roleIcon: React.ReactNode;
  tasks: {
    description: string;
    taskIcon: React.ReactNode;
    progress: number;
    status: 'completed';
  }[];
  overallRating: number;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Trần Xuân Trường',
    role: 'Project Manager / Tech Lead',
    roleIcon: <Briefcase className="h-5 w-5" />,
    tasks: [
      {
        description: 'Quản lý, điều phối tiến độ',
        taskIcon: <TrendingUp className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Viết Giới thiệu dự án (B2), Background (B3), Mục lục (B4)',
        taskIcon: <FileText className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Thiết kế tài liệu, developer và deployment',
        taskIcon: <Code className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Tích hợp AI',
        taskIcon: <Award className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Phác thảo web (wireframe, giao diện, tính năng demo) (B6)',
        taskIcon: <FileText className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      }
    ],
    overallRating: 5
  },
  {
    name: 'Trần Thị Mai Linh',
    role: 'Timeline & Communication Planner',
    roleIcon: <Calendar className="h-5 w-5" />,
    tasks: [
      {
        description: 'Lập timeline (B5)',
        taskIcon: <Calendar className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Kế hoạch truyền thông thử nghiệm (B6)',
        taskIcon: <MessageSquare className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Liên kết Tech team & Biz team để đồng bộ',
        taskIcon: <Users className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Quản lý Ngân sách (B8)',
        taskIcon: <DollarSign className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Quản trị rủi ro (B10)',
        taskIcon: <AlertTriangle className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Kế hoạch dự phòng (B11)',
        taskIcon: <Shield className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      }
    ],
    overallRating: 5
  },
  {
    name: 'Lê Quang Huy',
    role: 'Timeline & Communication Planner',
    roleIcon: <Calendar className="h-5 w-5" />,
    tasks: [
      {
        description: 'Lập timeline (B5)',
        taskIcon: <Calendar className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Kế hoạch truyền thông thử nghiệm (B6)',
        taskIcon: <MessageSquare className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Liên kết Tech team & Biz team để đồng bộ',
        taskIcon: <Users className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Quản lý Ngân sách (B8)',
        taskIcon: <DollarSign className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Quản trị rủi ro (B10)',
        taskIcon: <AlertTriangle className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Kế hoạch dự phòng (B11)',
        taskIcon: <Shield className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      }
    ],
    overallRating: 5
  },
  {
    name: 'Huỳnh Văn Nghĩa',
    role: 'Tech Team / Web Developer',
    roleIcon: <Code className="h-5 w-5" />,
    tasks: [
      {
        description: 'Phác thảo web (wireframe, giao diện, tính năng demo) (B6)',
        taskIcon: <FileText className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Đảm bảo web demo chạy cơ bản',
        taskIcon: <Code className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Quản trị rủi ro (B10)',
        taskIcon: <AlertTriangle className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Kiểm tra AI',
        taskIcon: <Award className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      }
    ],
    overallRating: 5
  },
  {
    name: 'Trần Quang Khoa',
    role: 'Tech Team / Web Developer',
    roleIcon: <Code className="h-5 w-5" />,
    tasks: [
      {
        description: 'Phác thảo web (wireframe, giao diện, tính năng demo) (B6)',
        taskIcon: <FileText className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Đảm bảo web demo chạy cơ bản',
        taskIcon: <Code className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Quản trị rủi ro (B10)',
        taskIcon: <AlertTriangle className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Kiểm tra AI',
        taskIcon: <Award className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      }
    ],
    overallRating: 5
  },
  {
    name: 'Trần Hoàng Hòa',
    role: 'Tech Team / Web Developer',
    roleIcon: <Code className="h-5 w-5" />,
    tasks: [
      {
        description: 'Phác thảo web (wireframe, giao diện, tính năng demo) (B6)',
        taskIcon: <FileText className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Đảm bảo web demo chạy cơ bản',
        taskIcon: <Code className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Quản trị rủi ro (B10)',
        taskIcon: <AlertTriangle className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      },
      {
        description: 'Kiểm tra AI',
        taskIcon: <Award className="h-4 w-4" />,
        progress: 100,
        status: 'completed'
      }
    ],
    overallRating: 5
  }
];

const teamTasks = [
  {
    description: 'Tìm kiếm, chọn lọc tư liệu chính thống',
    taskIcon: <BookOpen className="h-4 w-4" />,
    progress: 100,
    status: 'completed' as const
  },
  {
    description: 'Tổng hợp các cột mốc lịch sử, tư tưởng',
    taskIcon: <Target className="h-4 w-4" />,
    progress: 100,
    status: 'completed' as const
  },
  {
    description: 'Đảm bảo thông tin gắn liền với các môn MLN để đưa vào nội dung web',
    taskIcon: <FileText className="h-4 w-4" />,
    progress: 100,
    status: 'completed' as const
  },
  {
    description: 'Thống nhất tên dự án & trang tiêu đề (B1)',
    taskIcon: <Award className="h-4 w-4" />,
    progress: 100,
    status: 'completed' as const
  },
  {
    description: 'Viết phần Giới thiệu nhóm (B7)',
    taskIcon: <Users className="h-4 w-4" />,
    progress: 100,
    status: 'completed' as const
  },
  {
    description: 'Rà soát & hoàn thiện proposal',
    taskIcon: <CheckCircle2 className="h-4 w-4" />,
    progress: 100,
    status: 'completed' as const
  },
  {
    description: 'Chuẩn bị thuyết trình',
    taskIcon: <Presentation className="h-4 w-4" />,
    progress: 100,
    status: 'completed' as const
  }
];

export default function WorkLogPage() {
  const totalTasks = teamMembers.reduce((sum, member) => sum + member.tasks.length, 0) + teamTasks.length;
  const completedTasks = totalTasks;
  const overallProgress = (completedTasks / totalTasks) * 100;
  const averageRating = teamMembers.reduce((sum, member) => sum + member.overallRating, 0) / teamMembers.length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="text-purple-800 font-semibold">Log Công Việc</span>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-6">
              Theo Dõi Tiến Độ Dự Án
            </h1>
            <p className="text-xl md:text-2xl text-purple-700 max-w-4xl mx-auto mb-8">
              Tổng quan chi tiết về công việc và đóng góp của từng thành viên trong đội ngũ
            </p>
            
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="bg-white/95 backdrop-blur shadow-lg border-2 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <span className="text-3xl font-bold text-green-600">{completedTasks}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Nhiệm vụ hoàn thành</p>
                  <Progress value={100} className="mt-3 h-2" />
                </CardContent>
              </Card>
              
              <Card className="bg-white/95 backdrop-blur shadow-lg border-2 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    <span className="text-3xl font-bold text-blue-600">{Math.round(overallProgress)}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Tiến độ tổng thể</p>
                  <Progress value={overallProgress} className="mt-3 h-2" />
                </CardContent>
              </Card>
              
              <Card className="bg-white/95 backdrop-blur shadow-lg border-2 border-amber-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                    <span className="text-3xl font-bold text-amber-600">{averageRating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="h-4 w-4 text-amber-500 fill-amber-500" 
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="max-w-7xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-primary mb-8 flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              Thành Viên Đội Ngũ
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <Card 
                  key={member.name} 
                  className="bg-white/95 backdrop-blur shadow-xl border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold text-primary mb-2">
                          {member.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-purple-700">
                          {member.roleIcon}
                          <span className="font-semibold">{member.role}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Hoàn thành
                        </Badge>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${
                                star <= member.overallRating 
                                  ? 'text-amber-500 fill-amber-500' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-primary mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        Nhiệm vụ ({member.tasks.length})
                      </h3>
                      
                      {member.tasks.map((task) => (
                        <div 
                          key={task.description}
                          className="p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border border-purple-100 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <div className="mt-0.5 text-purple-600">
                              {task.taskIcon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-800 mb-2">
                                {task.description}
                              </p>
                              <div className="flex items-center gap-3">
                                <Progress value={task.progress} className="flex-1 h-2" />
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  <span className="text-xs font-semibold text-green-600">
                                    {task.progress}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Team Tasks Section */}
            <Card className="bg-white/95 backdrop-blur shadow-xl border-2 border-purple-200 mt-8">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200">
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                  <Users className="h-6 w-6 text-purple-600" />
                  Nhiệm Vụ Chung Của Cả Nhóm
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamTasks.map((task) => (
                    <div 
                      key={task.description}
                      className="p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg border border-purple-100 hover:border-purple-300 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-purple-600">
                          {task.taskIcon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 mb-2">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Progress value={task.progress} className="flex-1 h-2" />
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-semibold text-green-600">
                                {task.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-lg text-amber-900">Đánh giá chung: 5/5 sao ⭐⭐⭐⭐⭐</span>
                  </div>
                  <p className="text-amber-800 text-sm">
                    Tất cả thành viên đều hoạt động xuất sắc, hoàn thành 100% nhiệm vụ được giao với chất lượng cao!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl mt-8">
              <CardContent className="p-8">
                <div className="text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-amber-300" />
                  <h3 className="text-3xl font-bold mb-4">🎉 Dự án hoàn thành xuất sắc!</h3>
                  <p className="text-xl text-purple-100 mb-6">
                    Tất cả {totalTasks} nhiệm vụ đã được hoàn thành 100% bởi đội ngũ làm việc chuyên nghiệp và hiệu quả.
                  </p>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="h-8 w-8 text-amber-300 fill-amber-300" 
                      />
                    ))}
                  </div>
                  <p className="text-lg text-purple-100 font-semibold">
                    Đánh giá: 5/5 sao - Xuất sắc!
                  </p>
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

