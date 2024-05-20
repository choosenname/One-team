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
        <div className="hidden md:flex h-full w-80 z-20 flex-col fixed inset-y-0">
            {/*<ConversationList initialItems={conversations} users={users}/>*/}
            <UserList items={users}/>
        </div>
        <main className="h-full md:pl-80">
            {children}
        </main>
    </div>
);
}