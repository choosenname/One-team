import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface UserAvatarProps {
    src?: string | null;
    className?: string;
}

export const UserAvatar = ({
                               src,
                               className
                           }: UserAvatarProps) => {
    return (
        <Avatar className={cn(
            "h-7 w-7 md:h-10 md:w-10",
            className
        )}>
                <AvatarImage src={src || ""} />
                <AvatarFallback className="bg-sky-500">
                    <User className="text-white" />
                </AvatarFallback>
        </Avatar>
    )
}