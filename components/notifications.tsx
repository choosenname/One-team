"use client"

import React, {useEffect} from 'react';
import {useToast} from '@/components/ui/use-toast';
import {pusherClient} from "@/lib/pusher";
import {FullMessageType} from "@/types";
import {useCurrentUser} from "@/hooks/use-current-user";

const Notifications = () => {
    const user = useCurrentUser();
    const {toast} = useToast();

    useEffect(() => {
        const channel = pusherClient.subscribe('notification');
        channel.bind('notification:new', (data: FullMessageType) => {
            if (user?.id == data.senderId) return;
            toast({
                title: data.sender.name || "", description: data.body,
            })
        });

        return () => {
            pusherClient.unsubscribe('notification');
        };
    }, []);

    return (<></>);
};

export default Notifications;
