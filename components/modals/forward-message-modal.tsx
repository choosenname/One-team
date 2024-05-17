"use client";

import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import qs from "query-string";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ServersWithChannels } from "@/types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForwardMessageSchema } from "@/schemas";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

export const ForwardMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "forwardMessage";
    const { apiUrl, query } = data;

    const [isLoading, setIsLoading] = useState(false);
    const [serversWithChannels, setServersWithChannels] = useState<ServersWithChannels>([]);

    const form = useForm<z.infer<typeof ForwardMessageSchema>>({
        resolver: zodResolver(ForwardMessageSchema),
        defaultValues: {
            forwardChannelId: "",
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const servers = await axios.get('/api/servers/text-channels');
                setServersWithChannels(servers.data);
            } catch (error) {
                console.error('Ошибка при получении серверов с каналами:', error);
            }
        };
        if (isOpen && type === "forwardMessage") {
            fetchData();
        }
    }, [isOpen, type]);

    const onSubmit = async (value: z.infer<typeof ForwardMessageSchema>) => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });

            await axios.post(url, value);

            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Переслать сообщение
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="forwardChannelId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel
                                            className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                                        >
                                            Выберите канал
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Выберите отдел"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {serversWithChannels?.map((server) => (
                                                    <SelectGroup key={server.id}>
                                                        <SelectLabel>{server.name}</SelectLabel>
                                                        {server.channels.map((channel) => (
                                                            <SelectItem key={channel.id} value={channel.id}>
                                                                {channel.name}
                                                            </SelectItem>))}
                                                    </SelectGroup>))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <div className="flex items-center justify-between w-full">
                                <Button
                                    disabled={isLoading}
                                    onClick={onClose}
                                    variant="ghost"
                                >
                                    Отмена
                                </Button>
                                <Button
                                    disabled={isLoading}
                                >
                                    Подтвердить
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
