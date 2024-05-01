import {DataTable} from "@/components/ui/data-table";
import {ServerColumn, UserColumn} from "@/columns";
import {db} from "@/lib/db";

const AdminServers = async () => {
    const data = await db.server.findMany({
        include:{
            department: true,
        }
    });

    return (
        <div>
            <DataTable columns={ServerColumn} data={data} />
        </div>
    );
}


export default AdminServers;