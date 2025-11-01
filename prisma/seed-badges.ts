import { PrismaClient } from '@prisma/client';
import { INITIAL_BADGES } from '../src/lib/gamification';

const prisma = new PrismaClient();

async function seedBadges() {
  console.log('🌱 Seeding badges...');
  
  for (const badgeData of INITIAL_BADGES) {
    const existing = await prisma.badge.findUnique({
      where: { code: badgeData.code },
    });
    
    if (!existing) {
      await prisma.badge.create({
        data: {
          code: badgeData.code,
          name: badgeData.name,
          description: badgeData.description,
          icon: badgeData.icon,
          category: badgeData.category as any,
          requirement: badgeData.requirement,
          xpReward: badgeData.xpReward,
        },
      });
      console.log(`✅ Created badge: ${badgeData.name}`);
    } else {
      console.log(`⏭️  Badge already exists: ${badgeData.name}`);
    }
  }
  
  console.log('✨ Badge seeding completed!');
}

async function main() {
  try {
    await seedBadges();
  } catch (error) {
    console.error('Error seeding badges:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
