"use server"

import {DataTable} from "@/components/ui/data-table";
import {UserColumn} from "@/columns";
import {db} from "@/lib/db";
import {Button} from "@/components/ui/button";
import {router} from "next/client";
import {redirect} from "next/navigation";
import Link from "next/link";

const AdminUsers = async () => {
    const data = await db.user.findMany({
        include:{
            department: true,
        }
    });

    return (
        <div>
            <Button>

            <Link href={"/register"}>
                Добавить пользователя
            </Link>
            </Button>
            <DataTable columns={UserColumn} data={data} />
        </div>
    );
}


export default AdminUsers;