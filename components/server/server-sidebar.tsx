import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { ServerHeader } from "./server-header";
import {currentUser} from "@/lib/auth";

interface ServerSidebarProps {
    serverId: string;
}

export const ServerSidebar = async ({
                                        serverId
                                    }: ServerSidebarProps) => {
    const user = await currentUser();

    if (!user) {
        return redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    user: true,
                },
                orderBy: {
                    role: "asc",
                }
            }
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter((member) => member.userId !== user.id)

    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.userId === user.id)?.role;

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
                server={server}
                role={role}
            />
        </div>
    )
}