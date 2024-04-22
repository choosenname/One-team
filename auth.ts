import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import {UserRole} from "@prisma/client";
import {getUserById} from "@/data/user";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    unstable_update
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    callbacks: {
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            if(session.user) {
                session.user.name = token.name;
                session.user.imageUrl = token.imageUrl as string;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            token.name = existingUser.name;
            token.role = existingUser.role;
            token.imageUrl = existingUser.imageUrl;

            return token;
        }
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
    secret: process.env.AUTH_SECRET || "any random string",
});