"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PictureInPicture } from "lucide-react";


import { ActionTooltip } from "@/components/action-tooltip";
import axios from "axios";
import {useEffect, useState} from "react";
import {useModal} from "@/hooks/use-modal-store";

interface ChatImageButtonProps {
    conversationId?: string;
}

export const ChatImageButton = ({conversationId}: ChatImageButtonProps) => {
    const { onOpen } = useModal();

    const Icon = PictureInPicture;
    const tooltipLabel = "Фон чата" ;

    return (
        <ActionTooltip side="bottom" label={tooltipLabel}>
            <button onClick={() => onOpen("chatImage", {conversationId: conversationId})} className="hover:opacity-75 transition mr-4">
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionTooltip>
    )
}