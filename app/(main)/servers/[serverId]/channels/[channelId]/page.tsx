import {redirect} from "next/navigation";

import {currentUser} from "@/lib/auth";
import {ChatHeader} from "@/components/chat/chat-header";
import {db} from "@/lib/db";
import {ChatInput} from "@/components/chat/chat-input";
import {ChatMessages} from "@/components/chat/chat-messages";
import {ChannelType} from "@prisma/client";
import {MediaRoom} from "@/components/media-room";

interface ChannelIdPageProps {
    params: {
        serverId: string; channelId: string;
    }
}

const ChannelIdPage = async ({
                                 params
                             }: ChannelIdPageProps) => {
    const user = await currentUser();

    if (!user) {
        return ("/login");
    }

    const channel = await db.channel.findUnique({
        where: {
            id: params.channelId,
        },
    });

    const member = await db.member.findFirst({
        where: {
            serverId: params.serverId, userId: user.id,
        }
    });

    if (!channel || !member) {
        redirect("/");
    }

    return (<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={channel.name}
                channelId={channel.id}
                serverId={channel.serverId}
                type="channel"
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
        </div>);
}

export default ChannelIdPage;