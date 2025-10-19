-- CreateTable
CREATE TABLE "CrosswordGame" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "keyword" TEXT NOT NULL,
    "theme" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL DEFAULT 'cmgs1ags6000017wrlybf5q42',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrosswordGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrosswordQuestion" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    "keywordCharIndex" INTEGER NOT NULL DEFAULT 0,
    "keywordColumn" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "CrosswordQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterQuestion" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "explanation" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ChapterQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "completedPercent" INTEGER NOT NULL DEFAULT 0,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterProgress" (
    "id" TEXT NOT NULL,
    "courseProgressId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "videoWatched" BOOLEAN NOT NULL DEFAULT false,
    "quizCompleted" BOOLEAN NOT NULL DEFAULT false,
    "quizScore" INTEGER,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ChapterProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CrosswordGame_createdById_idx" ON "CrosswordGame"("createdById");

-- CreateIndex
CREATE INDEX "CrosswordGame_isPublic_idx" ON "CrosswordGame"("isPublic");

-- CreateIndex
CREATE INDEX "CrosswordQuestion_gameId_idx" ON "CrosswordQuestion"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "CrosswordQuestion_gameId_order_key" ON "CrosswordQuestion"("gameId", "order");

-- CreateIndex
CREATE INDEX "Course_isPublished_order_idx" ON "Course"("isPublished", "order");

-- CreateIndex
CREATE INDEX "Chapter_courseId_order_idx" ON "Chapter"("courseId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_courseId_order_key" ON "Chapter"("courseId", "order");

-- CreateIndex
CREATE INDEX "ChapterQuestion_chapterId_order_idx" ON "ChapterQuestion"("chapterId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterQuestion_chapterId_order_key" ON "ChapterQuestion"("chapterId", "order");

-- CreateIndex
CREATE INDEX "CourseProgress_userId_idx" ON "CourseProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseProgress_userId_courseId_key" ON "CourseProgress"("userId", "courseId");

-- CreateIndex
CREATE INDEX "ChapterProgress_courseProgressId_idx" ON "ChapterProgress"("courseProgressId");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterProgress_courseProgressId_chapterId_key" ON "ChapterProgress"("courseProgressId", "chapterId");

-- AddForeignKey
ALTER TABLE "CrosswordGame" ADD CONSTRAINT "CrosswordGame_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrosswordQuestion" ADD CONSTRAINT "CrosswordQuestion_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "CrosswordGame"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterQuestion" ADD CONSTRAINT "ChapterQuestion_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterProgress" ADD CONSTRAINT "ChapterProgress_courseProgressId_fkey" FOREIGN KEY ("courseProgressId") REFERENCES "CourseProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterProgress" ADD CONSTRAINT "ChapterProgress_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
