import {Server as NetServer, Socket} from "net";
import {NextApiResponse} from "next";
import {Server as SocketIOServer} from "socket.io";
import {Channel, Conversation, Department, DirectMessage, Member, Message, Server, User} from "@prisma/client"
import {ExtendedUser} from "@/next-auth";

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & { user: User })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};


export type ImageType = "jpg" | "jpeg" | "png" | "gif" | "svg";
export const imageExtensions: ImageType[] = ["jpg", "jpeg", "png", "gif", "svg"];

export type VideoType = "mp4" | "avi" | "mov" | "wmv" | "mkv";
export const videoExtensions: VideoType[] = ["mp4", "avi", "mov", "wmv", "mkv"];

export type AudioType = "mp3" | "wav" | "ogg" | "flac" | "aac";
export const audioExtensions: AudioType[] = ["mp3", "wav", "ogg", "flac", "aac"];

type FileType = ImageType | VideoType | AudioType | "pdf" | "other";


export type FullMessageType = DirectMessage & {
    sender: ExtendedUser; seen: ExtendedUser[];
};

export type FullConversationType = Conversation & {
    users: ExtendedUser[]; directMessages: FullMessageType[];
};

export type FullUserType = User & {
    department: Department;
}

export type FullServerType = Server & {
    department: Department;
}

export type ServersWithChannels = (Server & {
    channels: Channel[];
})[]

export type MessageWithMemberWithProfile = Message & {
    member: Member & {
        user: User
    }, sourceMessage: Message & {
        member: Member & {
            user: User
        }
    },
}
