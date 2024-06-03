import { ErrorCard } from "@/components/auth/error-card"; // Импорт компонента ErrorCard из модуля компонентов аутентификации

// Компонент страницы ошибки аутентификации
const AuthErrorPage = () => {
    return (
        <ErrorCard /> // Вывод компонента ErrorCard для отображения сообщения об ошибке аутентификации
    );
};

export default AuthErrorPage; // Экспорт компонента AuthErrorPage
