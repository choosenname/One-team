import {currentUser} from "@/lib/auth";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";
import {NavigationAction} from "@/components/navigation/navigation-action";
import {NavigationItem} from "@/components/navigation/navigation-item";
import {Separator} from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {ModeToggle} from "@/components/mode-toggle";
import {UserButton} from "@/components/auth/user-button";
import {getUserById} from "@/data/user";

export const NavigationSidebar = async () => {
    const user = await currentUser();

    if (!user || !user.id) {
        return redirect("/");
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return redirect("/");
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    userId: user.id
                }
            }
        }
    });

    return (
        <div
            className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3"
        >
            <NavigationAction/>
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            />
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle/>
                <UserButton user={dbUser} />
            </div>
        </div>
    )
}