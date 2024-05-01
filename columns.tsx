"use client"

import {Department, User} from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table"
import {UserAvatar} from "@/components/user-avatar";
import {getDepartmentById} from "@/lib/departments";

export const UserColumn: ColumnDef<User>[] = [
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
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => {
            const department = row.getValue("department") as Department
            return department.department
        },
    },
]
