"use client"

import { ColumnDef } from "@tanstack/react-table"
import {UserAvatar} from "@/components/user-avatar";
import {FullServerType, FullUserType} from "@/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "./components/ui/dropdown-menu";
import {DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoreHorizontal} from "lucide-react";
import {useModal} from "@/hooks/use-modal-store";
import {Server} from "@prisma/client";
import {DeleteServerMenuItem} from "@/components/admin/items/delete-server-item";
import axios from "axios";

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

export const UserColumn: ColumnDef<FullUserType>[] = [
    {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => {
            const imageUrl = row.getValue("imageUrl") as string
            return <UserAvatar src={imageUrl} />
        },
    },
    {
        accessorKey: "name",
        header: "Имя",
    },
    {
        accessorKey: "role",
        header: "Роль",
    },
    {
        accessorKey: "department.department",
        header: "Отдел",
    },
    {
        accessorKey: "post",
        header: "Должность",
    },
    {
        accessorKey: "office",
        header: "Кабинет",
    },
    {
        accessorKey: "startWork",
        header: "Время начала работы",
        cell: ({ row }) => formatTime(row.getValue("startWork") as string),
    },
    {
        accessorKey: "endWork",
        header: "Время конца работы",
        cell: ({ row }) => formatTime(row.getValue("endWork") as string),
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const original = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Открыть меню</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(original.id)}
                        >
                            Копировать ID пользователя
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => axios.delete(`/api/profile/${original.id}`)}
                        >
                            Удалить пользователя
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]


export const ServerColumn: ColumnDef<FullServerType>[] = [
    {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => {
            const imageUrl = row.getValue("imageUrl") as string
            return <UserAvatar src={imageUrl} />
        },
    },
    {
        accessorKey: "name",
        header: "Имя",
    },
    {
        accessorKey: "department.department",
        header: "Отдел",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const original = row.original
            const server = original as Server

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Открыть меню</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(original.id)}
                        >
                            Копировать ID сервера
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteServerMenuItem original={server} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
