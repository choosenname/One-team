"use client"

import {Channel, ChannelType, Conversation, ConversationTwo, Member, User} from "@prisma/client";
import {ChatHeader} from "@/components/chat/chat-header";
import {ChatMessages} from "@/components/chat/chat-messages";
import {ChatInput} from "@/components/chat/chat-input";
import {MediaRoom} from "@/components/media-room";
import {useState} from "react";
import {ConverChatMessages} from "@/components/chat/conver-chat-messages";
import {ExtendedUser} from "@/next-auth";

interface ChatWrapperProps {
    currentMember: ExtendedUser;
    otherMember: User;
    conversation: Conversation;
}

export const ConverWrapper = ({currentMember, otherMember, conversation}: ChatWrapperProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [searchMessage, setSearchMessage] = useState<string>();

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.imageUrl}
                name={otherMember.name}
                // channelId={conversation.id}
                // serverId={params.serverId}
                type="conversation"
                date={selectedDate}
                setDate={setSelectedDate}
                searchMessage={searchMessage}
                setSearchMessage={setSearchMessage}
            />
            <ConverChatMessages
                member={currentMember}
                name={otherMember.name}
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
                name={otherMember.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages-two"
                query={{
                    conversationId: conversation.id,
                }}
            />
        </div>
    )
}