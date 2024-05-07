import {redirect} from "next/navigation";
import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import {ChatWrapper} from "@/components/chat/chat-wrapper";

interface ChannelIdPageProps {
    params: {
        serverId: string;
        channelId: string;
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

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatWrapper channel={channel} member={member}/>
        </div>
    );
}

export default ChannelIdPage;