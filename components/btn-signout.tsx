"use client";

import React from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function BtnSignOut() {
  return (
    <Button
      variant="ghost"
      className="w-full dark:bg-destructive hover:bg-destructive/10 dark:text-foreground dark:hover:bg-destructive/80 hover:text-destructive text-destructive flex items-center justify-center"
      onClick={async () => {
        await signOut({ redirect: true, redirectTo: "/login" });
      }}
    >
      <LogOut className="text-destructive dark:text-foreground" /> Sair
    </Button>
  );
}
