import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import {Server, Member, User, Message, Conversation} from "@prisma/client"

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


export type FullMessageType = Message & {
    sender: User;
    seen: User[];
};

export type FullConversationType = Conversation & {
    users: User[];
    messages: FullMessageType[];
};
