import {currentUser} from "@/lib/auth";
import {NextResponse} from "next/server";
import {Message} from "@prisma/client";
import {db} from "@/lib/db";
import {getDepartments} from "@/lib/departments";

export async function GET()
{
    try {
        const departments = await getDepartments();
        return NextResponse.json(departments);
    } catch (error) {
        console.log("[DEPARTMENTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}