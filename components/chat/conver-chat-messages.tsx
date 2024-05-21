"use client";

import {ElementRef, Fragment, useEffect, useRef} from "react";
import {format} from "date-fns";
import {Member, Message, User} from "@prisma/client";
import {Loader2, ServerCrash} from "lucide-react";

import {useChatQuery} from "@/hooks/use-chat-query";

import {ChatWelcome} from "@/components/chat/chat-welcome";
import {ChatItem} from "@/components/chat/chat-item";
import {useChatSocket} from "@/hooks/use-chat-socket";
import {useChatScroll} from "@/hooks/use-chat-scroll";
import {MessageWithMemberWithProfile} from "@/types";
import {ConverChatItem} from "@/components/chat/conver-chat-item";
import {ExtendedUser} from "@/next-auth";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
    name: string;
    member: ExtendedUser;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
    selectedDate: Date | undefined;
    searchMessage: string | undefined;
}

export const ConverChatMessages = ({
                                 name,
                                 member,
                                 chatId,
                                 apiUrl,
                                 socketUrl,
                                 socketQuery,
                                 paramKey,
                                 paramValue,
                                 type,
                                 selectedDate,
                                 searchMessage,
                             }: ChatMessagesProps) => {
    const queryKey = `chat:${chatId}`;
    const addKey = `chat:${chatId}:messages`;
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

    useEffect(() => {
        if (Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                if (permission !== "granted") {
                    alert("Please enable notifications to receive updates.");
                }
            });
        }
    }, []);

    const {
        data, fetchNextPage, hasNextPage, isFetchingNextPage, status,
    } = useChatQuery({
        queryKey, apiUrl, paramKey, paramValue,
    });
    useChatSocket({queryKey, addKey, updateKey});
    useChatScroll({
        chatRef,
        bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0,
    })

    if (status === "pending") {
        return (<div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Loading messages...
            </p>
        </div>)
    }

    if (status === "error") {
        return (<div className="flex flex-col flex-1 justify-center items-center">
            <ServerCrash className="h-7 w-7 text-zinc-500 my-4"/>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Something went wrong!
            </p>
        </div>)
    }

    return (<div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
        {!hasNextPage && <div className="flex-1"/>}
        {!hasNextPage && (<ChatWelcome
            type={type}
            name={name}
        />)}
        {hasNextPage && (<div className="flex justify-center">
            {isFetchingNextPage ? (<Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4"/>) : (<button
                onClick={() => fetchNextPage()}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
                Load previous messages
            </button>)}
        </div>)}
        <div className="flex flex-col-reverse mt-auto">
            {data?.pages?.map((group, i) => (<Fragment key={i}>
                {group.items
                    .filter((message: MessageWithMemberWithProfile) => {
                        return !searchMessage || message.content.includes(searchMessage)
                    })
                    .filter((message: MessageWithMemberWithProfile) => {
                        return !selectedDate || new Date(message.createdAt).getDate() === selectedDate.getDate();
                    })
                    .map((message: MessageWithMemberWithProfile) => (<ConverChatItem
                            key={message.id}
                            id={message.id}
                            currentMember={member}
                            member={message.member}
                            sourceMessageMember={message.sourceMessage?.member}
                            content={message.content}
                            fileUrl={message.fileUrl}
                            deleted={message.deleted}
                            timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                            isUpdated={message.updatedAt !== message.createdAt}
                            socketUrl={socketUrl}
                            socketQuery={socketQuery}
                        />))}
            </Fragment>))}
        </div>
        <div ref={bottomRef}/>
    </div>)
}