"use client";

import React, { useState, useCallback } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import axios from "axios";
import {Avatar} from "@/components/ui/avatar";
import {UserAvatar} from "@/components/user-avatar";

interface UserBoxProps {
    data: User;
}

export const UserBox = ({ data }: UserBoxProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true);

        axios
            .post("/api/conversations", {
                userId: data.id,
            })
            .then(response => {
                router.push(`/conversations/${response.data.id}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [data, router]);

    return (
        <div
            onClick={handleClick}
            className='relative flex items-center w-full p-3 space-x-3 transition bg-white rounded-lg cursor-pointer hover:bg-neutral-100'>
            <UserAvatar src={data.imageUrl} />
            <div className='flex-1 min-w-0'>
                <div className='focus:outline-none'>
                    <div className='flex items-center justify-between mb-1'>
                        <p className='text-sm font-medium text-gray-900'>
                            {data?.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
