import { NextResponse } from "next/server";
import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import {pusherServer} from "@/lib/pusher";

interface IParams {
    conversationId?: string;
}

export async function POST(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { conversationId } = params;
        const user = await currentUser();

        if (!user?.id || !user?.name) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // find an existing conversation
        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                directMessages: {
                    include: {
                        seen: true,
                    },
                },
                users: true,
            },
        });

        if (!conversation) {
            return new NextResponse("Invalid ID", { status: 404 });
        }

        // find the last message
        const lastMessage =
            conversation.directMessages[conversation.directMessages.length - 1];

        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        //Updated seen of last message

        const updatedMessage = await db.directMessage.update({
            where: {
                id: lastMessage.id,
            },
            include: {
                seen: true,
                sender: true,
            },
            data: {
                seen: {
                    connect: {
                        id: user.id,
                    },
                },
            },
        });

        await pusherServer.trigger(
            user.name,
            "conversation:update",
            {
                id: conversationId,
                message: [updatedMessage],
            }
        );

        if (lastMessage.senderId.indexOf(user.name) !== -1) {
            return NextResponse.json(conversation);
        }

        await pusherServer.trigger(
            conversationId!,
            "message:update",
            updatedMessage
        );

        return NextResponse.json(updatedMessage);
    } catch (error) {
        console.log(error, "ERROR_MESSAGE_SEEN");
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
