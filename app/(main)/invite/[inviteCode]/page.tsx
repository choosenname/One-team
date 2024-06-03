import { redirect } from "next/navigation"; // Импорт функции перенаправления из модуля навигации Next.js

import { db } from "@/lib/db"; // Импорт объекта базы данных
import { currentUser } from "@/lib/auth"; // Импорт функции для получения текущего пользователя

// Интерфейс для пропсов страницы с кодом приглашения
interface InviteCodePageProps {
    params: {
        inviteCode: string; // Параметр - код приглашения
    };
}

// Компонент страницы с кодом приглашения
const InviteCodePage = async ({ params }: InviteCodePageProps) => {
    const user = await currentUser(); // Получение текущего пользователя

    if (!user || !user.id) { // Если пользователь не авторизован или его ID отсутствует
        return redirect("/auth/login"); // Перенаправление на страницу входа
    }

    if (!params.inviteCode) { // Если код приглашения не указан
        return redirect("/"); // Перенаправление на главную страницу
    }

    // Поиск существующего сервера по коду приглашения и проверка, что текущий пользователь является его участником
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode, // Код приглашения
            members: { // Проверка наличия пользователя в списке участников сервера
                some: {
                    userId: user.id // ID текущего пользователя
                }
            }
        }
    });

    if (existingServer) { // Если существующий сервер найден
        return redirect(`/servers/${existingServer.id}`); // Перенаправление на страницу сервера
    }

    // Обновление данных сервера с указанным кодом приглашения и добавление текущего пользователя в качестве участника
    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode, // Код приглашения
        },
        data: {
            members: { // Добавление текущего пользователя в список участников сервера
                create: [
                    {
                        userId: user.id, // ID текущего пользователя
                    }
                ]
            }
        }
    });

    if (server) { // Если сервер успешно обновлен
        return redirect(`/servers/${server.id}`); // Перенаправление на страницу сервера
    }

    return null; // Возвращение null в случае, если ни одно из перенаправлений не выполнено
}

export default InviteCodePage; // Экспорт компонента InviteCodePage
