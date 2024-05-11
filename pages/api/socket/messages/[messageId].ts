import {NextApiRequest, NextApiResponse} from "next";
import { MemberRole } from "@prisma/client";

import { NextApiResponseServerIo } from "@/types";
import { currentUserPages } from "@/lib/current-user-pages";
import { db } from "@/lib/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    switch (req.method) {
        case "DELETE":
        case "PATCH":
            return await updateMessages(req, res);
        case "POST":
            return await relayMessages(req, res);
        default:
            return res.status(405).json({ error: "Method not allowed" });
    }
}

async function relayMessages(req: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        const user = await currentUserPages(req, res);
        const { forwardChannelId } = req.body;
        const { messageId, serverId, channelId } = req.query;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!serverId) {
            return res.status(400).json({ error: "Server ID missing" });
        }

        if (!channelId) {
            return res.status(400).json({ error: "Channel ID missing" });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        userId: user.id
                    }
                }
            },
            include: {
                members: true,
            }
        });

        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        });

        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const sourceMember = server.members.find((member) => member.userId === user.id);

        if (!sourceMember) {
            return res.status(404).json({ message: "Member not found" });
        }

        const sourceMessage = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string,
            }
        })

        if (!sourceMessage) {
            return res.status(404).json({ message: "Source message not found" });
        }

        const message = await db.message.create({
            data: {
                content: sourceMessage.content,
                fileUrl: sourceMessage.fileUrl,
                sourceMessageId: sourceMessage.id,
                channelId: forwardChannelId as string,
                memberId: sourceMember.id,
            },
            include: {
                member: {
                    include: {
                        user: true,
                    }
                }
            }
        });

        const channelKey = `chat:${forwardChannelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("[MESSAGES_ID_RELAY]", error);
        return res.status(500).json({ message: "Internal Error" });
    }
}

async function updateMessages(req: NextApiRequest, res: NextApiResponseServerIo) {
    try {
        const user = await currentUserPages(req, res);
        const { messageId, serverId, channelId } = req.query;
        const { content } = req.body;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!serverId) {
            return res.status(400).json({ error: "Server ID missing" });
        }

        if (!channelId) {
            return res.status(400).json({ error: "Channel ID missing" });
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        userId: user.id,
                    }
                }
            },
            include: {
                members: true,
            }
        })

        if (!server) {
            return res.status(404).json({ error: "Server not found" });
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });

        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        const member = server.members.find((member) => member.userId === user.id);

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        let message = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string,
            },
            include: {
                member: {
                    include: {
                        user: true,
                    }
                }
            }
        })

        if (!message || message.deleted) {
            return res.status(404).json({ error: "Message not found" });
        }

        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (req.method === "DELETE") {
            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted.",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            user: true,
                        }
                    }
                }
            })
        }

        if (req.method === "PATCH") {
            if (!isMessageOwner) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            user: true,
                        }
                    }
                }
            })
        }

        const updateKey = `chat:${channelId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);
    } catch (error) {
        console.log("[MESSAGE_ID_UPDATE]", error);
        return res.status(500).json({ error: "Internal Error" });
    }
}