import { NextResponse } from "next/server";
import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import {pusherServer} from "@/lib/pusher";

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        const body = await request.json();

        const { message, image, conversationId } = body;

        if (!user?.id || !user?.name) {
            return new NextResponse("UNAUTHORIZED", { status: 401 });
        }

        const newMessage = await db.directMessage.create({
            data: {
                body: message,
                image,
                conversation: {
                    connect: {
                        id: conversationId,
                    },
                },
                sender: {
                    connect: {
                        id: user.id,
                    },
                },
                seen: {
                    connect: {
                        id: user.id,
                    },
                },
            },
            include: {
                sender: true,
                seen: true,
            },
        });

        const updatedConversation = await db.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                lastMessageAt: new Date(),
                directMessages: {
                    connect: {
                        id: newMessage.id,
                    },
                },
            },
            include: {
                users: true,
                directMessages: {
                    include: {
                        seen: true,
                    },
                },
            },
        });

        await pusherServer.trigger(
            conversationId,
            "messages:new",
            newMessage
        );

        await pusherServer.trigger(
            'notification',
            "notification:new",
            newMessage
        );

        const lastMessage =
            updatedConversation.directMessages[
            updatedConversation.directMessages.length - 1
                ];

        updatedConversation.users.map(user => {
            pusherServer.trigger(user.name!, "conversation:update", {
                id: conversationId,
                messages: [lastMessage],
            });
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.log(error, "ERROR_MESSAGE");
        return new NextResponse("INTERNAL ERROR", { status: 500 });
    }
}
