/** @format */

"use client";

import React from "react";
import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { ArrowLeftFromLineIcon } from "lucide-react";

export default function ToogleSidebarBtn() {
  const { toggleSidebar } = useSidebar();
  return (
    <SidebarMenuButton
      className="cursor-pointer h-auto py-2 hover:!bg-white/10"
      size="lg"
      onClick={() => toggleSidebar()}
    >
      <div
        className="flex aspect-square size-10 items-center justify-center rounded-xl text-white font-bold text-sm shrink-0"
        style={{
          background:
            "linear-gradient(135deg, #E56E14 0%, #EDBA94 45%, #5CC9BD 100%)",
        }}
      >
        SM
      </div>
      <div className="grid flex-1 text-left leading-tight">
        <span className="truncate font-bold text-sm text-white">
          Serviços SMUL
        </span>
        <span className="truncate text-xs text-white/60">
          SMUL · São Paulo
        </span>
      </div>
      <ArrowLeftFromLineIcon className="text-white/70 shrink-0" />
    </SidebarMenuButton>
  );
}
