'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, FileText, ListChecks, Clock, CheckCircle, XCircle, Loader2, Star, Trash2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTimeline, setNewTimeline] = useState({ year: '', title: '', description: '' });

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user?.email !== 'admin@mln131.com')) {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.email === 'admin@mln131.com') {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, postsRes, usersRes, quizzesRes, reviewsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/posts'),
        fetch('/api/admin/users'),
        fetch('/api/admin/quizzes'),
        fetch('/api/review?limit=100'),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (postsRes.ok) setPendingPosts(await postsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (quizzesRes.ok) setQuizzes(await quizzesRes.json());
      if (reviewsRes.ok) {
        const data = await reviewsRes.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/admin/posts/${postId}/approve`, { method: 'POST' });
      if (res.ok) {
        toast({ title: 'Đã duyệt bài viết' });
        loadData();
      }
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể duyệt bài viết', variant: 'destructive' });
    }
  };

  const handleRejectPost = async (postId: string) => {
    try {
      const res = await fetch(`/api/admin/posts/${postId}/reject`, { method: 'POST' });
      if (res.ok) {
        toast({ title: 'Đã từ chối bài viết' });
        loadData();
      }
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể từ chối bài viết', variant: 'destructive' });
    }
  };

  const handleAddTimeline = async () => {
    if (!newTimeline.year || !newTimeline.title || !newTimeline.description) {
      toast({ title: 'Lỗi', description: 'Vui lòng điền đầy đủ thông tin', variant: 'destructive' });
      return;
    }

    try {
      const res = await fetch('/api/admin/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTimeline),
      });

      if (res.ok) {
        toast({ title: 'Đã thêm sự kiện timeline' });
        setNewTimeline({ year: '', title: '', description: '' });
      }
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể thêm timeline', variant: 'destructive' });
    }
  };
  
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    
    try {
      const res = await fetch(`/api/review?id=${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Đã xóa đánh giá' });
        loadData();
      }
    } catch (error) {
      toast({ title: 'Lỗi', description: 'Không thể xóa đánh giá', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#44392d]" />
        </div>
      </div>
    );
  }

  const chartData = stats ? [
    { name: 'Users', value: stats.totalUsers, fill: 'hsl(var(--chart-1))' },
    { name: 'Posts', value: stats.totalPosts, fill: 'hsl(var(--chart-2))' },
    { name: 'Quizzes', value: stats.totalQuizzes, fill: 'hsl(var(--chart-3))' },
    { name: 'Roadmaps', value: stats.totalRoadmaps, fill: 'hsl(var(--chart-4))' },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#44392d] via-[#5a4a3a] to-[#44392d] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold font-headline">🔧 Admin Dashboard</h1>
          <p className="text-white/80 mt-2">Quản lý toàn bộ hệ thống Triết học 4.0</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard icon={Users} label="Tổng Users" value={stats?.totalUsers || 0} color="from-blue-400 to-cyan-500" />
          <StatCard icon={FileText} label="Tổng Posts" value={stats?.totalPosts || 0} color="from-green-400 to-emerald-500" />
          <StatCard icon={ListChecks} label="Tổng Quizzes" value={stats?.totalQuizzes || 0} color="from-purple-400 to-pink-500" />
          <StatCard icon={Clock} label="Chờ duyệt" value={stats?.pendingPosts || 0} color="from-orange-400 to-red-500" />
        </div>

        {/* Chart */}
        <Card className="mb-10 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <CardTitle className="text-2xl font-headline">Biểu đồ tổng quan</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={{ value: { label: 'Số lượng', color: 'hsl(var(--chart-1))' } }} className="h-[300px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="url(#gradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-md">
            <TabsTrigger value="posts">Bài viết chờ duyệt</TabsTrigger>
            <TabsTrigger value="users">Quản lý Users</TabsTrigger>
            <TabsTrigger value="quizzes">Quản lý Quizzes</TabsTrigger>
            <TabsTrigger value="reviews">Quản lý Reviews</TabsTrigger>
            <TabsTrigger value="timeline">Thêm Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle>Bài viết chờ kiểm duyệt ({pendingPosts.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {pendingPosts.length === 0 ? (
                    <p className="text-center text-slate-500 py-10">Không có bài viết nào chờ duyệt</p>
                  ) : (
                    pendingPosts.map((post) => (
                      <div key={post.id} className="p-4 rounded-lg border-2 border-slate-200 bg-white hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-slate-900">{post.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">
                              Tác giả: {post.author.name} • {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                            <Badge variant="outline" className="mt-2">{post.status}</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApprovePost(post.id)} className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectPost(post.id)}>
                              <XCircle className="h-4 w-4 mr-1" />
                              Từ chối
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle>Danh sách Users ({users.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="p-4 rounded-lg border bg-slate-50 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{user.name || 'No name'}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle>Danh sách Quizzes ({quizzes.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <div key={quiz.id} className="p-4 rounded-lg border bg-slate-50">
                      <p className="font-semibold">{quiz.title}</p>
                      <p className="text-sm text-slate-600">
                        Tác giả: {quiz.author.name} • {quiz.questions.length} câu hỏi
                      </p>
                      <Badge className="mt-2" variant={quiz.isPublic ? 'default' : 'secondary'}>
                        {quiz.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle>Thêm sự kiện Timeline mới</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Năm</label>
                  <Input
                    type="number"
                    placeholder="VD: 1848"
                    value={newTimeline.year}
                    onChange={(e) => setNewTimeline({ ...newTimeline, year: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Tiêu đề</label>
                  <Input
                    placeholder="VD: Tuyên ngôn của Đảng Cộng sản"
                    value={newTimeline.title}
                    onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Mô tả</label>
                  <Textarea
                    placeholder="Mô tả chi tiết sự kiện..."
                    value={newTimeline.description}
                    onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button onClick={handleAddTimeline} className="w-full bg-[#44392d] hover:bg-[#5a4a3a]">
                  Thêm Timeline
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle>Quản lý đánh giá ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      Chưa có đánh giá nào
                    </div>
                  ) : (
                    reviews.map((review: any) => (
                      <div key={review.id} className="p-4 border rounded-xl bg-gradient-to-r from-white to-slate-50 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-semibold text-slate-700">
                                {review.user?.name || 'Người dùng'}
                              </span>
                              <span className="text-xs text-slate-500">
                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            {review.title && (
                              <h4 className="font-semibold text-slate-900 mb-1">{review.title}</h4>
                            )}
                            <p className="text-sm text-slate-600">{review.content}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
      <CardContent className="p-6 text-center">
        <div className={`h-16 w-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div className="text-4xl font-extrabold text-slate-800">{value}</div>
        <div className="text-sm text-slate-600 font-medium mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}
