import React from "react";
import { getOrCreateConversation } from "@/lib/conversation"; // Импорт функции для получения или создания беседы
import EmptyState from "@/components/conversation/empty-state"; // Импорт компонента пустого состояния чата
import { ConverWrapper } from "@/components/chat/conver-wrapper"; // Импорт оболочки чата
import { currentUser } from "@/lib/auth"; // Импорт функции для получения текущего пользователя
import { db } from "@/lib/db"; // Импорт объекта базы данных
import { redirect } from "next/navigation"; // Импорт функции перенаправления из модуля навигации Next.js

// Интерфейс для параметров страницы беседы
interface Iparams {
    memberId: string; // Идентификатор участника беседы
}

// Компонент страницы беседы
const PageConversation = async ({ params }: { params: Iparams }) => {
    const user = await currentUser(); // Получение текущего пользователя

    if (!user) { // Если пользователь не авторизован
        return ("/auth/login"); // Перенаправление на страницу входа
    }

    const currentMember = await db.user.findFirst({ // Поиск текущего пользователя в базе данных
        where: {
            id: user.id, // Идентификатор текущего пользователя
        },
    });

    if (!currentMember) { // Если текущий пользователь не найден
        return redirect("/"); // Перенаправление на главную страницу
    }

    // Получение или создание беседы между текущим пользователем и участником, переданным в параметрах
    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    if (!conversation) { // Если беседа не найдена или не создана
        return (
            <EmptyState/> // Отображение пустого состояния чата
        );
    }

    const curUser = await currentUser(); // Получение текущего пользователя

    if (!curUser) { // Если текущий пользователь не найден
        return ("/auth/login"); // Перенаправление на страницу входа
    }

    const { memberOne, memberTwo } = conversation; // Получение участников беседы

    // Определение участника чата, отличного от текущего пользователя
    const otherMember = memberOne.id === user.id ? memberTwo : memberOne;

    // Отображение оболочки чата с переданными параметрами
    return (
        <ConverWrapper currentMember={currentMember} otherMember={otherMember} conversation={conversation} />
    );
};

export default PageConversation; // Экспорт компонента PageConversation
