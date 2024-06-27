"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Member, MemberRole, User} from "@prisma/client";
import {Edit, FileIcon, Forward, ShieldAlert, ShieldCheck, Trash} from "lucide-react";
import Image from "next/image";
import {ForwardedRef, useEffect, useState} from "react";

import {UserAvatar} from "@/components/user-avatar";
import {ActionTooltip} from "@/components/action-tooltip";
import {cn} from "@/lib/utils";
import {Form, FormControl, FormField, FormItem,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {audioExtensions, AudioType, imageExtensions, ImageType, videoExtensions, VideoType} from "@/types";
import VideoPlayer from "@/components/video-player";
import AudioPlayer from "@/components/audio-player";
import {FileType} from "next/dist/lib/file-exists";
import {useModal} from "@/hooks/use-modal-store";
import {useParams, useRouter} from "next/navigation";
import {ExtendedUser} from "@/next-auth";
import {useFontSize} from "@/components/providers/FontSizeProvider";

interface ChatItemProps {
    id: string;
    content: string;
    member:  User;
    timestamp: string;
    fileUrl: string | null;
    sourceMessageMember: Member & {
        user: User;
    } | null;
    deleted: boolean;
    currentMember: User;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
    ref?: ForwardedRef<HTMLDivElement> | null;
}

const roleIconMap = {
    "USER": null,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>,
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const ConverChatItem = ({
                             id,
                             content,
                             member,
                             timestamp,
                             fileUrl,
                             sourceMessageMember,
                             deleted,
                             currentMember,
                             isUpdated,
                             socketUrl,
                             socketQuery,
                             ref,
                         }: ChatItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const {onOpen} = useModal();
    const params = useParams();
    const router = useRouter();
    const { fontSize } = useFontSize();

    const onMemberClick = () => {
        if (member.id === currentMember.id) {
            return;
        }

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }

    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === "Escape" || event.keyCode === 27) {
                setIsEditing(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keyDown", handleKeyDown);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema), defaultValues: {
            content: content
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`, query: socketQuery,
            });

            await axios.patch(url, values);

            form.reset();
            setIsEditing(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        form.reset({
            content: content,
        })
    }, [content]);

    const fileType = fileUrl?.split(".").pop();

    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin ||  isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;

    const isImage = (fileType ? imageExtensions.includes(fileType as ImageType) : false) && fileUrl;
    const isVideo = (fileType ? videoExtensions.includes(fileType as VideoType) : false) && fileUrl;
    const isAudio = (fileType ? audioExtensions.includes(fileType as AudioType) : false) && fileUrl;
    const isPDF = (fileType ? fileType === "pdf" : false) && fileUrl;
    const isOther = (fileType ? ![...imageExtensions, ...videoExtensions, ...audioExtensions, "pdf"].includes(fileType as FileType) : false) && fileUrl;

    return (<div ref={ref} className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
        <div className="group flex gap-x-2 items-start w-full">
            <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
                <UserAvatar src={member.imageUrl}/>
            </div>
            <div className="flex flex-col w-full">
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center">
                        <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                            {member.name}
                        </p>
                        <ActionTooltip label={member.role}>
                            {roleIconMap[member.role]}
                        </ActionTooltip>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
                </div>
                {sourceMessageMember && !deleted && (
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    forwarded from:&nbsp;
                    {sourceMessageMember?.user.name}
                </span>
                )}
                {isImage && (<a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                >
                    <Image
                        src={fileUrl}
                        alt={content}
                        fill
                        className="object-cover"
                    />
                </a>)}
                {isVideo && (<a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-96"
                >
                    <VideoPlayer
                        src={fileUrl}
                        type={`video/${fileType}`}
                        className="object-cover"
                    />
                </a>)}
                {isAudio && (<a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                >
                    <AudioPlayer
                        src={fileUrl}
                        type={`audio/${fileType}`}
                        className="object-cover"
                    />
                </a>)}
                {isPDF && (<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                    <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                    >
                        PDF-файл
                    </a>
                </div>)}
                {isOther && (<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                    <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                    >
                        Файл {fileType}
                    </a>
                </div>)}
                {!fileUrl && !isEditing && (
                    <p style={{fontSize: fontSize}} className={cn("text-sm text-zinc-600 dark:text-zinc-300",
                        deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1", )}>
                        {content}
                        {isUpdated && !deleted && (<span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>)}
                    </p>)}
                {!fileUrl && isEditing && (<Form {...form}>
                    <form
                        className="flex items-center w-full gap-x-2 pt-2"
                        onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({field}) => (<FormItem className="flex-1">
                                <FormControl>
                                    <div className="relative w-full">
                                        <Input
                                            disabled={isLoading}
                                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                            placeholder="Edited message"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>)}
                        />
                        <Button disabled={isLoading} size="sm">
                            Сохранить
                        </Button>
                    </form>
                    <span className="text-[10px] mt-1 text-zinc-400">
                Нажмите escape для отмены, enter для сохранения
              </span>
                </Form>)}
            </div>
        </div>
        {canDeleteMessage && (<div
            className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
            <ActionTooltip label="Forward">
                <Forward
                    onClick={() => onOpen("forwardMessage", {
                        apiUrl: `${socketUrl}/${id}`, query: socketQuery,
                    })}
                    className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
            </ActionTooltip>
            {canEditMessage && (<ActionTooltip label="Edit">
                <Edit
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
            </ActionTooltip>)}
            <ActionTooltip label="Delete">
                <Trash
                    onClick={() => onOpen("deleteMessage", {
                        apiUrl: `${socketUrl}/${id}`, query: socketQuery,
                    })}
                    className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                />
            </ActionTooltip>
        </div>)}
    </div>)
}