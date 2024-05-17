import React from "react";
import {UserList} from "@/components/users/user-list";
import {getUsers} from "@/lib/users";
import {getConversations} from "@/lib/conversation";
import ConversationList from "@/components/conversation/conversation-list";

export default async function UsersLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const conversations = await getConversations();
    const users = await getUsers();

    return (<div className='h-full'>
        <div className="fixed">
            {/*<ConversationList initialItems={conversations} users={users}/>*/}
            <UserList items={users}/>
        </div>
        {children}
    </div>);
}