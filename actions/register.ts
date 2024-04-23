"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { RegisterSchema } from "@/schemas";
import {db} from "@/lib/db";
import {getUserByName} from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const {name , password,departmentId } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByName(name);

    if(existingUser) {
        return {error: "User name already in use"};
    }

    await db.user.create({
        data: {
            name,
            password: hashedPassword,
            departmentId,
            imageUrl: "",
        }
    });

    return {success: "Success"};
};