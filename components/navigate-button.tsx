"use client";

import {useRouter} from "next/navigation";
import React from "react";

interface NavigateButtonProps {
    children: React.ReactNode;
    path: string,
    asChild?: boolean;
}

export const NavigateButton = ({children, path, asChild}: NavigateButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push(path);
    };

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};