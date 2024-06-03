import React from "react"; // Импорт библиотеки React
import { AdminSidebar } from "@/components/admin/admin-sidebar"; // Импорт компонента AdminSidebar из модуля административной панели

// Компонент макета административной панели
const AdminLayout = async ({ children }: { children: React.ReactNode; }) => {
    return (
        <div className="h-full"> {/* Контейнер для всего макета */}
            {/* Боковая панель администратора */}
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0"> {/* Стили для боковой панели */}
                <AdminSidebar /> {/* Вывод компонента AdminSidebar */}
            </div>
            {/* Основное содержимое административной панели */}
            <main className="h-full md:pl-60"> {/* Стили для основного содержимого */}
                {children} {/* Вывод дочерних компонентов */}
            </main>
        </div>
    );
}

export default AdminLayout; // Экспорт компонента AdminLayout
