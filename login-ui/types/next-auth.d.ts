
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      congregationNumber: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      existsInDb: boolean;
      
    };
  }
}
