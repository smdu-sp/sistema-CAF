/** @format */

import {
  ArrowLeftRight,
  BarChart2,
  Building,
  Building2,
  CalendarSearch,
  ClipboardCheck,
  House,
  LayoutDashboard,
  Package,
  TicketCheck,
  Users,
} from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/auth";
import {
  getCapacidadesHelpdesk,
  podeAcessarAreaChamadosHelpdesk,
  podeAcessarPatrimonioHelpdesk,
  podeAdministrarSistema,
} from "@/lib/permissoes";
import Link from "../link";

export async function NavMain() {
  const session = await auth();
  const usuario = (session as any)?.usuario ?? null;
  const permissao = usuario?.permissao?.toString?.() ?? "";
  const mostraAdmin = podeAdministrarSistema(permissao);
  const hd = getCapacidadesHelpdesk(permissao);
  const mostraHelpDesk =
    podeAcessarAreaChamadosHelpdesk(permissao) ||
    podeAcessarPatrimonioHelpdesk(permissao);

  return (
    <SidebarContent>
      {mostraHelpDesk && (
      <SidebarGroup>
        <SidebarGroupLabel>Help Desk</SidebarGroupLabel>
        <SidebarMenu>
          {hd.abrirChamados || hd.atenderChamados ? (
          <SidebarMenuItem>
            <Link href="/helpdesk">
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuItem>
          ) : null}
          {hd.abrirChamados || hd.atenderChamados ? (
          <SidebarMenuItem>
            <Link href="/helpdesk/chamados">
              <TicketCheck className="size-4" />
              <span>Chamados</span>
            </Link>
          </SidebarMenuItem>
          ) : null}
          {hd.patrimonio ? (
          <SidebarMenuItem>
            <Link href="/helpdesk/patrimonio">
              <Package className="size-4" />
              <span>Patrimônio</span>
            </Link>
          </SidebarMenuItem>
          ) : null}
          {hd.patrimonio ? (
          <SidebarMenuItem>
            <Link href="/helpdesk/transferencias">
              <ArrowLeftRight className="size-4" />
              <span>Transferências</span>
            </Link>
          </SidebarMenuItem>
          ) : null}
          {hd.unidades ? (
          <SidebarMenuItem>
            <Link href="/helpdesk/unidades">
              <Building className="size-4" />
              <span>Unidades</span>
            </Link>
          </SidebarMenuItem>
          ) : null}
          {hd.relatorios ? (
          <SidebarMenuItem>
            <Link href="/helpdesk/relatorios">
              <BarChart2 className="size-4" />
              <span>Relatórios</span>
            </Link>
          </SidebarMenuItem>
          ) : null}
        </SidebarMenu>
      </SidebarGroup>
      )}

      <SidebarGroup>
        <SidebarGroupLabel>Geral</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/home">
              <House className="size-4" />
              <span>Página Inicial</span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/reserva-salas">
              <CalendarSearch className="size-4" />
              <span>Reservas de Salas</span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/avaliacao-limpeza">
              <ClipboardCheck className="size-4" />
              <span>Avaliação de Limpeza</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {mostraAdmin && (
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/usuarios">
                <Users className="size-4" />
                <span>Usuários</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/coordenadorias">
                <Building2 className="size-4" />
                <span>Coordenadorias</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      )}
    </SidebarContent>
  );
}
