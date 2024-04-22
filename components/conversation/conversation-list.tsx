"use client";

import React, {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";

import clsx from "clsx";
import {find} from "lodash";
import {FullConversationType} from "@/types";
import {User} from "@prisma/client";
import {useSession} from "next-auth/react";
import useConversation from "@/hooks/use-conversation";
import {pusherClient} from "@/lib/pusher";
import {Group} from "lucide-react";
import ConversationBox from "@/components/conversation/conversation-box";

interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
                                                               initialItems, users,
                                                           }) => {
    const router = useRouter();
    const session = useSession();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState<FullConversationType[]>(initialItems);

    const {conversationId, isOpen} = useConversation();

    const pusherKey = useMemo(() => {
        return session.data?.user?.name;
    }, [session.data?.user?.name]);

    useEffect(() => {
        if (!pusherKey) {
            return;
        }

        pusherClient.subscribe(pusherKey);

        const newHandler = (conversation: FullConversationType) => {
            setItems(current => {
                if (find(current, {id: conversation.id})) {
                    return current;
                }

                return [conversation, ...current];
            });
        };

        const updateHandler = (conversation: FullConversationType) => {
            setItems(current => current.map(currentConversation => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation, messages: conversation.directMessages,
                    };
                }

                return currentConversation;
            }));
        };

        const removeHandler = (conversation: FullConversationType) => {
            setItems(current => {
                return [...current.filter(converstion => converstion.id !== conversation.id),];
            });

            if (conversationId === conversation.id) {
                router.push("/conversations");
            }
        };

        pusherClient.bind("conversation:new", newHandler);
        pusherClient.bind("conversation:update", updateHandler);
        pusherClient.bind("conversation:remove", removeHandler);

        return () => {
            pusherClient.unsubscribe(pusherKey);
            pusherClient.unbind("conversation:new", newHandler);
            pusherClient.unbind("conversation:update", updateHandler);
            pusherClient.unbind("conversation:remove", removeHandler);
        };
    }, [pusherKey, conversationId, router]);

    return (<>
        <aside
            className={clsx(`
                inset-y-0
                pb-20
                lg:pb-0
                lg:left-20
                lg:w-80
                lg:block
                overflow-y-auto
                border-r
                border-gray-200`
                , isOpen ? "hidden" : "block w-full left-0")}>
            <div className='px-5 '>
                <div className='flex justify-between pt-4 mb-4 '>
                    <div className='text-2xl font-bold text-neutral-800'>
                        Messages
                    </div>
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className='p-2 text-gray-600 transition bg-gray-100 rounded-full cursor-pointer hover:opacity-75'>
                        <Group size={20}/>
                    </div>
                </div>
                {items.map(item => (<ConversationBox
                    key={item.id}
                    data={item}
                    selected={conversationId === item.id}
                />))}
            </div>
        </aside>
    </>);
};

export default ConversationList;
