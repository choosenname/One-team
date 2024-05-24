import {getConversationById} from "@/lib/conversation";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { conversationId: string } }
) {
    try{
        const conversation = await getConversationById(params.conversationId);
        const { imageUrl } = await req.json();

        if(!conversation) {
            return new NextResponse("Conversation is missing", { status: 400 });
        }

        const newConversation = await db.conversation.update({
            where: {
                id: conversation.id,
            },
            data: {
                Background: imageUrl,
            }
        })

        return NextResponse.json(newConversation);
    } catch (error) {
        console.log("[CONVERSATION_NOTIFICATION_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}