"use server"; // Использование серверной части кода

import * as z from "zod"; // Импорт библиотеки для валидации данных
import bcrypt from "bcryptjs"; // Импорт модуля для хеширования паролей

import { RegisterSchema } from "@/schemas"; // Импорт схемы регистрации из схем
import { db } from "@/lib/db"; // Импорт объекта базы данных
import { getUserByName } from "@/data/user"; // Импорт функции для получения пользователя по имени

// Функция для регистрации нового пользователя
export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values); // Проверка и валидация входных данных

    if (!validatedFields.success) {
        return { error: "Неверные данные!" }; // Возврат ошибки, если входные данные неверны
    }

    const { name, password, departmentId, post, office, startWork, endWork } = validatedFields.data; // Извлечение данных из валидированных данных
    const hashedPassword = await bcrypt.hash(password, 10); // Хеширование пароля

    const existingUser = await getUserByName(name); // Проверка существующего пользователя с таким же именем

    if (existingUser) {
        return { error: "Имя пользователя уже используется" }; // Возврат ошибки, если имя пользователя уже используется
    }

    // Создание нового пользователя в базе данных
    const user = await db.user.create({
        data: {
            name,
            password: hashedPassword,
            departmentId,
            imageUrl: "", // Пустая ссылка на изображение
            post,
            office,
            startWork,
            endWork,
        }
    });

    return { success: "Успешно", user: user }; // Возврат успешного результата и созданного пользователя
};
