import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn() {
      // Always allow sign-in
      return true;
    },

    async session({ session }) {
      const email = session?.user?.email;
      if (!email) return session;

      const dbUser = await prisma.login.findUnique({ where: { email } });

      if (dbUser) {
        session.user.existsInDb = true;
        session.user.name = dbUser.name;
        session.user.congregationNumber = dbUser.congregationNumber;
      } else {
        session.user.existsInDb = false;
      }

      return session;
    },

    async redirect({ baseUrl }) {
      // Force all redirects to a custom page that sets a cookie
      return `${baseUrl}/google-redirect`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
