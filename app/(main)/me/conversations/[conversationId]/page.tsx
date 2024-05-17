import React from "react";
import {getConversationById} from "@/lib/conversation";
import {getMessages} from "@/lib/messages";
import EmptyState from "@/components/conversation/empty-state";
import Header from "@/components/conversation/conversation-header";
import Body from "@/components/conversation/conversation-body";
import Form from "@/components/conversation/conversation-form";
import {ConverWrapper} from "@/components/chat/conver-wrapper";
import {currentUser} from "@/lib/auth";
import {useOtherUser} from "@/lib/users";
import {db} from "@/lib/db";

interface Iparams {
    conversationId: string;
}

const PageConversation = async ({ params }: { params: Iparams }) => {
    const conversation = await getConversationById(
        params.conversationId
    );


    if (!conversation) {
        return (
            <div className='h-full lg:pl-80'>
                <div className='flex flex-col h-full'>
                    <EmptyState/>
                </div>
            </div>
        );
    }

    const curUser = await currentUser();

    if (!curUser) {
        return ("/auth/login");
    }

    const otherUsers = conversation.users.filter(
        user => user.name !== curUser.name
    );

    const otherUser = otherUsers[0];


    return (
        <ConverWrapper currentMember={curUser} otherMember={otherUser} conversation={conversation} />
    );
};

export default PageConversation;
