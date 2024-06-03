import React from "react";
import { UserList } from "@/components/users/user-list"; // Импорт компонента списка пользователей
import { getUsers } from "@/lib/users"; // Импорт функции для получения пользователей
import { getConversations } from "@/lib/conversation"; // Импорт функции для получения бесед

// Компонент макета страницы пользователей
export default async function UsersLayout({
                                              children,
                                          }: {
    children: React.ReactNode; // Дочерние элементы компонента
}) {
    const conversations = await getConversations(); // Получение бесед
    const users = await getUsers(); // Получение пользователей

    // Возвращение разметки страницы пользователей
    return (
        <div className='h-full'>
            <div className="hidden md:flex h-full w-80 z-20 flex-col fixed inset-y-0">
                {/* <ConversationList initialItems={conversations} users={users}/> */}
                <UserList items={users} /> {/* Отображение списка пользователей */}
            </div>
            <main className="h-full md:pl-80">
                {children} {/* Отображение дочерних элементов */}
            </main>
        </div>
    );
}
