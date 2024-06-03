import { DataTable } from "@/components/ui/data-table"; // Импорт компонента DataTable из модуля пользовательского интерфейса
import { ServerColumn, UserColumn } from "@/columns"; // Импорт колонок ServerColumn и UserColumn из модуля колонок
import { db } from "@/lib/db"; // Импорт объекта базы данных

// Компонент административной панели для просмотра серверов
const AdminServers = async () => {
    const data = await db.server.findMany({ // Запрос данных о серверах из базы данных
        include: {
            department: true, // Включение информации о департаменте
        }
    });

    return (
        <div>
            {/* Вывод таблицы данных с помощью компонента DataTable */}
            <DataTable columns={ServerColumn} data={data} /> {/* Передача колонок и данных в DataTable */}
        </div>
    );
}

export default AdminServers; // Экспорт компонента AdminServers
