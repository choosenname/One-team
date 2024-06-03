import { UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole,
    imageUrl: string | null,
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}