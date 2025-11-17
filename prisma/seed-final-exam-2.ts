import { PrismaClient } from '@prisma/client';
import { finalExam2Questions } from './final-exam-2-data';

const prisma = new PrismaClient();

async function main() {
  const userId = 'cmhwf7dat000gok73905yqk8v';

  console.log('🔍 Checking user...');
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  console.log(`✅ Found user: ${user.name || user.email}`);

  // Check if quiz already exists
  const existingQuiz = await prisma.quiz.findFirst({
    where: {
      title: 'Final Exam 2',
      authorId: userId,
    },
  });

  if (existingQuiz) {
    console.log('⚠️  Quiz "Final Exam 2" already exists. Deleting old version...');
    await prisma.quiz.delete({
      where: { id: existingQuiz.id },
    });
  }

  console.log('📝 Creating quiz with 60 questions...');

  // Create quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Final Exam 2',
      authorId: userId,
      isPublic: true,
    },
  });

  console.log(`✅ Created quiz: ${quiz.title}`);
  console.log('📝 Adding questions...');

  // Add all 60 questions
  let count = 0;
  for (const q of finalExam2Questions) {
    await prisma.question.create({
      data: {
        quizId: quiz.id,
        prompt: q.prompt,
        options: q.options,
        answer: q.answer,
        answers: [q.answer],
      },
    });
    count++;
    if (count % 10 === 0) {
      console.log(`  ✓ Added ${count} questions...`);
    }
  }

  console.log(`\n✅ Successfully created quiz with ${count} questions!`);
  console.log(`   Quiz ID: ${quiz.id}`);
  console.log(`   Title: ${quiz.title}`);
  console.log(`   Author: ${user.name || user.email}`);
  console.log(`   Public: ${quiz.isPublic}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
