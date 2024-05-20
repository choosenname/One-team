"use client"

import EmptyState from "@/components/conversation/empty-state";
import {useConversation} from "@/hooks/use-conversation";

const ServerMe = () => {
    const {isOpen} = useConversation();

    return (<EmptyState/>);
}


export default ServerMe;