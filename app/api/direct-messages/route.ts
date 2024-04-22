import { NextResponse } from "next/server";
import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";

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

        return NextResponse.json(newMessage);
    } catch (error) {
        console.log(error, "ERROR_MESSAGE");
        return new NextResponse("INTERNAL ERROR", { status: 500 });
    }
}
