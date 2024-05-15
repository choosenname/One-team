"use client"

import {Channel, ChannelType, ConversationTwo, Member, User} from "@prisma/client";
import {ChatHeader} from "@/components/chat/chat-header";
import {ChatMessages} from "@/components/chat/chat-messages";
import {ChatInput} from "@/components/chat/chat-input";
import {MediaRoom} from "@/components/media-room";
import {useState} from "react";

interface ChatWrapperProps {
    currentMember: Member & {
        user: User;
    };
    otherMember: Member & {
        user: User;
    };
    conversation: ConversationTwo;
    params: {
        memberId: string;
        serverId: string;
    };
}

export const ConverWrapper = ({currentMember, otherMember, conversation, params}: ChatWrapperProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [searchMessage, setSearchMessage] = useState<string>();

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.user.imageUrl}
                name={otherMember.user.name}
                // channelId={conversation.id}
                serverId={params.serverId}
                type="conversation"
                date={selectedDate}
                setDate={setSelectedDate}
                searchMessage={searchMessage}
                setSearchMessage={setSearchMessage}
            />
            <ChatMessages
                member={currentMember}
                name={otherMember.user.name}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages-two"
                socketQuery={{
                    conversationId: conversation.id,
                }}
                selectedDate={selectedDate}
                searchMessage={searchMessage}
            />
            <ChatInput
                name={otherMember.user.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages-two"
                query={{
                    conversationId: conversation.id,
                }}
            />
        </div>
    )
}