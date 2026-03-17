import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "./AppSidebar"

export const metadata: Metadata = {
  title: "BMF Climate Helper",
  description: "Get the best help for climate emergencies",
};

const geistSans = Geist({
                          variable: "--font-geist-sans",
                          subsets: ["latin"],
                        });

const geistMono = Geist_Mono({
                               variable: "--font-geist-mono",
                               subsets: ["latin"],
                             });

export default function RootLayout({
                                     children,
                                   }: Readonly<{
                                     children: React.ReactNode;
                                   }>) {
  
  return (
          <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SidebarProvider>
          <AppSidebar />
          <main className="h-full w-full">
          <SidebarTrigger />
          {children}
          </main>
          </SidebarProvider>
          </body>
          </html>
          );
}
