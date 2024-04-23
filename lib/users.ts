import {auth} from "@/auth";
import {db} from "@/lib/db";
import {FullConversationType} from "@/types";
import {User} from "@prisma/client";
import {useSession} from "next-auth/react";
import {useMemo} from "react";

export const getUsers = async () => {
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

export const useOtherUser = (
    conversation: FullConversationType | { users: User[] }
) => {
    const session = useSession();

    const otherUser = useMemo(() => {
        const currentUserName = session.data?.user?.name;

        const otherUser = conversation.users.filter(
            user => user.name !== currentUserName
        );

        return otherUser[0];
    }, [session.data?.user?.name, conversation.users]);

    return otherUser;
};