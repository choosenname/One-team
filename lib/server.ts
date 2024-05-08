import {db} from "@/lib/db";
import {includes} from "lodash";

export const getServersWithTextChannels = async () => {
    try
    {
        const servers = await db.server.findMany({
            include: {
                channels: {
                    where: {
                        type: "TEXT"
                    }
                }
            }
        })

        return servers;
    } catch (error) {
        return [];
    }
}