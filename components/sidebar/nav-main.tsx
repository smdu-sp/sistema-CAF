/** @format */

import {
  ArrowLeftRight,
  BarChart2,
  Building,
  Building2,
  CalendarSearch,
  ClipboardCheck,
  FileText,
  House,
  KeyRound,
  LayoutDashboard,
  Network,
  Package,
  Phone,
  TicketCheck,
  Users,
  Wrench,
} from "lucide-react";
import { rotaChamadosArea } from "@/lib/helpdesk/tipos-chamado";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import {
  getCapacidadesHelpdesk,
  podeAcessarAreaChamadosHelpdesk,
  podeAcessarPatrimonioHelpdesk,
  podeAdministrarSistema,
} from "@/lib/permissoes";
import Link from "../link";
import { listarPermissoes } from "@/services/permissoes/";

export async function NavMain() {
  const session = await auth();
  const usuario = (session as any)?.usuario ?? null;
  const permissao = usuario?.permissao?.toString?.() ?? "";
  const mostraAdmin = podeAdministrarSistema(permissao);
  const hd = getCapacidadesHelpdesk(permissao);
  const mostraHelpDesk =
    podeAcessarAreaChamadosHelpdesk(permissao) ||
    podeAcessarPatrimonioHelpdesk(permissao);

  let permissoesModulos: string[] = [];
  try {
    permissoesModulos = await listarPermissoes();
  } catch {
    permissoesModulos = [];
  }
  const mostraGestaoPessoas = permissoesModulos.includes(
    "gestao_pessoas.modulo.visualizar",
  );

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
          <>
          <SidebarMenuItem>
            <Link href={rotaChamadosArea("suporte_tecnico")}>
              <TicketCheck className="size-4" />
              <span>Suporte Técnico</span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href={rotaChamadosArea("telefonia_voip")}>
              <Phone className="size-4" />
              <span>Telefonia VoIP</span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href={rotaChamadosArea("acesso_sistemas")}>
              <KeyRound className="size-4" />
              <span>Acesso a Sistemas</span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/helpdesk/chamados/acesso-sistemas/autorizacoes">
              <KeyRound className="size-4 opacity-60" />
              <span>Autorizações de acesso</span>
            </Link>
          </SidebarMenuItem>
          {hd.gerenciarAcessoSistemas ? (
          <>
          <SidebarMenuItem>
            <Link href="/helpdesk/acesso-sistemas/permissoes">
              <KeyRound className="size-4 opacity-60" />
              <span>Permissões de sistemas</span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/helpdesk/acesso-sistemas/pontos-focais">
              <KeyRound className="size-4 opacity-60" />
              <span>Pontos focais</span>
            </Link>
          </SidebarMenuItem>
          </>
          ) : null}
          <SidebarMenuItem>
            <Link href={rotaChamadosArea("rede_conectividade")}>
              <Network className="size-4" />
              <span>Rede e Conectividade</span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href={rotaChamadosArea("reparos_infraestrutura")}>
              <Wrench className="size-4" />
              <span>Reparos de Infraestrutura</span>
            </Link>
          </SidebarMenuItem>
          </>
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
            <Link href="/helpdesk/movimentacoes">
              <ArrowLeftRight className="size-4" />
              <span>Movimentações</span>
            </Link>
          </SidebarMenuItem>
          ) : null}
          {hd.patrimonio ? (
          <SidebarMenuItem>
            <Link href="/helpdesk/termos">
              <FileText className="size-4" />
              <span>Termos</span>
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
            <Link href="/">
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
          {mostraGestaoPessoas ? (
          <SidebarMenuItem>
            <Link href="/gestao-pessoas">
              <Users className="size-4" />
              <span>Gestão de Pessoas</span>
            </Link>
          </SidebarMenuItem>
          ) : null}
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
