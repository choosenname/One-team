import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server, Member, User } from "@prisma/client"

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

// Типы для картинок
export type ImageType = "jpg" | "jpeg" | "png" | "gif" | "svg";
export const imageExtensions: ImageType[] = ["jpg", "jpeg", "png", "gif", "svg"];

// Типы для видео
export type VideoType = "mp4" | "avi" | "mov" | "wmv" | "mkv";
export const videoExtensions: VideoType[] = ["mp4", "avi", "mov", "wmv", "mkv"];

// Типы для аудио
export type AudioType = "mp3" | "wav" | "ogg" | "flac" | "aac";
export const audioExtensions: AudioType[] = ["mp3", "wav", "ogg", "flac", "aac"];

type FileType = ImageType | VideoType | AudioType | "pdf" | "other";
