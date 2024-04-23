"use server"

import {db} from "@/lib/db";
import {User} from "@prisma/client";
import {getDepartmentById} from "@/lib/departments";

export const inviteUser = async (user: User) => {

    const department = await getDepartmentById(user.departmentId);

    if (!department) {
        return {error: "Department not found"};
    }

    const serversToUpdate = await db.server.findMany({
        where: {
            department: department,
        }
    });

    const updatePromises = serversToUpdate.map(async (server) =>
    {
        const updatedServer = await db.server.update({
            where: {
                id: server.id,
            },
            data: {
                members: {
                    create: [
                        {
                            userId: user.id,
                        }
                    ]
                }
            }
        });
        return updatedServer;
    });

    return {success: "Success"};
};