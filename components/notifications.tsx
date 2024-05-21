"use client"

import React, {useEffect} from 'react';
import {useToast} from '@/components/ui/use-toast';
import {pusherClient} from "@/lib/pusher";
import {FullMessageType, MessageWithMemberWithProfile} from "@/types";
import {useCurrentUser} from "@/hooks/use-current-user";
import {useChatSocket} from "@/hooks/use-chat-socket";
import {useSocket} from "@/components/providers/socket-provider";
import {useQueryClient} from "@tanstack/react-query";

const Notifications = () => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    const addKey = `chat:messages`;

    useEffect(() => {
        if (!socket) {
            return;
        }

        const showNotification = (message: MessageWithMemberWithProfile) => {
            if (Notification.permission === "granted") {
                new Notification("New message", {
                    body: message.content,
                    icon: "/path/to/icon.png", // Замените на путь к вашей иконке
                });
            }
        };

        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            showNotification(message);
        });

        return () => {
            socket.off(addKey);
        }
    }, [queryClient, addKey, socket]);


    return (<></>);
};

export default Notifications;
