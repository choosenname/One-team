"use client";

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {FullConversationType} from "@/types";
import useConversation from "@/hooks/use-conversation";
import {clsx} from "clsx";
import {Users} from "lucide-react";
import ConversationBox from "@/components/conversation/conversation-box";

interface ConversationListProps {
    initialItems: FullConversationType[];
}

const ConversationList = ({
                              initialItems,
                          }: ConversationListProps) => {
    const [items, setItems] = useState<FullConversationType[]>(initialItems);

    const router = useRouter();

    const {conversationId, isOpen} = useConversation();

    return (<aside
        className={clsx(`
      inset-y-0
      pb-20
      lg:pb-0
      lg:left-20
      lg:w-80
      lg:block
      overflow-y-auto
      border-r
      border-gray-200
    `, isOpen ? "hidden" : "block w-full left-0")}>
        <div className='px-5 '>
            <div className='flex justify-between pt-4 mb-4 '>
                <div className='text-2xl font-bold text-neutral-800'>
                    Messages
                </div>
                <div
                    className='p-2 text-gray-600 transition bg-gray-100 rounded-full cursor-pointer hover:opacity-75'>
                    <Users size={20}/>
                </div>
            </div>
            {items.map(item => (<ConversationBox
                key={item.id}
                data={item}
                selected={conversationId === item.id}
            />))}
        </div>
    </aside>);
};

export default ConversationList;
