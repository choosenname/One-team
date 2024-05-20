import React from "react";
import {getOrCreateConversation} from "@/lib/conversation";
import {getMessages} from "@/lib/messages";
import EmptyState from "@/components/conversation/empty-state";
import Header from "@/components/conversation/conversation-header";
import Body from "@/components/conversation/conversation-body";
import Form from "@/components/conversation/conversation-form";
import {ConverWrapper} from "@/components/chat/conver-wrapper";
import {currentUser} from "@/lib/auth";
import {useOtherUser} from "@/lib/users";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";

interface Iparams {
    memberId: string;
}

const PageConversation = async ({ params }: { params: Iparams }) => {
    const user = await currentUser();

    if (!user) {
        return ("/auth/login");
    }

    const currentMember = await db.user.findFirst({
        where: {
            id: user.id,
        },
    });

    if (!currentMember) {
        return redirect("/");
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    if (!conversation) {
        return (
            <EmptyState/>
        );
    }

    const curUser = await currentUser();

    if (!curUser) {
        return ("/auth/login");
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.id === user.id ? memberTwo : memberOne;


    return (
        <ConverWrapper currentMember={currentMember} otherMember={otherMember} conversation={conversation} />
    );
};

export default PageConversation;
