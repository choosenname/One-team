"use client"

import {Channel, ChannelType, Member} from "@prisma/client";
import {ChatHeader} from "@/components/chat/chat-header";
import {ChatMessages} from "@/components/chat/chat-messages";
import {ChatInput} from "@/components/chat/chat-input";
import {MediaRoom} from "@/components/media-room";
import {useState} from "react";

interface ChatWrapperProps {
    channel: Channel;
    member: Member;
}

export const ChatWrapper = ({channel, member}: ChatWrapperProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [searchMessage, setSearchMessage] = useState<string>();

    return(
        <>
            <ChatHeader
                name={channel.name}
                imageUrl={null}
                // serverId={channel.serverId}
                type="channel"
                date={selectedDate}
                setDate={setSelectedDate}
                searchMessage={searchMessage}
                setSearchMessage={setSearchMessage}
            />
            {channel.type === ChannelType.TEXT && (
                <>
                    <ChatMessages
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                            channelId: channel.id, serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                        selectedDate={selectedDate}
                        searchMessage={searchMessage}
                    />
                    <ChatInput
                        name={channel.name}
                        type="channel"
                        apiUrl="/api/socket/messages"
                        query={{
                            channelId: channel.id, serverId: channel.serverId,
                        }}
                    />
                </>
            )}
            {channel.type === ChannelType.VIDEO && (<MediaRoom
                chatId={channel.id}
                video={true}
                audio={true}
            />)}
        </>
    )
}