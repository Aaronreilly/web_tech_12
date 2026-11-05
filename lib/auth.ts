import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { loginSchema } from "@/types";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await db.user.findUnique({ where: { email: parsed.data.email } });
        if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role } as any;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.id = (user as any).id; token.role = (user as any).role; }
      return token;
    },
    session({ session, token }) {
      (session.user as any).id = token.id;
      (session.user as any).role = token.role;
      return session;
    },
  },
};
