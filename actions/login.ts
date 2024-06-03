"use server"; // Использование серверной части кода

import * as z from "zod"; // Импорт библиотеки для валидации данных
import { LoginSchema } from "@/schemas"; // Импорт схемы входа из схем
import { signIn } from "@/auth"; // Импорт функции входа пользователя
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"; // Импорт маршрута по умолчанию для перенаправления после входа
import { AuthError } from "next-auth"; // Импорт класса ошибки аутентификации из NextAuth
import { getUserByName } from "@/data/user"; // Импорт функции для получения пользователя по имени

// Функция для входа пользователя
export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values); // Проверка и валидация входных данных

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }; // Возврат ошибки, если входные данные неверны
    }

    const { name, password } = validatedFields.data; // Получение имени и пароля из валидированных данных

    const existingUser = await getUserByName(name); // Поиск пользователя по имени

    if (!existingUser || !existingUser.name || !existingUser.password) {
        return { error: "Пользователь не существует!" }; // Возврат ошибки, если пользователь не найден
    }

    try {
        await signIn("credentials", { // Попытка входа пользователя
            name,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT, // Перенаправление пользователя после входа
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Неверные учетные данные!" }; // Возврат ошибки при неверных учетных данных
                default:
                    return { error: "Что-то пошло не так!" }; // Возврат общей ошибки
            }
        }

        throw error; // Проброс ошибки, если это не ошибка аутентификации
    }
};
