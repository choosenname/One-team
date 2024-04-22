import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import {auth} from "@/auth";
import {SessionProvider} from "next-auth/react";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {ModalProvider} from "@/components/providers/modal-provider";
import {SocketProvider} from "@/components/providers/socket-provider";
import {QueryProvider} from "@/components/providers/query-provider";
import ActiveStatus from "@/components/conversation/active-status";

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
    return (<SessionProvider session={session}>
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            storageKey="one-team-theme"
        >
            <SocketProvider>
                <ModalProvider/>
                <QueryProvider>
                    <ActiveStatus />
                    {children}
                </QueryProvider>
            </SocketProvider>
        </ThemeProvider>
        </body>
        </html>
    </SessionProvider>);
}
