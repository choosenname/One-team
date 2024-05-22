import {getServersWithTextChannels} from "@/lib/server";
import {NextResponse} from "next/server";
import {getConversationById} from "@/lib/conversation";
import {db} from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { conversationId: string } }
) {
    try{
        const conversation = await getConversationById(params.conversationId);
        const isNotify = conversation?.isNotify;

        return NextResponse.json(isNotify);
    } catch (error) {
        console.log("[CONVERSATION_NOTIFICATION_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function PATCH(
    req: Request,
    { params }: { params: { conversationId: string } }
) {
    try{
        const conversation = await getConversationById(params.conversationId);
        const isNotify = conversation?.isNotify;

        if(!conversation) {
            return new NextResponse("Conversation is missing", { status: 400 });
        }

        const newConversation = await db.conversation.update({
            where: {
                id: conversation.id,
            },
            data: {
                isNotify: !isNotify
            }
        })

        return NextResponse.json(newConversation.isNotify);
    } catch (error) {
        console.log("[CONVERSATION_NOTIFICATION_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
