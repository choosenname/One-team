import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";
import { MessageWithMemberWithProfileAndConversation } from "@/types";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

// Хук для обработки сокет-сообщений в чате
export const useChatSocket = ({
                                  addKey,
                                  updateKey,
                                  queryKey
                              }: ChatSocketProps) => {
    const { socket } = useSocket(); // Получение сокета из контекста
    const queryClient = useQueryClient(); // Получение экземпляра клиента для работы с кэшем

    useEffect(() => {
        // Если сокет не подключен, выходим
        if (!socket) {
            return;
        }

        // Обработка обновлений сообщений
        socket.on(updateKey, (message: MessageWithMemberWithProfileAndConversation) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                // Проверка, существует ли старая дата
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                // Обновление сообщений в старых данных
                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfileAndConversation) => {
                            if (item.id === message.id) {
                                return message;
                            }
                            return item;
                        })
                    }
                });

                // Возвращение обновленных данных
                return {
                    ...oldData,
                    pages: newData,
                }
            })
        });

        // Обработка добавления новых сообщений
        socket.on(addKey, (message: MessageWithMemberWithProfileAndConversation) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                // Проверка, существует ли старая дата
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message],
                        }]
                    }
                }

                // Добавление нового сообщения в начало списка
                const newData = [...oldData.pages];

                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...newData[0].items,
                    ]
                };

                // Возвращение обновленных данных
                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });

        // Очистка обработчиков сокетов при размонтировании компонента
        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        }
    }, [queryClient, addKey, queryKey, socket, updateKey]); // Зависимости эффекта
}
