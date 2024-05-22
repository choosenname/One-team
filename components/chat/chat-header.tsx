import {Hash} from "lucide-react";

import {MobileToggle} from "@/components/mobile-toggle";
import {UserAvatar} from "@/components/user-avatar";
import {SocketIndicator} from "@/components/socket-indicator";
import {ChatNotificationButton} from "@/components/chat/chat-notification-button";
import {ServerSearch} from "@/components/server/server-search";
import {db} from "@/lib/db";
import {DatePicker} from "@/components/ui/date-picker";
import * as React from "react";
import {Input} from "@/components/ui/input";
import {Conversation} from "@prisma/client";

interface ChatHeaderProps {
    name: string;
    type: "channel" | "conversation";
    conversation?: Conversation;
    imageUrl?: string;
    date: Date|undefined;
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    searchMessage: string|undefined;
    setSearchMessage: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const ChatHeader = ({
                                 name, type, imageUrl, date, setDate, searchMessage, setSearchMessage, conversation
                                 }: ChatHeaderProps) => {
    return (<div
            className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            {type === "conversation" && (<UserAvatar
                    src={imageUrl}
                    className="h-8 w-8 md:h-8 md:w-8 mr-2"
                />)}
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
            <div className="ml-auto flex items-center">
                <Input placeholder="Поиск по сообщениям"
                       value={searchMessage}
                       onChange={(e) => setSearchMessage(e.target.value)}
                />
                <DatePicker date={date} setDate={setDate} />
                {type === "conversation" && (<ChatNotificationButton conversationId={conversation?.id}/>)}
                <SocketIndicator/>
            </div>
        </div>)
}