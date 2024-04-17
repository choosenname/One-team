import {currentUser} from "@/lib/auth";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {unstable_update} from "@/auth";

export async function PATCH(
    req: Request,
) {
    try {
        const user = await currentUser();
        const { name, imageUrl, password } = await req.json();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedUser = await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                name,
                imageUrl,
                password
            }
        });

        await unstable_update({
            user: {
                name: updatedUser.name,
                imageUrl: updatedUser.imageUrl,
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.log("[PROFILE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}