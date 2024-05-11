import {NextResponse} from "next/server";
import {getServersWithTextChannels} from "@/lib/server";

export async function GET() {
    try{
        const servers = await getServersWithTextChannels();
        return NextResponse.json(servers);
    } catch (error) {
        console.log("[SERVER_WITH_TEXT_CHANNELS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}