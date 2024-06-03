"use server"; // Объявление, указывающее, что данный файл предназначен для серверной части приложения

import { DataTable } from "@/components/ui/data-table"; // Импорт компонента DataTable из модуля пользовательского интерфейса
import { UserColumn } from "@/columns"; // Импорт колонки UserColumn из модуля колонок
import { db } from "@/lib/db"; // Импорт объекта базы данных
import { Button } from "@/components/ui/button"; // Импорт компонента Button из модуля пользовательского интерфейса
import Link from "next/link"; // Импорт компонента Link из библиотеки Next.js для создания ссылок

// Компонент административной панели для просмотра пользователей
const AdminUsers = async () => {
    const data = await db.user.findMany({ // Запрос данных о пользователях из базы данных
        include: {
            department: true, // Включение информации о департаменте
        }
    });

    return (
        <div>
            {/* Кнопка для добавления нового пользователя */}
            <Button>
                <Link href="/register"> {/* Создание ссылки на страницу регистрации */}
                    Добавить пользователя {/* Текст ссылки */}
                </Link>
            </Button>
            {/* Вывод таблицы данных с помощью компонента DataTable */}
            <DataTable columns={UserColumn} data={data} /> {/* Передача колонок и данных в DataTable */}
        </div>
    );
}

export default AdminUsers; // Экспорт компонента AdminUsers
