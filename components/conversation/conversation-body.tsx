"use client";

import React, {useRef, useState} from "react";
import {FullMessageType} from "@/types";
import useConversation from "@/hooks/use-conversation";
import MessageBox from "@/components/conversation/conversation-message-box";

interface BodyProps {
    initialMessages: FullMessageType[];
}

const Body= ({initialMessages}: BodyProps) => {
    const [messages, setMessages] = useState(initialMessages);
    const bntRef = useRef<HTMLDivElement>(null);

    const {conversationId} = useConversation();

    return (<div className='flex-1 overflow-y-auto'>
            {messages.map((message, i) => (<MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />))}
            <div ref={bntRef} className='pt-24'/>
        </div>);
};

export default Body;
