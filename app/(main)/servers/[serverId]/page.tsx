import { redirect } from "next/navigation"; // Импорт функции перенаправления страницы
import { db } from "@/lib/db"; // Импорт объекта базы данных
import { currentUser } from "@/lib/auth"; // Импорт функции получения текущего пользователя

// Интерфейс для параметров страницы ServerIdPage
interface ServerIdPageProps {
    params: {
        serverId: string; // Идентификатор сервера
    }
}

// Функция ServerIdPage для обработки запроса страницы по идентификатору сервера
const ServerIdPage = async ({ params }: ServerIdPageProps) => {
    const user = await currentUser(); // Получение текущего пользователя

    if (!user) {
        return redirect("/auth/login"); // Перенаправление на страницу входа, если пользователь не авторизован
    }

    // Поиск сервера по его идентификатору и проверка принадлежности текущему пользователю
    const server = await db.server.findUnique({
        where: {
            id: params.serverId, // Идентификатор сервера из параметров
            members: {
                some: {
                    userId: user.id, // Проверка, что текущий пользователь является членом сервера
                }
            }
        },
        include: {
            channels: { // Включение каналов сервера
                where: {
                    name: "general" // Фильтрация по имени канала "general"
                },
                orderBy: {
                    createdAt: "asc" // Сортировка каналов по дате создания
                }
            }
        }
    });

    const initialChannel = server?.channels[0]; // Получение первого канала из результата запроса

    // Проверка, что первый канал существует и его имя "general"
    if (initialChannel?.name !== "general") {
        return null; // Возврат null, если первый канал не является "general"
    }

    return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`); // Перенаправление на первый канал сервера
}

export default ServerIdPage; // Экспорт функции ServerIdPage
