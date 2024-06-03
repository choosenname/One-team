import { NextResponse } from "next/server"; // Импорт класса NextResponse из модуля next/server
import { MemberRole } from "@prisma/client"; // Импорт ролей участников из Prisma
import { db } from "@/lib/db"; // Импорт объекта базы данных из модуля базы данных
import { currentUser } from "@/lib/auth"; // Импорт функции текущего пользователя из модуля авторизации

// Функция DELETE для удаления канала
export async function DELETE(
    req: Request, // Запрос на удаление канала
    { params }: { params: { channelId: string } } // Параметры запроса (идентификатор канала)
) {
    try {
        const user = await currentUser(); // Получение текущего пользователя
        const { searchParams } = new URL(req.url); // Получение параметров запроса

        const serverId = searchParams.get("serverId"); // Получение идентификатора сервера из параметров запроса

        if (!user) { // Если пользователь не авторизован
            return new NextResponse("Unauthorized", { status: 401 }); // Возврат ответа с ошибкой "Unauthorized"
        }

        if (!serverId) { // Если отсутствует идентификатор сервера
            return new NextResponse("Server ID missing", { status: 400 }); // Возврат ответа с ошибкой "Server ID missing"
        }

        if (!params.channelId) { // Если отсутствует идентификатор канала
            return new NextResponse("Channel ID missing", { status: 400 }); // Возврат ответа с ошибкой "Channel ID missing"
        }

        // Обновление сервера в базе данных, удаляя указанный канал
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        userId: user.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR], // Проверка на роль администратора или модератора
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId, // Идентификатор удаляемого канала
                        name: {
                            not: "general", // Условие: канал не должен иметь имя "general"
                        }
                    }
                }
            }
        });

        return NextResponse.json(server); // Возврат ответа с обновленными данными сервера
    } catch (error) { // Обработка ошибок
        console.log("[CHANNEL_ID_DELETE]", error); // Вывод информации об ошибке в консоль
        return new NextResponse("Internal Error", { status: 500 }); // Возврат ответа с ошибкой "Internal Error"
    }
}

// Функция PATCH для обновления канала
export async function PATCH(
    req: Request, // Запрос на обновление канала
    { params }: { params: { channelId: string } } // Параметры запроса (идентификатор канала)
) {
    try {
        const user = await currentUser(); // Получение текущего пользователя
        const {name, type} = await req.json(); // Извлечение данных из запроса
        const {searchParams} = new URL(req.url); // Получение параметров запроса

        const serverId = searchParams.get("serverId"); // Получение идентификатора сервера из параметров запроса

        if (!user) { // Если пользователь не авторизован
            return new NextResponse("Unauthorized", {status: 401}); // Возврат ответа с ошибкой "Unauthorized"
        }

        if (!serverId) { // Если отсутствует идентификатор сервера
            return new NextResponse("Server ID missing", {status: 400}); // Возврат ответа с ошибкой "Server ID missing"
        }

        if (!params.channelId) { // Если отсутствует идентификатор канала
            return new NextResponse("Channel ID missing", {status: 400}); // Возврат ответа с ошибкой "Channel ID missing"
        }

        if (name === "general") { // Если имя канала "general"
            return new NextResponse("Name cannot be 'general'", {status: 400}); // Возврат ответа с ошибкой "
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        userId: user.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR], // Проверка на роль администратора или модератора
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId, // Идентификатор обновляемого канала
                            NOT: {
                                name: "general", // Условие: канал не должен иметь имя "general"
                            },
                        },
                        data: {
                            name, // Обновленное имя канала
                            type, // Обновленный тип канала
                        }
                    }
                }
            }
        });

        return NextResponse.json(server); // Возврат ответа с обновленными данными сервера
    } catch (error) { // Обработка ошибок
        console.log("[CHANNEL_ID_PATCH]", error); // Вывод информации об ошибке в консоль
        return new NextResponse("Internal Error", {status: 500}); // Возврат ответа с ошибкой "Internal Error"
    }
}