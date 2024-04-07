import * as z from "zod";

export const LoginSchema = z.object({
    name: z.string().min(1,{
        message: "Name is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
});