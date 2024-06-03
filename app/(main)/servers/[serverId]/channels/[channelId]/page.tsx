import { redirect } from "next/navigation"; // Импорт функции перенаправления страницы
import { currentUser } from "@/lib/auth"; // Импорт функции получения текущего пользователя
import { db } from "@/lib/db"; // Импорт объекта базы данных
import { ChatWrapper } from "@/components/chat/chat-wrapper"; // Импорт компонента ChatWrapper

// Интерфейс для параметров страницы ChannelIdPage
interface ChannelIdPageProps {
    params: {
        serverId: string; // Идентификатор сервера
        channelId: string; // Идентификатор канала
    }
}

// Компонент ChannelIdPage для отображения содержимого канала по его идентификатору
const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
    const user = await currentUser(); // Получение текущего пользователя

    if (!user) {
        return ("/login"); // Перенаправление на страницу входа, если пользователь не авторизован
    }

    // Поиск канала по его идентификатору
    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId, // Идентификатор канала из параметров
        },
    });

    // Поиск члена сервера по идентификаторам сервера и пользователя
    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId, // Идентификатор сервера из параметров
            userId: user.id, // Идентификатор пользователя
        }
    });

    // Проверка наличия канала и члена сервера
    if (!channel || !member) {
        redirect("/"); // Перенаправление на главную страницу, если канал или член сервера не найдены
    }

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatWrapper channel={channel} member={member}/> {/* Отображение компонента ChatWrapper с переданными каналом и членом сервера*/}
        </div>
    );
}

export default ChannelIdPage; // Экспорт компонента ChannelIdPage
