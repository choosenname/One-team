"use client";

import React, {useMemo} from "react";
import Link from "next/link";
import {Conversation, User} from "@prisma/client";
import {useOtherUser} from "@/lib/users";
import {ChevronLeft, Ellipsis} from "lucide-react";
import {UserAvatar} from "@/components/user-avatar";
import useActiveList from "@/hooks/use-active-list";

interface IHeaderProps {
    conversation: Conversation & {
        users: User[];
    };
}

const Header = ({conversation}: IHeaderProps) => {
    const otherUsers = useOtherUser(conversation);
    const {members} = useActiveList();

    const isActive = members?.indexOf(otherUsers?.name!) !== -1;

    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`;
        }

        return isActive ? "Active now" : "Offline";
    }, [conversation, isActive]);

    return (<div
        className='
    bg-white
    w-full
    flex
    border-b-[1px]
    sm:px-4
    py-3
    px-4
    lg:px-6
    justify-between
    items-center
    shadow-sm
    '>
        <div className='flex items-center gap-3 '>
            <Link
                className='block transition cursor-pointer lg:hidden text-sky-500 hover:text-sky-600'
                href='/me'>
                <ChevronLeft size={32}/>
            </Link>
            <UserAvatar src={otherUsers.imageUrl}/>
            <div className='flex flex-col '>
                <div>{conversation?.name || otherUsers?.name}</div>
                <div className='text-sm font-light text-neutral-500'>
                    {statusText}
                </div>
            </div>
        </div>
        <Ellipsis
            onClick={() => {
            }}
            size={32}
            className='transition cursor-pointer text-sky-500 hover:text-sky-600'
        />
    </div>);
};

export default Header;
