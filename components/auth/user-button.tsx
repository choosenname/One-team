"use client";

import { LogOut, User, Settings } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import {NavigateButton} from "@/components/navigate-button";
import {UserAvatar} from "@/components/user-avatar";

export const UserButton = () => {
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar src={user?.image}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
                <NavigateButton path={"/profile"}>
                    <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2"/>
                        Profile
                    </DropdownMenuItem>
                </NavigateButton>
                <LogoutButton>
                    <DropdownMenuItem>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};