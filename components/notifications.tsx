"use client";

import React, { useEffect, useRef } from 'react';
import { MessageWithMemberWithProfile } from "@/types";
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

        const showNotification = (message: MessageWithMemberWithProfile) => {
            if (Notification.permission === "granted") {
                new Notification("Новое сообщение", {
                    body: message.content,
                    icon: "/path/to/icon.png", // Замените на путь к вашей иконке
                });
            }
        };

        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            if(message.member.id === user?.id) {
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
                Your browser does not support the audio element.
            </audio>
        </>
    );
};

export default Notifications;
