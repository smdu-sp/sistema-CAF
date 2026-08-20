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
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator,
} from "salas-reuniao-ui";
import { House, Megaphone, CalendarDays } from "lucide-react";

export function NoCabecalhoDaPagina() {
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
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <CalendarDays />
                    <span>Eventos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderBottom: "1px solid var(--border)" }}>
          <SidebarTrigger />
          <SidebarSeparator style={{ height: 16 }} orientation="vertical" />
          <h1 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Início</h1>
        </header>
        <div style={{ padding: 16, fontSize: 13, color: "var(--muted-foreground)" }}>
          Clique no botão para recolher ou expandir a barra lateral.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
