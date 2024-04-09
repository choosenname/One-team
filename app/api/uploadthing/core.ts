import { createUploadthing, type FileRouter } from "uploadthing/next";
import {currentUser} from "@/lib/auth";

const f = createUploadthing();

const handleAuth = async () => {
    const currentUserData = await currentUser();
    if (!currentUserData) throw new Error("Unauthorized")
    return {userId: currentUserData.id}
}

export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),
    messageFile: f([])
        .middleware(() => handleAuth())
        .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;