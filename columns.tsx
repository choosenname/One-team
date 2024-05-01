"use client"

import {Department, Server, User} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table"
import {UserAvatar} from "@/components/user-avatar";
import {FullServerType, FullUserType} from "@/types";

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
]
