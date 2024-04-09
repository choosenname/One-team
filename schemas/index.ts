import * as z from "zod";
import {UserRole} from "@prisma/client";

export const LoginSchema = z.object({
    name: z.string().min(1,{
        message: "Name is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});

export const RegisterSchema = z.object({
    name: z.string().min(1,{
        message: "Name is required",
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
});

export const SettingsSchema = z.object({
    name: z.optional(z.string().min(3,{
        message: "Name is required",
    })),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
});
