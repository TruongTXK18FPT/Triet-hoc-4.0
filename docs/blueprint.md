# **App Name**: Triết Học AI

## Core Features:

- AI Study Roadmap Generation: Generate personalized study roadmaps for Marxism-Leninism using AI, tailored to the student's current knowledge level and learning goals. This involves the AI LLM reasoning as a tool to use pieces of information and data.
- Interactive Quizzes: Provide interactive quizzes to test understanding of Marxism-Leninism concepts, with automated scoring and feedback.
- AI-Powered Content Explanation: Utilize AI to explain complex philosophical concepts in a simple, easy-to-understand manner. The AI LLM can reason whether to use its tool to search the internet, or rely only on its internal model.
- Timeline of Key Philosophical Events: Display a timeline of significant events in the history of philosophy, with detailed explanations and AI-powered insights.
- Student Progress Analytics: Provide a dashboard for students to track their progress, identify areas for improvement, and monitor their learning journey.

## Style Guidelines:

- Primary color: Dark brown (#44392d) to evoke a sense of academic depth and tradition.
- Background color: Beige-gray (#c1bdba), providing a warm, neutral backdrop for content.
- Accent color: Olive green (#494f34) to represent growth and intellectual harmony, used sparingly for interactive elements.
- Headings: 'Poppins' (sans-serif) for a modern and clean feel.
- Body text: 'Inter' (sans-serif) for readability and a light, accessible tone.
- Minimalist line-art icons in olive or beige tones, maintaining a consistent style across the platform.
- Balanced whitespace and a center composition to convey philosophical harmony, complemented by subtle gradients.
- Gentle fade-in, slide-up, and glowing effects to create a visually engaging and enlightened user experience.

## Data & Storage

Add your Neon Postgres connection string to `.env` as `DATABASE_URL`:

```
DATABASE_URL="postgresql://neondb_owner:***@ep-twilight-tree-a18wb3gk-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

Then generate and migrate Prisma:

```
npm run prisma:generate
npm run prisma:migrate -- --name init
```