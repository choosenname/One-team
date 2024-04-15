import {NextApiRequest} from "next";

import {db} from "@/lib/db";
import {NextApiResponseServerIo} from "@/types";
import {auth} from "@/auth";

export const currentUserPages = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
    const session  = await auth(req, res);

    if (!session) {
        return null;
    }

    return db.user.findUnique({
        where: {
            id: session.user.id
        }
    });
}