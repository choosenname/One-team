"use client"

import {ActionTooltip} from "@/components/action-tooltip";
import {ShieldBan} from "lucide-react";
import {useRouter} from "next/navigation";

export const NavigationAdmin = () => {
    const router = useRouter();

    const onClick = () => {
        router.push(`/admin`);
    }

    return (
        <div>
            <ActionTooltip
                side="right"
                align="center"
                label="Панель администратора"
            >
                <button
                    onClick={onClick}
                    className="group flex items-center"
                >
                    <div
                        className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <ShieldBan
                            className="group-hover:text-white transition text-emerald-500"
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}
