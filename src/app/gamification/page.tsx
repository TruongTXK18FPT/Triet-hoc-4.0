'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  Star, 
  Award, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  FileText, 
  Brain,
  Medal,
  Crown,
  Loader2,
  Target
} from 'lucide-react';
import { 
  calculateLevel, 
  calculateRank, 
  getXpForNextLevel, 
  getXpProgress, 
  formatStudyTime,
  RANK_COLORS,
  type RankType 
} from '@/lib/gamification';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BadgeShowcase } from '@/components/gamification/BadgeShowcase';

type UserProfile = {
  id: string;
  level: number;
  experience: number;
  rank: RankType;
  totalStudyTime: number;
  coursesCompleted: number;
  quizzesCompleted: number;
  blogsCreated: number;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  badges: Array<{
    id: string;
    earnedAt: string;
    badge: {
      id: string;
      name: string;
      description: string;
      icon: string;
      category: string;
    };
  }>;
  activities: Array<{
    id: string;
    type: string;
    description: string;
    xpEarned: number;
    createdAt: string;
  }>;
};

type LeaderboardEntry = UserProfile & { position: number };

export default function GamificationPage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardType, setLeaderboardType] = useState<'xp' | 'courses' | 'quizzes' | 'blogs' | 'time'>('xp');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
    fetchLeaderboard();
  }, [status, leaderboardType]);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/gamification/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchLeaderboard() {
    try {
      const response = await fetch(`/api/gamification/leaderboard?type=${leaderboardType}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        const withPositions = data.leaderboard.map((entry: UserProfile, index: number) => ({
          ...entry,
          position: index + 1,
        }));
        setLeaderboard(withPositions);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const RankBadge = ({ rank }: { rank: RankType }) => {
    const colors = RANK_COLORS[rank];
    return (
      <div className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-white bg-gradient-to-r shadow-lg",
        colors.bg,
        colors.glow
      )}>
        <Crown className="w-5 h-5" />
        <span>{rank}</span>
      </div>
    );
  };

  const ProfileCard = () => {
    if (!profile || !session) {
      return (
        <Card className="border-2">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Đăng nhập để xem hồ sơ gamification của bạn</p>
            <Button asChild>
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    const nextLevelXp = getXpForNextLevel(profile.level);
    const progress = getXpProgress(profile.experience, profile.level);

    return (
      <Card className="border-2 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-primary">
              <AvatarImage src={profile.user.image || undefined} />
              <AvatarFallback className="text-2xl font-bold">
                {profile.user.name?.[0] || profile.user.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{profile.user.name || 'Học viên'}</CardTitle>
              <RankBadge rank={profile.rank} />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">{profile.level}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* XP Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Kinh nghiệm</span>
              <span className="font-semibold">{profile.experience} / {nextLevelXp} XP</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<BookOpen className="w-5 h-5" />}
              label="Khóa học"
              value={profile.coursesCompleted}
              color="text-blue-500"
            />
            <StatCard
              icon={<Brain className="w-5 h-5" />}
              label="Quiz"
              value={profile.quizzesCompleted}
              color="text-green-500"
            />
            <StatCard
              icon={<FileText className="w-5 h-5" />}
              label="Blog"
              value={profile.blogsCreated}
              color="text-purple-500"
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              label="Thời gian"
              value={formatStudyTime(profile.totalStudyTime)}
              color="text-orange-500"
            />
          </div>

          {/* Badges Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Huy hiệu ({profile.badges.length})
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const tabElement = document.querySelector('[value="badges"]') as HTMLElement;
                  if (tabElement) tabElement.click();
                }}
              >
                Xem tất cả →
              </Button>
            </div>
            {profile.badges.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {profile.badges.slice(0, 12).map((userBadge) => (
                  <div
                    key={userBadge.id}
                    className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-2 border-yellow-200 dark:border-yellow-800 hover:scale-105 transition-transform cursor-pointer"
                    title={`${userBadge.badge.name}\n${userBadge.badge.description}`}
                  >
                    <div className="text-3xl mb-1">{userBadge.badge.icon}</div>
                    <div className="text-xs text-center font-semibold line-clamp-2">
                      {userBadge.badge.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Chưa có huy hiệu nào. Hãy hoàn thành các nhiệm vụ để nhận huy hiệu!
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const tabElement = document.querySelector('[value="badges"]') as HTMLElement;
                    if (tabElement) tabElement.click();
                  }}
                >
                  Xem các huy hiệu có thể đạt được
                </Button>
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Hoạt động gần đây
            </h3>
            {profile.activities.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {profile.activities.slice(0, 10).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      +{activity.xpEarned} XP
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có hoạt động nào.</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const LeaderboardCard = () => {
    const getIcon = (position: number) => {
      if (position === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
      if (position === 2) return <Medal className="w-6 h-6 text-gray-400" />;
      if (position === 3) return <Medal className="w-6 h-6 text-orange-600" />;
      return <span className="text-lg font-bold text-muted-foreground">{position}</span>;
    };

    const getValue = (entry: LeaderboardEntry) => {
      switch (leaderboardType) {
        case 'xp':
          return `${entry.experience.toLocaleString()} XP`;
        case 'courses':
          return `${entry.coursesCompleted} khóa`;
        case 'quizzes':
          return `${entry.quizzesCompleted} quiz`;
        case 'blogs':
          return `${entry.blogsCreated} blog`;
        case 'time':
          return formatStudyTime(entry.totalStudyTime);
      }
    };

    return (
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Bảng Xếp Hạng
          </CardTitle>
          <CardDescription>Top 100 học viên xuất sắc nhất</CardDescription>
          
          <div className="flex gap-2 flex-wrap pt-4">
            <Button
              variant={leaderboardType === 'xp' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLeaderboardType('xp')}
            >
              <Star className="w-4 h-4 mr-1" />
              Kinh nghiệm
            </Button>
            <Button
              variant={leaderboardType === 'courses' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLeaderboardType('courses')}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Khóa học
            </Button>
            <Button
              variant={leaderboardType === 'quizzes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLeaderboardType('quizzes')}
            >
              <Brain className="w-4 h-4 mr-1" />
              Quiz
            </Button>
            <Button
              variant={leaderboardType === 'blogs' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLeaderboardType('blogs')}
            >
              <FileText className="w-4 h-4 mr-1" />
              Blog
            </Button>
            <Button
              variant={leaderboardType === 'time' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLeaderboardType('time')}
            >
              <Clock className="w-4 h-4 mr-1" />
              Thời gian
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg transition-all",
                  entry.user.id === profile?.user.id
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-muted/30 hover:bg-muted/50",
                  entry.position <= 3 && "shadow-lg"
                )}
              >
                <div className="flex items-center justify-center w-10">
                  {getIcon(entry.position)}
                </div>
                
                <Avatar className="w-12 h-12">
                  <AvatarImage src={entry.user.image || undefined} />
                  <AvatarFallback>
                    {entry.user.name?.[0] || entry.user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {entry.user.name || entry.user.email}
                    {entry.user.id === profile?.user.id && (
                      <span className="ml-2 text-xs text-primary">(Bạn)</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Level {entry.level}
                    </Badge>
                    <RankBadge rank={entry.rank} />
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-lg">{getValue(entry)}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.badges.length} huy hiệu
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Thi Đua Học Tập
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nâng cấp level, thu thập huy hiệu và cạnh tranh với các học viên khác trên bảng xếp hạng!
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="profile" className="text-base">
                <Star className="w-4 h-4 mr-2" />
                Hồ Sơ
              </TabsTrigger>
              <TabsTrigger value="badges" className="text-base">
                <Target className="w-4 h-4 mr-2" />
                Huy Hiệu
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="text-base">
                <Trophy className="w-4 h-4 mr-2" />
                Xếp Hạng
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-8">
              <ProfileCard />
            </TabsContent>

            <TabsContent value="badges" className="mt-8">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
              ) : profile ? (
                <BadgeShowcase 
                  userBadges={profile.badges}
                  userStats={{
                    level: profile.level,
                    coursesCompleted: profile.coursesCompleted,
                    quizzesCompleted: profile.quizzesCompleted,
                    blogsCreated: profile.blogsCreated,
                  }}
                />
              ) : (
                <Card className="border-2">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground mb-4">Đăng nhập để xem huy hiệu</p>
                    <Button asChild>
                      <Link href="/login">Đăng nhập</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="leaderboard" className="mt-8">
              <LeaderboardCard />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-background/50 border-2 hover:border-primary/50 transition-colors">
      <div className={cn("mb-2", color)}>{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground text-center">{label}</div>
    </div>
  );
}
