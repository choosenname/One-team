"use server"

import {ProfileSchema} from "@/schemas";
import {z} from "zod";
import {currentUser} from "@/lib/auth";
import {getUserById} from "@/data/user";
import {db} from "@/lib/db";
import {unstable_update} from "@/auth";

export const profile = async (values: z.infer<typeof ProfileSchema>) => {
    const user = await currentUser();

    if (!user) {
        return {error: "Unauthorized"}
    }

    const dbUser = await getUserById(user.id!);

    if (!dbUser) {
        return {error: "Unauthorized"}
    }

    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        }
    });

    await unstable_update({
        user: {
            name: updatedUser.name,
            role: updatedUser.role,
        }
    });

    return {success: "Settings updated"}
}