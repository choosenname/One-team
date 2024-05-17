import {currentUser} from "@/lib/auth";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {unstable_update} from "@/auth";

export async function DELETE(
    req: Request,
    { params }: { params: { userId: string }}
) {
    try {
        const user = await currentUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await db.$transaction(async (prisma) => {
            // Delete related Member records first
            await prisma.member.deleteMany({
                where: {
                    userId: params.userId,
                },
            });

            // Delete the User record
            await prisma.user.delete({
                where: {
                    id: params.userId,
                },
            });
        });

        return new NextResponse("User deleted successfully", { status: 200 });
    } catch (error) {
        console.log("[PROFILE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}