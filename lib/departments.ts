import {db} from "@/lib/db";

export const getDepartments = async () => {
    try {
        return await db.department.findMany();
    } catch (error) {
        return [];
    }
};
