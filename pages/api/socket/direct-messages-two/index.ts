import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentUserPages } from "@/lib/current-user-pages";
import { db } from "@/lib/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    // Проверка метода запроса, только POST разрешен
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Получение текущего пользователя
        const user = await currentUserPages(req, res);
        const { content, fileUrl } = req.body;
        const { conversationId } = req.query;

        // Проверка, авторизован ли пользователь
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Проверка, передан ли идентификатор беседы
        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID missing" });
        }

        // Проверка, передано ли содержание сообщения
        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }

        // Поиск беседы в базе данных
        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            id: user.id,
                        }
                    },
                    {
                        memberTwo: {
                            id: user.id,
                        }
                    }
                ]
            },
            include: {
                memberOne: true,
                memberTwo: true,
            }
        })

        // Проверка, найдена ли беседа
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // Определение, какой участник беседы соответствует текущему пользователю
        const member = conversation.memberOne.id === user.id ? conversation.memberOne : conversation.memberTwo

        // Проверка, найден ли участник беседы
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Создание нового сообщения в базе данных
        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                memberId: member.id,
            },
            include: {
                member: true,
                conversation: true,
            },
        });

        // Объявление ключей для каналов WebSocket
        const channelKey = `chat:${conversationId}:messages`;
        const allChannelsKey = `chat:messages`;

        // Отправка сообщения в соответствующие каналы WebSocket
        res?.socket?.server?.io?.emit(channelKey, message);
        res?.socket?.server?.io?.emit(allChannelsKey, message);

        // Возврат созданного сообщения в ответе
        return res.status(200).json(message);
    } catch (error) {
        console.log("[DIRECT_MESSAGES_POST]", error);
        // Возврат ошибки сервера в случае исключения
        return res.status(500).json({ message: "Internal Error" });
    }
}
