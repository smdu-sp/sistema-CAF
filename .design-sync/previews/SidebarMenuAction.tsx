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
  SidebarMenuAction,
} from "salas-reuniao-ui";
import { CalendarSearch, Plus, MoreHorizontal, Star } from "lucide-react";

export function AcaoDeAdicionar() {
  return (
    <SidebarProvider style={{ minHeight: 460 }}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <span style={{ fontWeight: 600, fontSize: 14, padding: "4px 8px" }}>Reservas de Salas</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Salas</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <CalendarSearch />
                    <span>Sala Diretoria — 8º andar</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction title="Nova reserva">
                    <Plus />
                  </SidebarMenuAction>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <CalendarSearch />
                    <span>Sala Reuniões — 3º andar</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction title="Nova reserva">
                    <Plus />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

export function AcaoDeMaisOpcoes() {
  return (
    <SidebarProvider style={{ minHeight: 460 }}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <span style={{ fontWeight: 600, fontSize: 14, padding: "4px 8px" }}>Favoritos</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Atalhos</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Star />
                    <span>Helpdesk</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction title="Mais opções">
                    <MoreHorizontal />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
