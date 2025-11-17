import { PrismaClient } from '@prisma/client';

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

  console.log(`✅ Found user: ${user.name}`);

  // Check if quiz already exists
  const existingQuiz = await prisma.quiz.findFirst({
    where: {
      title: 'Final Exam 7',
      authorId: userId,
    },
  });

  if (existingQuiz) {
    console.log('🗑️  Deleting existing quiz...');
    await prisma.quiz.delete({
      where: { id: existingQuiz.id },
    });
    console.log('✅ Deleted existing quiz');
  }

  // Import questions from data file
  const { finalExam7Questions } = await import('./final-exam-7-data');

  console.log(`📝 Creating quiz with ${finalExam7Questions.length} questions...`);

  // Create quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Final Exam 7',
      authorId: userId,
      isPublic: true,
    },
  });

  console.log(`✅ Created quiz: ${quiz.title}`);

  // Add questions
  console.log('📝 Adding questions...');
  let count = 0;

  for (const q of finalExam7Questions) {
    await prisma.question.create({
      data: {
        quizId: quiz.id,
        prompt: q.prompt,
        options: q.options,
        answer: q.answer !== undefined ? q.answer : q.answers[0],
        answers: q.answers || [q.answer],
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
  console.log(`   Author: ${user.name}`);
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
