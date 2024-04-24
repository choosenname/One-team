import {currentUser} from "@/lib/auth";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {InitialModal} from "@/components/modals/initial-modal";

export default async function Home() {
    const user = await currentUser();

    if (user) {
        const server = await db.server.findFirst({
            where: {
                members: {
                    some: {
                        userId: user.id
                    }
                }
            }
        });

        if (server) {
            return redirect(`/servers/${server.id}`);
        } else {
            return redirect(`/me`);
        }
    } else {
        return redirect('/login');
    }

    return <InitialModal/>;
}
