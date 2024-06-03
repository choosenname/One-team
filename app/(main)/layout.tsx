import { NavigationSidebar } from "@/components/navigation/navigation-sidebar"; // Импорт компонента боковой панели навигации

// Функция MainLayout для основного макета страницы
const MainLayout = async ({
                              children // Дочерние элементы
                          }: {
    children: React.ReactNode; // Дочерние элементы в формате React.ReactNode
}) => {
    return (
        <div className="h-full"> {/* Контейнер основного макета с высотой 100% */}
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0"> {/* Боковая панель навигации */}
                <NavigationSidebar /> {/* Вставка компонента боковой панели навигации */}
            </div>
            <main className="md:pl-[72px] h-full"> {/* Основное содержимое страницы */}
                {children} {/* Вставка дочерних элементов */}
            </main>
        </div>
    );
}

export default MainLayout; // Экспорт функции MainLayout
