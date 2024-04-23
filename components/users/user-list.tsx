import {UserBox} from "@/components/users/user-box";
import {ExtendedUser} from "@/next-auth";

interface UserListProps {
    items: ExtendedUser[];
}

export const UserList = ({items}:UserListProps) => {
    return (
        <aside className='inset-y-0 left-0 block w-full pb-20 overflow-y-auto border-r border-gray-200 lg:left-20 lg:w-80 lg:block'>
            <div className='px-5'>
                <div className='flex-col'>
                    <div className='py-4 text-2xl font-bold text-neutral-800'>
                        People
                    </div>
                </div>
                {items.map(item => (
                    <UserBox key={item.id} data={item} />
                ))}
            </div>
        </aside>
    );
}