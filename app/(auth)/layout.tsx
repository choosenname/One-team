const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        // Внешний макет для страниц аутентификации
        <div className="h-full flex items-center justify-center"> {/* Контейнер для центрирования содержимого */}
            {children} {/* Отображение дочерних компонентов */}
        </div>
    );
}

export default AuthLayout; // Экспорт компонента AuthLayout
