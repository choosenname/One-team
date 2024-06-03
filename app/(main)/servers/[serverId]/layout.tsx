import { currentUser } from "@/lib/auth"; // Импорт функции получения текущего пользователя
import { db } from "@/lib/db"; // Импорт объекта базы данных
import { redirect } from "next/navigation"; // Импорт функции перенаправления страницы
import { ServerSidebar } from "@/components/server/server-sidebar"; // Импорт компонента боковой панели сервера

// Компонент ServerIdLayout для отображения макета сервера по его идентификатору
const ServerIdLayout = async ({ children, params }: {
    children: React.ReactNode; // Вложенные компоненты
    params: { serverId: string }; // Параметры страницы, включающие идентификатор сервера
}) => {
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
                    userId: user.id // Проверка, что текущий пользователь является членом сервера
                }
            }
        }
    });

    // Проверка существования сервера
    if (!server) {
        return redirect("/"); // Перенаправление на главную страницу, если сервер не найден
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSidebar serverId={params.serverId} /> {/* Отображение боковой панели сервера */}
            </div>
            <main className="h-full md:pl-60">
                {children} {/* Отображение вложенных компонентов */}
            </main>
        </div>
    );
}

export default ServerIdLayout; // Экспорт компонента ServerIdLayout
