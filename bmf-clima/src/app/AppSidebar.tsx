import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import React from "react";

export default function AppSidebar() {
  return (
  
          <Sidebar className="bg-primary" variant="inset">
          <SidebarHeader>Sidebar header</SidebarHeader>
          
          <SidebarContent>
          <SidebarGroup>History of Chats</ SidebarGroup>
          <SidebarGroup>Meteorology </ SidebarGroup>
          </ SidebarContent>
          
          <SidebarFooter>BMF-Clima</SidebarFooter>
          
          </Sidebar>
          );
}
