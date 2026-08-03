/** @format */

"use client";

import Link from "next/link";
import { ChevronsUpDown, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeAvatar } from "../shared/employee-avatar";

interface UserSummaryProps {
  name?: string;
  role?: string;
  email?: string;
  imageUrl?: string | null;
}

export function UserSummary({
  name = "Voce",
  role = "Analista de Sistemas - TI",
  email = "voce@prefeitura.sp.gov.br",
  imageUrl,
}: UserSummaryProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto justify-start gap-3 px-2 py-2">
          <EmployeeAvatar name={name} imageUrl={imageUrl} />
          <span className="hidden min-w-0 flex-1 text-left sm:block">
            <span className="block truncate text-sm font-semibold">{name}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {role}
            </span>
          </span>
          <ChevronsUpDown className="hidden size-4 text-muted-foreground sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <EmployeeAvatar name={name} imageUrl={imageUrl} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">
                {email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/intranet/perfil">
            <UserRound className="size-4" />
            Meu perfil
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
