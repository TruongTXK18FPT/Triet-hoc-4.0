'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle } from 'lucide-react';
import { INITIAL_BADGES } from '@/lib/gamification';

type UserBadge = {
  id: string;
  earnedAt: string;
  badge: {
    id: string;
    code?: string; // Optional for backward compatibility
    name: string;
    description: string;
    icon: string;
    category: string;
  };
};

type BadgeDisplayProps = {
  userBadges: UserBadge[];
  userStats: {
    level: number;
    coursesCompleted: number;
    quizzesCompleted: number;
    blogsCreated: number;
  };
};

export function BadgeShowcase({ userBadges, userStats }: BadgeDisplayProps) {
  const earnedBadgeCodes = new Set(
    userBadges
      .map(ub => ub.badge.code || ub.badge.name) // Fallback to name if code missing
      .filter(Boolean)
  );

  const getBadgeProgress = (badge: typeof INITIAL_BADGES[0]): { current: number; required: number; percentage: number } => {
    let current = 0;
    let required = 0;

    switch (badge.code) {
      case 'first_step':
        current = userStats.coursesCompleted;
        required = 1;
        break;
      case 'philosophy_novice':
        current = userStats.coursesCompleted;
        required = 3;
        break;
      case 'future_philosopher':
        current = userStats.level;
        required = 10;
        break;
      case 'quiz_master':
        current = userStats.quizzesCompleted;
        required = 10;
        break;
      case 'perfect_score':
        // This requires specific check - assume earned if user has it
        current = earnedBadgeCodes.has('perfect_score') ? 1 : 0;
        required = 1;
        break;
      case 'quiz_creator':
        // Assume 0 for now - would need separate API call
        current = 0;
        required = 5;
        break;
      case 'first_blog':
        current = userStats.blogsCreated;
        required = 1;
        break;
      case 'prolific_writer':
        current = userStats.blogsCreated;
        required = 10;
        break;
      default:
        current = 0;
        required = 1;
    }

    const percentage = Math.min(100, Math.round((current / required) * 100));
    return { current: Math.min(current, required), required, percentage };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COURSE':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'QUIZ':
        return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'BLOG':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'LEARNING':
        return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 'SOCIAL':
        return 'from-pink-500/20 to-pink-600/20 border-pink-500/30';
      case 'SPECIAL':
        return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      COURSE: '📚 Khóa học',
      QUIZ: '🧠 Quiz',
      BLOG: '✍️ Blog',
      LEARNING: '🎓 Học tập',
      SOCIAL: '💬 Giao lưu',
      SPECIAL: '⭐ Đặc biệt',
    };
    return names[category] || category;
  };

  // Group badges by category
  const badgesByCategory: Record<string, typeof INITIAL_BADGES> = {};
  INITIAL_BADGES.forEach(badge => {
    if (!badgesByCategory[badge.category]) {
      badgesByCategory[badge.category] = [];
    }
    badgesByCategory[badge.category].push(badge);
  });

  return (
    <div className="space-y-6">
      {Object.entries(badgesByCategory).map(([category, badges]) => (
        <Card key={category} className="border-2">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              {getCategoryName(category)}
              <Badge variant="outline">
                {badges.filter(b => earnedBadgeCodes.has(b.code)).length} / {badges.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge) => {
                const isEarned = earnedBadgeCodes.has(badge.code);
                const progress = getBadgeProgress(badge);

                return (
                  <div
                    key={badge.code}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      isEarned
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-400 dark:border-yellow-600 shadow-lg'
                        : `bg-gradient-to-br ${getCategoryColor(category)} hover:scale-[1.02]`
                    }`}
                  >
                    {isEarned && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-6 h-6 text-green-500 fill-green-100 dark:fill-green-900" />
                      </div>
                    )}

                    <div className="flex gap-4">
                      {/* Badge Icon */}
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-4xl ${
                        isEarned ? 'bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-900 dark:to-orange-900' : 'bg-muted/50 grayscale opacity-60'
                      }`}>
                        {isEarned ? badge.icon : <Lock className="w-8 h-8 text-muted-foreground" />}
                      </div>

                      {/* Badge Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-lg mb-1 ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {badge.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {badge.description}
                        </p>

                        {/* Progress Bar */}
                        {!isEarned && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{badge.requirement}</span>
                              <span className="font-semibold">
                                {progress.current} / {progress.required}
                              </span>
                            </div>
                            <Progress value={progress.percentage} className="h-2" />
                          </div>
                        )}

                        {/* XP Reward */}
                        {isEarned && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                            +{badge.xpReward} XP
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
