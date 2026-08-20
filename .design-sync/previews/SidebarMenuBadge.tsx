import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "salas-reuniao-ui";
import { House, LifeBuoy, Megaphone, Boxes } from "lucide-react";

export function ComContagem() {
  return (
    <SidebarProvider style={{ minHeight: 460 }}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <span style={{ fontWeight: 600, fontSize: 14, padding: "4px 8px" }}>Intranet</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <House />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Megaphone />
                    <span>Comunicados</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>5</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <LifeBuoy />
                    <span>Helpdesk</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Boxes />
                    <span>Inventário TI</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

export function ContagemAlta() {
  return (
    <SidebarProvider style={{ minHeight: 460 }}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <span style={{ fontWeight: 600, fontSize: 14, padding: "4px 8px" }}>Helpdesk</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Chamados</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <LifeBuoy />
                    <span>Meus chamados abertos</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>99+</SidebarMenuBadge>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
