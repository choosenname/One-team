import { NextResponse } from "next/server"; // Импорт компонента NextResponse из библиотеки next/server
import { MemberRole } from "@prisma/client"; // Импорт ролей участников из клиента Prisma

import { db } from "@/lib/db"; // Импорт модуля для работы с базой данных
import { currentUser } from "@/lib/auth"; // Импорт функции для получения текущего пользователя

// Экспорт асинхронной функции POST для обработки HTTP POST запросов
export async function POST(
    req: Request // Параметр: объект запроса
) {
    try {
        const user = await currentUser(); // Получение текущего пользователя

        // Проверка, авторизован ли пользователь
        if (!user || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 }); // Возврат ответа с ошибкой "Unauthorized", если пользователь не авторизован
        }

        const { name, type } = await req.json(); // Получение данных из тела запроса
        const { searchParams } = new URL(req.url); // Получение параметров из URL запроса

        const serverId = searchParams.get("serverId"); // Получение идентификатора сервера из параметров запроса

        // Проверка наличия идентификатора сервера в параметрах запроса
        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 }); // Возврат ответа с ошибкой "Server ID missing", если идентификатор сервера отсутствует
        }

        // Проверка, что имя канала не равно "general"
        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 }); // Возврат ответа с ошибкой "Name cannot be 'general'", если имя канала равно "general"
        }

        // Обновление данных сервера в базе данных, создавая новый канал
        const server = await db.server.update({
            where: {
                id: serverId, // Условие: идентификатор сервера
                members: {
                    some: {
                        userId: user.id, // Условие: идентификатор текущего пользователя
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR] // Условие: роль пользователя - администратор или модератор
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: { // Создание нового канала
                        userId: user.id, // Идентификатор текущего пользователя
                        name, // Имя канала
                        type, // Тип канала
                    }
                }
            }
        });

        return NextResponse.json(server); // Возврат ответа с обновленными данными сервера
    } catch (error) { // Обработка ошибок
        console.log("CHANNELS_POST", error); // Вывод информации об ошибке в консоль
        return new NextResponse("Internal Error", { status: 500 }); // Возврат ответа с ошибкой "Internal Error"
    }
}
