"use client";

import {LogOut, Settings} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/components/auth/logout-button";
import {UserAvatar} from "@/components/user-avatar";
import {Button} from "@/components/ui/button";
import {useModal} from "@/hooks/use-modal-store";
import {User} from "@prisma/client";


interface UserButtonProps {
    user: User;
}

export const UserButton = ({user}: UserButtonProps) => {
    const { onOpen } = useModal();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar src={user.imageUrl}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <Button variant="ghost" onClick={() => onOpen("editProfile", {user})}>
                    <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2"/>
                        Профиль
                    </DropdownMenuItem>
                </Button>
                <LogoutButton>
                    <DropdownMenuItem>
                        <LogOut className="h-4 w-4 mr-2" />
                        Выйти
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};