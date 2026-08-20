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
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from "salas-reuniao-ui";
import { House, Megaphone, CalendarDays } from "lucide-react";

export function ConteudoDePagina() {
  return (
    <SidebarProvider style={{ minHeight: 460 }}>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <span style={{ fontWeight: 600, fontSize: 14, padding: "4px 8px" }}>Intranet</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <House />
                    <span>Início</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
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
          <h1 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Comunicados</h1>
        </header>
        <div style={{ padding: 16 }}>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: 0 }}>
            Nenhum comunicado novo desde sua última visita. Confira o mural abaixo.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
