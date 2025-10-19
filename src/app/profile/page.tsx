"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  LogOut,
  Save,
  BookOpen,
  FileText,
  Star,
  MessageSquare,
  Map,
  TrendingUp,
  User,
  Eye,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoadmapFlow } from "@/components/roadmap/RoadmapFlow";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [stats, setStats] = useState<{
    quizzes: number;
    roadmaps: number;
    reviews: number;
    posts: number;
    comments: number;
  }>({ quizzes: 0, roadmaps: 0, reviews: 0, posts: 0, comments: 0 });
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      startTransition(async () => {
        const r = await fetch("/api/profile/stats");
        if (r.ok) {
          const data = await r.json();
          setStats(data);
        }

        const roadmapRes = await fetch("/api/roadmap/list");
        if (roadmapRes.ok) {
          const roadmapData = await roadmapRes.json();
          setRoadmaps(roadmapData.roadmaps || []);
        }

        const reviewRes = await fetch("/api/review?limit=100");
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          // Filter reviews by current user
          const userReviews =
            reviewData.reviews?.filter(
              (r: any) => r.user.email === session?.user?.email
            ) || [];
          setReviews(userReviews);
        }
      });
    }
  }, [session]);

  const onSave = () => {
    startTransition(async () => {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    });
  };

  if (status !== "authenticated") return null;

  const chartData = [
    { name: "Quizzes", value: stats.quizzes, fill: "hsl(var(--chart-1))" },
    { name: "Roadmaps", value: stats.roadmaps, fill: "hsl(var(--chart-2))" },
    { name: "Reviews", value: stats.reviews, fill: "hsl(var(--chart-3))" },
    { name: "Posts", value: stats.posts, fill: "hsl(var(--chart-4))" },
    { name: "Comments", value: stats.comments, fill: "hsl(var(--chart-5))" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      {/* Banner with Pattern */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-amber-100 via-yellow-50 to-rose-100 border-b overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {session?.user?.name?.charAt(0)?.toUpperCase() || (
                <User className="h-10 w-10" />
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-amber-800 tracking-tight">
                {session?.user?.name || "Người dùng"}
              </h1>
              <p className="text-amber-700/80">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Info & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <Card className="bg-white/95 backdrop-blur border-slate-200 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-slate-700" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ tên"
                    className="border-slate-300 focus:ring-blue-500"
                  />
                  <Button
                    onClick={onSave}
                    disabled={isPending}
                    className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Lưu
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="shrink-0 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard
                icon={BookOpen}
                label="Quizzes"
                value={stats.quizzes}
                color="from-purple-400 to-pink-500"
              />
              <StatCard
                icon={Map}
                label="Roadmaps"
                value={stats.roadmaps}
                color="from-green-400 to-emerald-500"
              />
              <StatCard
                icon={Star}
                label="Reviews"
                value={stats.reviews}
                color="from-yellow-400 to-orange-500"
              />
              <StatCard
                icon={FileText}
                label="Posts"
                value={stats.posts}
                color="from-blue-400 to-cyan-500"
              />
              <StatCard
                icon={MessageSquare}
                label="Comments"
                value={stats.comments}
                color="from-rose-400 to-red-500"
              />
            </div>

            {/* Activity Chart */}
            <Card className="bg-white/95 backdrop-blur border-slate-200 shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-slate-700" />
                  Biểu đồ hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    value: {
                      label: "Số lượng",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-slate-200"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "hsl(var(--foreground))" }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--foreground))" }}
                      tickLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="value"
                      fill="url(#gradient)"
                      radius={[8, 8, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.3}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Saved Roadmaps */}
            {roadmaps.length > 0 && (
              <Card className="bg-white/95 backdrop-blur border-slate-200 shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Map className="h-5 w-5 text-slate-700" />
                    Lộ trình đã lưu
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {roadmaps.map((roadmap) => (
                      <div
                        key={roadmap.id}
                        className="p-4 rounded-lg border border-slate-200 hover:border-amber-300 bg-gradient-to-br from-amber-50/50 to-orange-50/50 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => setSelectedRoadmap(roadmap)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-amber-900 group-hover:text-amber-700">
                              {roadmap.title}
                            </h4>
                            {roadmap.description && (
                              <p className="text-sm text-slate-600 mt-1">
                                {roadmap.description}
                              </p>
                            )}
                            <p className="text-xs text-slate-500 mt-2">
                              {roadmap.items?.length || 0} mục • Tạo ngày{" "}
                              {new Date(roadmap.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>
                          </div>
                          <Eye className="h-5 w-5 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Reviews */}
            {reviews.length > 0 && (
              <Card className="bg-white/95 backdrop-blur border-slate-200 shadow-lg">
                <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-slate-700" />
                    Đánh giá của tôi
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div
                        key={review.id}
                        className="p-4 rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        {review.title && (
                          <h4 className="font-semibold text-blue-900 mb-1">
                            {review.title}
                          </h4>
                        )}
                        <p className="text-sm text-slate-700">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Suggestions & Tips */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-amber-900">
                  Gợi ý dành cho bạn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-amber-800/90">
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-4 w-4 text-amber-700" />
                  </div>
                  <p>
                    Hoàn thiện hồ sơ để AI cá nhân hoá lộ trình học tốt hơn.
                  </p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
                    <Map className="h-4 w-4 text-amber-700" />
                  </div>
                  <p>Tạo lộ trình mới trong mục "Lộ trình AI".</p>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
                    <Star className="h-4 w-4 text-amber-700" />
                  </div>
                  <p>Viết nhận xét ở mục Review để cải thiện sản phẩm.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">
                  Thành tích
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">
                    Tổng hoạt động
                  </span>
                  <span className="font-bold text-lg text-blue-700">
                    {stats.quizzes +
                      stats.roadmaps +
                      stats.reviews +
                      stats.posts +
                      stats.comments}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">
                    Cấp độ
                  </span>
                  <span className="font-bold text-lg text-blue-700">
                    {stats.quizzes + stats.posts > 10
                      ? "🎓 Chuyên gia"
                      : stats.quizzes + stats.posts > 5
                      ? "📚 Trung cấp"
                      : "🌱 Mới bắt đầu"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Roadmap Detail Dialog */}
      <Dialog
        open={!!selectedRoadmap}
        onOpenChange={() => setSelectedRoadmap(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw] sm:w-[95vw]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline text-amber-900">
              {selectedRoadmap?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="h-[70vh]">
            {selectedRoadmap && (
              <RoadmapFlow
                lines={
                  selectedRoadmap.items?.map((item: any) => item.title) || []
                }
                completedIds={new Set()}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card className="bg-white/90 backdrop-blur border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
      <CardContent className="p-4 text-center">
        <div
          className={`h-12 w-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-3xl font-extrabold text-slate-800">{value}</div>
        <div className="text-xs text-slate-600 font-medium">{label}</div>
      </CardContent>
    </Card>
  );
}
