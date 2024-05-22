"use client";

import React, { useEffect, useRef } from 'react';
import { MessageWithMemberWithProfileAndConversation } from "@/types";
import { useSocket } from "@/components/providers/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import {useCurrentUser} from "@/hooks/use-current-user";

const Notifications = () => {
    const user = useCurrentUser();
    const { socket } = useSocket();
    const audioRef = useRef<HTMLAudioElement>(null);
    const queryClient = useQueryClient();

    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(error => {
                console.error("Error playing sound:", error);
            });
        }
    };

    const addKey = `chat:messages`;

    useEffect(() => {
        if (!socket) {
            return;
        }

        const showNotification = (message: MessageWithMemberWithProfileAndConversation) => {
            if (Notification.permission === "granted") {
                new Notification("Новое сообщение", {
                    body: message.content,
                    icon: "/path/to/icon.png", // Замените на путь к вашей иконке
                });
            }
        };

        socket.on(addKey, (message: MessageWithMemberWithProfileAndConversation) => {
            if(message.member.id === user?.id || !message.conversation.isNotify) {
                return;
            }

            playNotificationSound();
            showNotification(message);
        });

        return () => {
            socket.off(addKey);
        };
    }, [queryClient, addKey, socket]);

    return (
        <>
            <audio ref={audioRef} className="hidden">
                <source src="/notification.mp3" type="audio/mp3" />
                Ваш браузер не поддерживает аудиоэлемент.
            </audio>
        </>
    );
};

export default Notifications;
