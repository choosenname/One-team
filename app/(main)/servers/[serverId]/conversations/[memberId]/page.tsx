import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentUser } from "@/lib/auth";
import { ChatHeader } from "@/components/chat/chat-header";
import {ChatMessages} from "@/components/chat/chat-messages";
import {ChatInput} from "@/components/chat/chat-input";
import {MediaRoom} from "@/components/media-room";
import {ConverWrapper} from "@/components/chat/conver-wrapper";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    },
    searchParams: {
        video?: boolean;
    }
}

const MemberIdPage = async ({
                                params,
                                searchParams,
                            }: MemberIdPageProps) => {
    const user = await currentUser();

    if (!user) {
        return ("/auth/login");
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            userId: user.id,
        },
        include: {
            user: true,
        },
    });

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    if (!conversation) {
        return redirect(`/servers/${params.serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.userId === user.id ? memberTwo : memberOne;

    return (
        <ConverWrapper currentMember={currentMember} otherMember={otherMember} conversation={conversation} params={params} />
    );
}

export default MemberIdPage;