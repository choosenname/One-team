import {db} from "@/lib/db";

export const getUserByName = async (name: string) => {
    try{
        return await db.user.findUnique({
            where: {
                name
            }
        });
    } catch {
        return null;
    }
}
export const getUserById = async (id: string) => {
    try{
        return await db.user.findUnique({
            where: {
                id: id
            }
        });
    } catch {
        return null;
    }
}