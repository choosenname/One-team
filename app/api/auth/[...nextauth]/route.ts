import { currentUser } from "@/lib/auth"; // Импорт функции получения текущего пользователя из модуля авторизации
import { NextResponse } from "next/server"; // Импорт класса NextResponse из модуля next/server
import { db } from "@/lib/db"; // Импорт объекта базы данных из модуля базы данных
import { unstable_update } from "@/auth"; // Импорт функции нестабильного обновления из модуля авторизации

export { GET, POST } from "@/auth"; // Экспорт функций GET и POST из модуля авторизации

// Функция PATCH для обновления данных профиля пользователя
export async function PATCH(
    req: Request, // Запрос на обновление данных
) {
    try {
        const user = await currentUser(); // Получение текущего пользователя
        const { name, password, imageUrl } = await req.json(); // Извлечение данных из запроса

        if (!user) { // Если пользователь не авторизован
            return new NextResponse("Unauthorized", { status: 401 }); // Возврат ответа с ошибкой "Unauthorized"
        }

        // Обновление данных пользователя в базе данных
        const updatedUser = await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                name,
                password,
                imageUrl,
            }
        });

        // Нестабильное обновление данных пользователя
        await unstable_update({
            user: {
                name: updatedUser.name,
                imageUrl: updatedUser.imageUrl,
            }
        });

        return NextResponse.json(updatedUser); // Возврат ответа с обновленными данными пользователя
    } catch (error) { // Обработка ошибок
        console.log("[PROFILE_PATCH]", error); // Вывод информации об ошибке в консоль
        return new NextResponse("Internal Error", { status: 500 }); // Возврат ответа с ошибкой "Internal Error"
    }
}
