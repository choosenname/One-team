"use client";

import React from "react";
import Image from "next/image";
import {useSession} from "next-auth/react";
import {format} from "date-fns";
import clsx from "clsx";
import {FullMessageType} from "@/types";
import {UserAvatar} from "@/components/user-avatar";

interface IMessageBoxProps {
    data: FullMessageType;
    isLast: boolean;
}

const MessageBox: React.FC<IMessageBoxProps> = ({isLast, data}) => {
    const session = useSession();

    const isOwn = session?.data?.user?.name === data?.sender?.name;
    const seenList = (data.seen || [])
        .filter(user => user.name !== data?.sender?.name)
        .map(user => user.name)
        .join(", ");

    const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

    const avatar = clsx(isOwn && "order-2");

    const body = clsx("flex flex-col gap-2", isOwn && "items-end");

    const message = clsx("text-sm w-fit overflow-hidden", isOwn ? "bg-sky-500 text-white" : "bg-gray-100", data?.image ? "rounded-md p-0" : "rounded-full py-2 px-3");

    return (<div className={container}>
            <div className={avatar}>
                <UserAvatar src={data.sender.imageUrl}/>
            </div>
            <div className={body}>
                <div className='flex items-center gap-1'>
                    <div className='text-sm text-gray-500'>
                        {data.sender.name}
                    </div>
                    <div className='text-xs text-gray-400'>
                        {format(new Date(data.createdAt), "p")}
                    </div>
                </div>
                <div className={message}>
                    {/*todo: show another types of files*/}
                    {data?.image ? (<Image
                            src={data.image}
                            width={288}
                            height={288}
                            alt='Image'
                            className='object-cover transition cursor-pointer hover:scale-110 translate'
                        />) : (<div>{data.body}</div>)}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className='text-xs font-light text-gray-500'>
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>);
};

export default MessageBox;
