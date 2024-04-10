import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import {auth} from "@/auth";
import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {ModalProvider} from "@/components/providers/modal-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "OneTeam",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <SessionProvider session={session}>
            <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                storageKey="one-team-theme"
            >
                <ModalProvider />
                {children}
            </ThemeProvider>
            </body>
            </html>
        </SessionProvider>
    );
}
