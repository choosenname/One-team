import * as z from "zod";

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

export const ProfileSchema = z.object({
    name: z.optional(z.string().min(3,{
        message: "Name is required",
    })),
    password: z.string().min(6, {
        message: "Minimum 6 characters required",
    }),
    imageUrl: z.string().min(1, {
        message: "Profile image is required."
    }),
});

export const ServerSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."
    })
});