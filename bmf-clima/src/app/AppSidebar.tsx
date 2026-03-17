"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import React from "react";
import { useRouter } from "next/navigation";

export default function AppSidebar() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push("/dashboard");
  }
  
  return (
          <Sidebar className="bg-primary" variant="inset">
          <SidebarHeader>Sidebar header</SidebarHeader>
          
          <SidebarContent>
          <SidebarGroup>History of Chats</ SidebarGroup>
          <SidebarGroup>Meteorology </ SidebarGroup>
          <SidebarGroup onClick={handleClick}>Crear Emergencia </ SidebarGroup>
          </ SidebarContent>
          
          <SidebarFooter>BMF-Clima</SidebarFooter>
          
          </Sidebar>
          );
}
