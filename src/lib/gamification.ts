// Gamification System Configuration and Utilities

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, // Levels 1-10
  15000, 20000, 26000, 33000, 41000, 50000, 60000, 72000, 85000, 100000, // Levels 11-20
];

export const RANK_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 1000,
  GOLD: 5000,
  DIAMOND: 15000,
  MASTER: 50000,
};

export type RankType = keyof typeof RANK_THRESHOLDS;

export const RANK_COLORS = {
  BRONZE: {
    bg: 'from-orange-800 to-orange-600',
    text: 'text-orange-600',
    border: 'border-orange-600',
    glow: 'shadow-orange-500/50',
  },
  SILVER: {
    bg: 'from-gray-400 to-gray-300',
    text: 'text-gray-400',
    border: 'border-gray-400',
    glow: 'shadow-gray-400/50',
  },
  GOLD: {
    bg: 'from-yellow-400 to-yellow-500',
    text: 'text-yellow-500',
    border: 'border-yellow-500',
    glow: 'shadow-yellow-500/50',
  },
  DIAMOND: {
    bg: 'from-cyan-400 to-blue-500',
    text: 'text-cyan-400',
    border: 'border-cyan-400',
    glow: 'shadow-cyan-400/50',
  },
  MASTER: {
    bg: 'from-purple-500 to-pink-500',
    text: 'text-purple-500',
    border: 'border-purple-500',
    glow: 'shadow-purple-500/50',
  },
};

export const XP_REWARDS = {
  COURSE_STARTED: 10,
  COURSE_COMPLETED: 500,
  CHAPTER_COMPLETED: 50,
  QUIZ_COMPLETED: 100,
  QUIZ_PERFECT_SCORE: 200,
  BLOG_CREATED: 150,
  BLOG_PUBLISHED: 300,
  COMMENT_POSTED: 20,
  STUDY_STREAK: 50,
  DAILY_LOGIN: 10,
};

export const INITIAL_BADGES = [
  // Learning Badges
  {
    code: 'first_step',
    name: 'Bước Đầu Tiên',
    description: 'Hoàn thành khóa học đầu tiên',
    icon: '🎯',
    category: 'COURSE',
    requirement: 'Hoàn thành 1 khóa học',
    xpReward: 100,
  },
  {
    code: 'philosophy_novice',
    name: 'Nhà Tư Tưởng Trẻ',
    description: 'Hoàn thành 3 khóa học triết học',
    icon: '🏅',
    category: 'COURSE',
    requirement: 'Hoàn thành 3 khóa học',
    xpReward: 300,
  },
  {
    code: 'marx_expert',
    name: 'Hiểu Marx Trong 5 Phút',
    description: 'Hoàn thành khóa học về chủ nghĩa Marx',
    icon: '🎓',
    category: 'COURSE',
    requirement: 'Hoàn thành khóa học Marx',
    xpReward: 200,
  },
  {
    code: 'future_philosopher',
    name: 'Triết Gia Tương Lai',
    description: 'Đạt level 10',
    icon: '🌟',
    category: 'LEARNING',
    requirement: 'Đạt level 10',
    xpReward: 500,
  },
  
  // Quiz Badges
  {
    code: 'quiz_master',
    name: 'Bậc Thầy Quiz',
    description: 'Hoàn thành 10 bài quiz',
    icon: '📝',
    category: 'QUIZ',
    requirement: 'Hoàn thành 10 quiz',
    xpReward: 250,
  },
  {
    code: 'perfect_score',
    name: 'Điểm Tuyệt Đối',
    description: 'Đạt điểm 100% trong quiz',
    icon: '💯',
    category: 'QUIZ',
    requirement: 'Đạt 100% trong 1 quiz',
    xpReward: 150,
  },
  {
    code: 'quiz_creator',
    name: 'Người Sáng Tạo',
    description: 'Tạo 5 bài quiz',
    icon: '🎨',
    category: 'QUIZ',
    requirement: 'Tạo 5 quiz',
    xpReward: 300,
  },
  
  // Blog Badges
  {
    code: 'first_blog',
    name: 'Nhà Văn Mới',
    description: 'Viết blog đầu tiên',
    icon: '✍️',
    category: 'BLOG',
    requirement: 'Viết 1 blog',
    xpReward: 150,
  },
  {
    code: 'prolific_writer',
    name: 'Nhà Văn Đa Năng',
    description: 'Viết 10 bài blog',
    icon: '📚',
    category: 'BLOG',
    requirement: 'Viết 10 blog',
    xpReward: 500,
  },
  
  // Social Badges
  {
    code: 'social_butterfly',
    name: 'Người Giao Lưu',
    description: 'Bình luận 20 lần',
    icon: '💬',
    category: 'SOCIAL',
    requirement: 'Bình luận 20 lần',
    xpReward: 200,
  },
  
  // Special Badges
  {
    code: 'early_adopter',
    name: 'Người Tiên Phong',
    description: 'Đăng ký trong tháng đầu',
    icon: '🚀',
    category: 'SPECIAL',
    requirement: 'Đăng ký sớm',
    xpReward: 500,
  },
  {
    code: 'dedicated_learner',
    name: 'Học Viên Tận Tâm',
    description: 'Học 7 ngày liên tiếp',
    icon: '🔥',
    category: 'LEARNING',
    requirement: 'Streak 7 ngày',
    xpReward: 300,
  },
];

// Calculate level from XP
export function calculateLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

// Calculate rank from XP
export function calculateRank(xp: number): RankType {
  if (xp >= RANK_THRESHOLDS.MASTER) return 'MASTER';
  if (xp >= RANK_THRESHOLDS.DIAMOND) return 'DIAMOND';
  if (xp >= RANK_THRESHOLDS.GOLD) return 'GOLD';
  if (xp >= RANK_THRESHOLDS.SILVER) return 'SILVER';
  return 'BRONZE';
}

// Get XP needed for next level
export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  }
  return LEVEL_THRESHOLDS[currentLevel];
}

// Get XP progress percentage for current level
export function getXpProgress(xp: number, level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) return 100;
  
  const currentLevelXp = LEVEL_THRESHOLDS[level - 1];
  const nextLevelXp = LEVEL_THRESHOLDS[level];
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  
  return Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100));
}

// Format study time
export function formatStudyTime(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours} giờ`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days} ngày ${remainingHours}h` : `${days} ngày`;
}
