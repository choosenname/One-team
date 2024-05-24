import {currentUser} from "@/lib/auth";
import {redirect} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import {Server, Users} from "lucide-react";
import {AdminSection} from "@/components/admin/admin-section";


export const AdminSidebar = async () => {
    const user = await currentUser();

    if (!user) {
        return redirect("/");
    }

    return (<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <div className="w-full text-md font-semibold px-3 flex items-center h-10">
                Панель администратора
            </div>
            <div className="px-3">
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                <AdminSection label={"Сотрудники"} icon={<Users/>} link={"users"}/>
                <AdminSection label={"Сервера"} icon={<Server/>} link={"servers"}/>
            </div>
        </div>)
}