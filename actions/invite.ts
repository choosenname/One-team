"use server"; // Использование серверного API

import { db } from "@/lib/db"; // Импорт объекта базы данных
import { Server, User } from "@prisma/client"; // Импорт типов сервера и пользователя из Prisma
import { getDepartmentById } from "@/lib/departments"; // Импорт функции для получения отдела по идентификатору

// Функция для приглашения пользователя на сервер
export const inviteUser = async (user: User) => {
    // Получение отдела пользователя по его идентификатору
    const department = await getDepartmentById(user.departmentId);

    // Проверка наличия отдела
    if (!department) {
        return { error: "Department not found" }; // Возврат ошибки, если отдел не найден
    }

    // Поиск серверов для обновления, которые относятся к указанному отделу или общему отделу "general"
    const serversToUpdate = await db.server.findMany({
        where: {
            OR: [{ department: department }, { department: { department: 'general' } }]
        }
    });

    // Создание массива промисов для обновления серверов
    const updatePromises = serversToUpdate.map(async (server) => {
        // Обновление сервера, добавление пользователя в список членов
        const updatedServer = await db.server.update({
            where: {
                id: server.id,
            },
            data: {
                members: {
                    create: [{
                        userId: user.id,
                    }]
                }
            }
        });
        return updatedServer; // Возврат обновленного сервера
    });

    return { success: "Success" }; // Возврат успешного результата
};

// Функция для приглашения сервера пользователям
export const inviteServer = async (server: Server) => {
    // Получение отдела сервера по его идентификатору
    const department = await getDepartmentById(server.departmentId);

    // Проверка наличия отдела
    if (!department) {
        return { error: "Department not found" }; // Возврат ошибки, если отдел не найден
    }

    // Поиск пользователей для обновления, которые относятся к указанному отделу или общему отделу "general"
    const usersToUpdate = await db.user.findMany({
        where: {
            OR: [{ department: department }, { department: { department: 'general' } }]
        }
    })

    // Создание массива промисов для обновления пользователей
    const updatePromises = usersToUpdate.map(async (user) => {
        // Обновление сервера, добавление пользователя в список членов
        const updatedServer = await db.server.update({
            where: {
                id: server.id,
            },
            data: {
                members: {
                    create: [{
                        userId: user.id,
                    }]
                }
            }
        });
        return updatedServer; // Возврат обновленного сервера
    });

    return { success: "Success" }; // Возврат успешного результата
};
