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
        header: "Name",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "department.department",
        header: "Department",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const original = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(original.id)}
                        >
                            Copy user ID
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
        header: "Name",
    },
    {
        accessorKey: "department.department",
        header: "Department",
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
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(original.id)}
                        >
                            Copy server ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteServerMenuItem original={server} />
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
