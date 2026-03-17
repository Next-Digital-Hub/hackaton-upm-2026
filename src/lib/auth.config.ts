import type { NextAuthConfig } from "next-auth";

/**
 * NextAuth config that is safe for Edge Runtime (middleware).
 * Does NOT import Prisma or any Node.js-only modules.
 *
 * Type augmentations for custom user fields live in auth.ts.
 * Here we cast via `unknown` to avoid importing Prisma types.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as {
          id: string;
          role: string;
          province: string;
          housingType: string;
          specialNeeds: string[];
        };
        token.id = u.id;
        token.role = u.role;
        token.province = u.province;
        token.housingType = u.housingType;
        token.specialNeeds = u.specialNeeds;
      }
      return token;
    },
    async session({ session, token }) {
      const u = session.user as unknown as {
        id: string;
        role: string;
        province: string;
        housingType: string;
        specialNeeds: string[];
      };
      u.id = token.id as string;
      u.role = token.role as string;
      u.province = token.province as string;
      u.housingType = token.housingType as string;
      u.specialNeeds = token.specialNeeds as string[];
      return session;
    },
    async authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isOnAuth =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn) {
        return false;
      }

      // Admin route protection
      if (nextUrl.pathname.startsWith("/admin")) {
        const user = session.user as unknown as { role: string };
        if (user.role !== "ADMIN") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
