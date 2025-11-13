import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { timelineEvents } from '../src/lib/timeline-events';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mln131.com' },
    update: {},
    create: {
      email: 'admin@mln131.com',
      name: 'Admin MLN131',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Seed timeline events
  console.log('\n📅 Seeding timeline events...');
  
  let createdCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < timelineEvents.length; i++) {
    const event = timelineEvents[i];
    const year = Number.parseInt(event.year);

    // Check if event already exists by year and title
    const existing = await prisma.timelineEvent.findFirst({
      where: {
        year,
        title: event.title,
      },
    });

    if (existing) {
      // Update existing event
      await prisma.timelineEvent.update({
        where: { id: existing.id },
        data: {
          summary: event.description,
          order: i + 1,
        },
      });
      updatedCount++;
      console.log(`  🔄 Updated: ${event.year} - ${event.title}`);
    } else {
      // Create new event
      await prisma.timelineEvent.create({
        data: {
          year,
          title: event.title,
          summary: event.description,
          order: i + 1,
        },
      });
      createdCount++;
      console.log(`  ✨ Created: ${event.year} - ${event.title}`);
    }
  }

  console.log(`\n✅ Timeline seeding completed!`);
  console.log(`   - Created: ${createdCount} events`);
  console.log(`   - Updated: ${updatedCount} events`);
  console.log(`   - Total: ${timelineEvents.length} events`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
