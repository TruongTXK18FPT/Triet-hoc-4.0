-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "youtubeUrl" TEXT,
ALTER COLUMN "videoUrl" DROP NOT NULL;
