"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import React from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator"

export default function AppSidebar() {
  const router = useRouter();
  return (
          <Sidebar className="bg-zinc-600 rounded-lg" variant="inset">
          <SidebarHeader className="bg-zinc-600" onClick= {() => router.push("/")}>Sidebar header</SidebarHeader>
          
          <SidebarContent className= "bg-zinc-600">
          <SidebarGroup>History of Chats</ SidebarGroup>
          <Separator />
          <SidebarGroup>Meteorology </ SidebarGroup>
          <Separator />
          <SidebarGroup onClick= {() => router.push("/dashboard")}>Crear una alerta </ SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className = "bg-zinc-600">BMF-Clima</SidebarFooter>
          <Separator />
          </Sidebar>
          );
}
