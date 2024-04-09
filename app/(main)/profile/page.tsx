"use client";
import {useCurrentUser} from "@/hooks/use-current-user";
import {logout} from "@/actions/logout";
import {UserButton} from "@/components/auth/user-button";

const ProfilePage = () => {
    const user = useCurrentUser();

    const onClick = () => {
        logout();
    };

    return (
        <div className="bg-white p-10 rounded-xl">
            <UserButton />
            <button onClick={onClick} type="submit">
                Sign out
            </button>
        </div>
    );
}

export default ProfilePage;