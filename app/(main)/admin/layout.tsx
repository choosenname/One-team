import React from "react";
import {AdminSidebar} from "@/components/admin/admin-sidebar";

const AdminLayout = async ({children}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full">
            <div
                className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <AdminSidebar/>
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}

export default AdminLayout;