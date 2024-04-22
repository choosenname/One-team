import { NextResponse } from "next/server";
import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";

export async function POST(request: Request) {
    try {
        const user = await currentUser();
        const body = await request.json();
        const { userId, isGroup, members, name } = body;

        if (!user?.id || !user?.name) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse("Invalid Request", { status: 400 });
        }

        if (isGroup) {
            const newConversation = await db.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        //connect: members.map((member: string) => ({ id: member }))
                        connect: [
                            ...members.map((member: { value: string }) => ({
                                id: member.value,
                            })),
                            { id: user.id },
                        ],
                    },
                },
                include: {
                    users: true,
                },
            });

            return NextResponse.json(newConversation);
        }

        const existingConversations = await db.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [user.id, userId],
                        },
                    },
                    {
                        userIds: {
                            equals: [userId, user.id],
                        },
                    },
                ],
            },
        });

        const singleConversation = existingConversations[0];

        if (singleConversation) {
            return NextResponse.json(singleConversation);
        }

        const newConversation = await db.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: user.id,
                        },
                        {
                            id: userId,
                        },
                    ],
                },
            },
            include: {
                users: true,
            },
        });

        return NextResponse.json(newConversation);
    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
