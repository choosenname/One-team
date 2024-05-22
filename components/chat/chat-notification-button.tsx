"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, BellOff } from "lucide-react";


import { ActionTooltip } from "@/components/action-tooltip";
import axios from "axios";
import {useEffect, useState} from "react";

interface ChatNotificationProps {
    conversationId?: string;
}

export const ChatNotificationButton = ({conversationId}: ChatNotificationProps) => {
    const [isNotification, setIsNotification] = useState(false);

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await axios.get(`/api/conversation/${conversationId}/notification`);
                setIsNotification(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchNotification();
    }, []);

    const onClick = async () => {
        try {
            const response = await axios.patch(`/api/conversation/${conversationId}/notification`);
            setIsNotification(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const Icon = isNotification ? Bell : BellOff;
    const tooltipLabel = isNotification ? "Disable notifications" : "Enable notifications" ;

    return (
        <ActionTooltip side="bottom" label={tooltipLabel}>
            <button onClick={onClick} className="hover:opacity-75 transition mr-4">
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionTooltip>
    )
}