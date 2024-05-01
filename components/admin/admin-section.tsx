"use client"

import {useRouter} from "next/navigation";
import React from "react";

interface AdminSectionProps {
    label: string;
    icon: React.ReactElement;
    link: string;
}

export const AdminSection = ({label, icon, link}: AdminSectionProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push(`/admin/${link}`)
    }

    return (<button
        onClick={onClick}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10
            dark:hover:bg-zinc-700/50 transition mb-1"
    >
        <div className="h-8 w-8 md:h-8 md:w-8 items-center flex">
            {icon}
        </div>
        <p
            className="font-semibold text-sm text-zinc-500 group-hover:text-zinc-600
                dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"
        >
            {label}
        </p>
    </button>)
}