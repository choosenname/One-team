import { db } from "@/lib/db";
import {currentUser} from "@/lib/auth";

export const getConversations = async () => {
    return null;
    /*const user = await currentUser();

    if (!user?.id) {
        return [];
    }

    try {
        const conversations = await db.conversation.findMany({
            orderBy: {
                lastMessageAt: "desc",
            },
            where: {
                userIds: {
                    has: user.id,
                },
            },
            include: {
                users: true,
                directMessages: {
                    include: {
                        sender: true,
                        seen: true,
                    },
                },
            },
        });

        return conversations;
    } catch (error) {
        return [];
    }*/
};

export const getConversationById = async (conversationId: string) => {
    try {
        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId,
            },
        });

        return conversation;
    } catch (error) {
        return null;
    }
};


export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

    if (!conversation) {
        conversation = await createNewConversation(memberOneId, memberTwoId);
    }

    return conversation;
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId: memberOneId },
                    { memberTwoId: memberTwoId },
                ]
            },
            include: {
                memberOne: true,
                memberTwo: true,
            }
        });
    } catch {
        return null;
    }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId,
                isNotify: true,
            },
            include: {
                memberOne: true,
                memberTwo: true,
            }
        })
    } catch (e) {
        return null;
    }
}
