import {Server} from "@prisma/client";
import {useModal} from "@/hooks/use-modal-store";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";

interface DeleteServerProps {
    original: Server;
}

export const DeleteServerMenuItem: React.FC<DeleteServerProps> = ({ original }) => {
    const { onOpen } = useModal();

    const handleDeleteServer = () => {
        onOpen("deleteServer", { server: original });
    };

    return (
        <DropdownMenuItem onClick={handleDeleteServer}>
            Удалить сервер
        </DropdownMenuItem>
    );
};