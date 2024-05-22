import * as z from "zod";

export const LoginSchema = z.object({
    name: z.string().min(1, {
        message: "Имя обязательно для заполнения",
    }),
    password: z.string().min(1, {
        message: "Пароль обязателен для заполнения",
    })
});

export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: "Имя обязательно для заполнения",
    }),
    password: z.string().min(6, {
        message: "Требуется минимум 6 символов",
    }),
    departmentId: z.string().min(1, {
        message: "Отдел обязателен для заполнения",
    }),
});

export const ProfileSchema = z.object({
    name: z.optional(z.string().min(3, {
        message: "Имя обязательно для заполнения",
    })),
    password: z.string().min(6, {
        message: "Требуется минимум 6 символов",
    }),
    imageUrl: z.string().min(1, {
        message: "Изображение профиля обязательно для заполнения",
    }),
});

export const ServerSchema = z.object({
    name: z.string().min(1, {
        message: "Имя сервера обязательно для заполнения",
    }),
    imageUrl: z.string().min(1, {
        message: "Изображение сервера обязательно для заполнения",
    })
});

export const ForwardMessageSchema = z.object({
    forwardChannelId: z.string().min(1, {
        message: "Канал обязателен для заполнения",
    })
});
