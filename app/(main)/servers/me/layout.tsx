import React from "react";
import getUser from "@/lib/users";
import {UserList} from "@/components/users/user-list";

export default async function UsersLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const users = await getUser();

    console.log(users);

    return (
        <div className='h-full'>
            <UserList items={users}/>
            {children}
        </div>
    );
}