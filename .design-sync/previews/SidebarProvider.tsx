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
} from "salas-reuniao-ui";
import { House, Megaphone, Building2 } from "lucide-react";

// The Sidebar inside uses collapsible="none": SidebarProvider's own mobile
// breakpoint (768px) would otherwise close the panel inside an off-canvas
// Sheet at this card's 640px-wide viewport, leaving nothing to grade.
export function ProvedorComConteudo() {
  return (
    <SidebarProvider style={{ minHeight: 460 }}>
      <Sidebar collapsible="none">
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
                    <Building2 />
                    <span>Diretório</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div style={{ padding: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>Comunicados</h2>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: 0 }}>
            O SidebarProvider fornece o contexto compartilhado (estado aberto/fechado, atalho de teclado) para a Sidebar e o SidebarInset lado a lado.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AbreParaFechado() {
  return (
    <SidebarProvider defaultOpen={false} style={{ minHeight: 460 }}>
      <Sidebar collapsible="none">
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div style={{ padding: 16, fontSize: 13, color: "var(--muted-foreground)" }}>
          defaultOpen={"{false}"} controla o estado inicial (expandido/recolhido) fornecido pelo provider.
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
