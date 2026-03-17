import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  return (
          <Sidebar className="bg-primary">
          <SidebarHeader>Sidebar header</SidebarHeader>
          
          <SidebarContent>
          <SidebarGroup>SidebarGroup 1</ SidebarGroup>
          <SidebarGroup>SidebarGroup 2</ SidebarGroup>
          </ SidebarContent>
          
          <SidebarFooter>Footer</SidebarFooter>
          
          </Sidebar>
          );
}
