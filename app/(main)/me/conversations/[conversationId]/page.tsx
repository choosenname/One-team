import React from "react";
import {getConversationById} from "@/lib/conversation";
import {getMessages} from "@/lib/messages";
import EmptyState from "@/components/conversation/empty-state";
import Header from "@/components/conversation/conversation-header";
import Body from "@/components/conversation/conversation-body";
import Form from "@/components/conversation/conversation-form";

interface Iparams {
    conversationId: string;
}

const PageConversation = async ({ params }: { params: Iparams }) => {
    const conversation = await getConversationById(
        params.conversationId
    );
    const messages = await getMessages(params.conversationId);

    if (!conversation) {
        return (
            <div className='h-full lg:pl-80'>
                <div className='flex flex-col h-full'>
                    <EmptyState />
                </div>
            </div>
        );
    }

    return (
        <div className='h-full lg:pl-80'>
            <div className='flex flex-col h-full'>
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                <Form />
            </div>
        </div>
    );
};

export default PageConversation;
