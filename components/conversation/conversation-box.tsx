"use client";

import React, {useCallback, useMemo} from "react";
import {useRouter} from "next/navigation";
import {format} from "date-fns";
import {useSession} from "next-auth/react";
import clsx from "clsx";
import {FullConversationType} from "@/types";
import {useOtherUser} from "@/lib/users";
import {UserAvatar} from "@/components/user-avatar";

interface ConversationBoxProps {
    data: FullConversationType;
    selected: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
                                                             data, selected,
                                                         }) => {
    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/me/conversations/${data.id}`);
    }, [data.id, router]);

    const lastMessage = useMemo(() => {
        const messages = data.directMessages || [];

        return messages[messages.length - 1];
    }, [data.directMessages]);

    const userEmail = useMemo(() => {
        return session.data?.user?.name;
    }, [session.data?.user?.name]);

    const hasSeen = useMemo(() => {
        if (!lastMessage) return false;

        const seenArray = lastMessage.seen || [];

        if (!userEmail) return false;

        return (seenArray.filter(user => user.name === userEmail).length !== 0);
    }, [userEmail, lastMessage]);

    const lastMessageText = useMemo(() => {
        if (!lastMessage?.image) return "Sent and image";

        if (lastMessage?.body) return lastMessage.body;

        return "Started a conversation";
    }, [lastMessage]);

    return (<div
            onClick={handleClick}
            className={clsx(`
      w-full
      relative
      flex
      items-center
      space-x-3
      hover:bg-neutral-100
      rounded-lg
      transition
      cursor-pointer
      p-3
    `, selected ? `bg-neutral-100` : `bg-white`)}>
            <UserAvatar src={otherUser.imageUrl}/>
            <div className='flex-1 min-w-0'>
                <div className='focus:outline-none'>
                    <div className='flex items-center justify-between mb-1'>
                        <p className='font-medium text-gray-900 text-md'>
                            {data.name || otherUser?.name}
                        </p>
                        {lastMessage?.createdAt && (<p className='text-xs font-light text-gray-400'>
                                {format(new Date(lastMessage.createdAt), "p")}
                            </p>)}
                    </div>
                    <p
                        className={clsx(`
            truncate
            text-sm
          `, hasSeen ? "text-gray-500" : "text-black font-medium")}>
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>);
};

export default ConversationBox;
