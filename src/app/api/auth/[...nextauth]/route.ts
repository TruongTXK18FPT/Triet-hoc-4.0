import NextAuth, { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub || profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER",
        } as any;
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        return ok
          ? ({
              id: user.id,
              name: user.name || "",
              email: user.email,
              role: user.role,
            } as any)
          : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.email) {
        // Lấy role và image từ database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true, image: true, name: true },
        });
        token.role = (dbUser?.role || "USER") as string;
        token.id = user.id;
        token.image = dbUser?.image || user.image || null;
        token.name = dbUser?.name || user.name || null;
      } else if (token.email) {
        // Refresh user data from database on each request
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { role: true, image: true, name: true },
        });
        if (dbUser) {
          token.role = (dbUser.role || "USER") as string;
          token.image = dbUser.image || null;
          token.name = dbUser.name || null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role || "USER";
        (session.user as any).id = (token as any).id;
        (session.user as any).image = (token as any).image || session.user.image || null;
        (session.user as any).name = (token as any).name || session.user.name || null;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
