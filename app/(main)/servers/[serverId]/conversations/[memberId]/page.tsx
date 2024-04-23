import { redirect } from "next/navigation";

import { db } from "@/lib/db";
// import { getOrCreateConversation } from "@/lib/conversation";
import { currentUser } from "@/lib/auth";
import { ChatHeader } from "@/components/chat/chat-header";
import {ChatMessages} from "@/components/chat/chat-messages";
import {ChatInput} from "@/components/chat/chat-input";
import {MediaRoom} from "@/components/media-room";
/*import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";*/

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
    // const user = await currentUser();
    //
    // if (!user) {
    //     return ("/auth/login");
    // }
    //
    // const currentMember = await db.member.findFirst({
    //     where: {
    //         serverId: params.serverId,
    //         userId: user.id,
    //     },
    //     include: {
    //         user: true,
    //     },
    // });
    //
    // if (!currentMember) {
    //     return redirect("/");
    // }
    //
    // const conversation = await getOrCreateConversation(currentMember.id, params.memberId);
    //
    // if (!conversation) {
    //     return redirect(`/servers/${params.serverId}`);
    // }
    //
    // const { memberOne, memberTwo } = conversation;
    //
    // const otherMember = memberOne.userId === user.id ? memberTwo : memberOne;
    //
    // return (
    //     <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
    //         <ChatHeader
    //             imageUrl={otherMember.user.imageUrl}
    //             name={otherMember.user.name}
    //             channelId={conversation.id}
    //             serverId={params.serverId}
    //             type="conversation"
    //         />
    //         {searchParams.video && (
    //             <MediaRoom
    //                 chatId={conversation.id}
    //                 video={true}
    //                 audio={true}
    //             />
    //         )}
    //         {!searchParams.video && (
    //             <>
    //                 <ChatMessages
    //                     member={currentMember}
    //                     name={otherMember.user.name}
    //                     chatId={conversation.id}
    //                     type="conversation"
    //                     apiUrl="/api/direct-messages"
    //                     paramKey="conversationId"
    //                     paramValue={conversation.id}
    //                     socketUrl="/api/socket/direct-messages"
    //                     socketQuery={{
    //                         conversationId: conversation.id,
    //                     }}
    //                 />
    //                 <ChatInput
    //                     name={otherMember.user.name}
    //                     type="conversation"
    //                     apiUrl="/api/socket/direct-messages"
    //                     query={{
    //                         conversationId: conversation.id,
    //                     }}
    //                 />
    //             </>
    //         )}
    //     </div>
    // );
}

export default MemberIdPage;