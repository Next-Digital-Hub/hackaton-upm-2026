"use client";
import { ChevronDown } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from "react";
import { useRouter } from "next/navigation";

const fakeHistory = [
                     "Weekly Rainfall Summary Report",
                     "Real-Time Wind Speed Alerts",
                     "Temperature Trends Over the Last 30 Days",
                     "Severe Storm Warning Analysis",
                     "Daily Humidity Level Updates",
                     "Air Pressure Fluctuation Report",
                     "Heatwave Monitoring Dashboard",
                     "Snowfall Accumulation Tracker",
                     "Lightning Strike Activity Log",
                     "Seasonal Climate Comparison Insights",
                     "UV Index Risk Notifications",
                     "Fog Density and Visibility Report",
                     "Hurricane Path Prediction Updates",
                     "Drought Conditions Assessment",
                     "Microclimate Data Overview"
                     ];

export default function AppSidebar() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push("/dashboard");
  }
  
  return (
          <Sidebar className="bg-primary" variant="inset">
          <SidebarHeader>Sidebar header</SidebarHeader>
          
          <SidebarGroup>Meteorology </ SidebarGroup>
          <SidebarGroup onClick={handleClick}>Crear Emergencia </ SidebarGroup>
          
          <SidebarContent>
          <SidebarMenu>
          <SidebarMenuItem>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <SidebarMenuButton>
          History of Chats
          <ChevronDown className="ml-auto" />
          </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
          
          {fakeHistory.map((h) => <DropdownMenuItem key={h}><span>{h}</span></ DropdownMenuItem>)}
          
          </DropdownMenuContent>
          </DropdownMenu>
          </SidebarMenuItem>
          </SidebarMenu>
          
          
          </ SidebarContent>
          
          
          <SidebarFooter>BMF-Clima</SidebarFooter>
          
          </Sidebar>
          );
}
