/** @format */

import { Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/auth/auth";
import Link from "next/link";
import BtnSignOut from "../btn-signout";

function iniciais(nome: string): string {
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function reduzNome(nome: string): string {
  if (nome.length <= 22) return nome;
  const partes = nome.split(" ");
  return `${partes[0]} ${partes[partes.length - 1]}`;
}

function labelPermissao(permissao: string): string {
  if (permissao === "DEV" || permissao === "ADM") return "Administrador";
  if (permissao === "SUP") return "Supervisor Help Desk";
  if (permissao === "TEC") return "Técnico Help Desk";
  if (permissao === "PAT") return "Gestor de Patrimônio";
  return "Servidor";
}

export async function NavUser() {
  const session = await auth();
  const usuario = (session as any)?.usuario;
  if (!session || !usuario) return null;

  const nomeExibicao =
    usuario?.nomeSocial || usuario?.nome || usuario?.login || "";
  const permissao = usuario?.permissao?.toString?.() ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-full flex items-center gap-3 px-3 py-3 border-t border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
          title="Opções do usuário"
        >
          <div
            className="size-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #E56E14 0%, #EDBA94 50%, #5CC9BD 100%)",
            }}
          >
            {iniciais(nomeExibicao)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-semibold text-white truncate leading-tight">
              {reduzNome(nomeExibicao)}
            </div>
            <div className="text-xs text-white/60 leading-tight mt-0.5">
              {labelPermissao(permissao)}
            </div>
          </div>
          <Settings className="size-4 text-white/60 shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 rounded-lg mb-1"
        align="start"
        side="top"
        sideOffset={4}
      >
        <DropdownMenuItem asChild className="p-1 font-normal">
          <Link href="/reserva-salas">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div
                className="size-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #E56E14 0%, #EDBA94 50%, #5CC9BD 100%)",
                }}
              >
                {iniciais(nomeExibicao)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {reduzNome(nomeExibicao)}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {usuario.email}
                </span>
              </div>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <BtnSignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
