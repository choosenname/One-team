import {db} from "@/lib/db";

export const getDepartments = async () => {
    try {
        return await db.department.findMany();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const getDepartmentById = async (id: string) => {
    try {
        return await db.department.findUnique({
            where: {
                id,
            }
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}
