"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Play,
  Users,
  Calendar,
  Key,
  Target,
  Settings,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface CrosswordGame {
  id: string;
  title: string;
  description?: string;
  keyword: string;
  theme?: string;
  isPublic: boolean;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
  _count: {
    questions: number;
  };
}

export default function CrosswordGamesPage() {
  const { data: session } = useSession();
  const [games, setGames] = useState<CrosswordGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const response = await fetch("/api/crossword?public=true");
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      }
    } catch (error) {
      console.error("Error loading games:", error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#44392d] via-[#5a4a3a] to-[#44392d] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <h1 className="text-5xl font-extrabold font-headline">
              🎯 Trò chơi Crossword
            </h1>
            {session?.user?.email === "admin@mln131.com" && (
              <div className="flex gap-2">
                <Link href="/admin/crossword/create">
                  <Button
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo mới
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Quản lý
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <p className="text-xl text-white/80 mb-6">
            Thử thách trí tuệ với trò chơi ô chữ tìm keyword theo chủ đề
            Marx-Lenin
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span>Tìm keyword bí mật</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Trả lời câu hỏi</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Học tập tương tác</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-[#44392d] mb-2">
                {games.length}
              </div>
              <div className="text-sm text-gray-600">Trò chơi có sẵn</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-[#44392d] mb-2">
                {games.reduce((sum, game) => sum + game._count.questions, 0)}
              </div>
              <div className="text-sm text-gray-600">Tổng câu hỏi</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-[#44392d] mb-2">
                {games.filter((g) => g.theme).length}
              </div>
              <div className="text-sm text-gray-600">Chủ đề khác nhau</div>
            </CardContent>
          </Card>
        </div>

        {/* Games List */}
        {games.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Chưa có trò chơi nào
              </h3>
              <p className="text-gray-600 mb-6">
                Hiện tại chưa có trò chơi crossword nào được xuất bản
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card
                key={game.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-[#44392d] line-clamp-2">
                      {game.title}
                    </CardTitle>
                    <Badge variant="outline" className="ml-2">
                      {game._count.questions} câu
                    </Badge>
                  </div>
                  {game.theme && (
                    <p className="text-sm text-gray-600 font-medium">
                      📚 {game.theme}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {game.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {game.description}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Key className="h-3 w-3" />
                      <span>Keyword: {game.keyword.length} chữ cái</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(game.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="h-3 w-3" />
                      <span>Tác giả: {game.createdBy.name}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      asChild
                      className="w-full bg-[#44392d] hover:bg-[#5a4a3a] text-white"
                    >
                      <Link href={`/crossword/${game.id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Bắt đầu chơi
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* How to Play */}
        <Card className="mt-12 bg-gradient-to-r from-[#44392d]/5 to-[#494f34]/5 border-[#44392d]/20">
          <CardHeader>
            <CardTitle className="text-[#44392d] text-center">
              Cách chơi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl mb-2">📝</div>
                <h4 className="font-semibold text-[#44392d]">
                  Trả lời câu hỏi
                </h4>
                <p className="text-sm text-gray-600">
                  Đọc và trả lời các câu hỏi gợi ý để mở khóa từng chữ cái của
                  keyword
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl mb-2">🔓</div>
                <h4 className="font-semibold text-[#44392d]">
                  Mở khóa chữ cái
                </h4>
                <p className="text-sm text-gray-600">
                  Mỗi câu trả lời đúng sẽ mở khóa một chữ cái trong keyword bí
                  mật
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold text-[#44392d]">Đoán keyword</h4>
                <p className="text-sm text-gray-600">
                  Đoán keyword bất cứ lúc nào hoặc chờ mở khóa tất cả chữ cái
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
