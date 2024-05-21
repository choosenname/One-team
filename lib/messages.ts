import {db} from "@/lib/db";

export const getMessages = async (conversationId: string) => {
    try {
        const messages = await db.directMessage.findMany({
            where: {
                conversationId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return messages;
    } catch (error) {
        return [];
    }
};
