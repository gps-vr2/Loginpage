// app/api/auth/authOptions.ts

import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

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
      return true;
    },
    async session({ session }) {
      const email = session?.user?.email;
      if (!email) return session;

      const dbUser = await prisma.login.findUnique({
        where: { email },
      });

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
      return `${baseUrl}/google-redirect`;
    },
  },
};
