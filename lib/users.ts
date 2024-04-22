import {auth} from "@/auth";
import {db} from "@/lib/db";

const getUser = async () => {
    const session = await auth();

    if (!session?.user?.name) return [];

    try {
        const users = await db.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                NOT: {
                    name: session.user.name,
                },
            },
        });

        return users;
    } catch (error) {
        return [];
    }
};

export default getUser;
