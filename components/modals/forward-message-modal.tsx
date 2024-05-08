"use client";

import {useModal} from "@/hooks/use-modal-store";
import {useEffect, useState} from "react";
import qs from "query-string";
import axios, {AxiosResponse} from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {getServersWithTextChannels} from "@/lib/server";
import {ServersWithChannels} from "@/types";
import {ServerSearch} from "@/components/server/server-search";
import {Hash} from "lucide-react";
import {Server} from "@prisma/client";

export const ForwardMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "forwardMessage";
    const { apiUrl, query} = data;

    const [isLoading, setIsLoading] = useState(false);
    const [serversWithChannels, setServersWithChannels]
        = useState<ServersWithChannels>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const servers = await axios.get('/api/servers/text-channels');
                setServersWithChannels(servers.data);
                console.log("Servers", servers);
            } catch (error) {
                console.error('Error fetching servers with channels:', error);
            }
        };
        if (isOpen && type === "forwardMessage") {
            fetchData();
        }
    },[isOpen, type]);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            });

            await axios.post(url);

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
                        Relay Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        <ServerSearch
                            data={serversWithChannels?.map((server) =>({
                            label: server.name,
                            type: "channel",
                            data: server.channels.map((channel)=>({
                                id: channel.id,
                                name: channel.name,
                                icon: <Hash className="mr-2 h-4 w-4" />,
                            }))
                        }))} />
                        Are you sure you want to do this? <br />
                        The message will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={onClick}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}