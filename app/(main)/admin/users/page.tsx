import {DataTable} from "@/components/ui/data-table";
import {UserColumn} from "@/columns";
import {db} from "@/lib/db";

const AdminUsers = async () => {
    const data = await db.user.findMany({
        include:{
            department: true,
        }
    });

    return (
        <div>
            <DataTable columns={UserColumn} data={data} />
        </div>
    );
}


export default AdminUsers;