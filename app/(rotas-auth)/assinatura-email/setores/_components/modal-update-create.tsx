"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, SquarePen } from "lucide-react";
import type { SetorRow } from "./form-setor";
import FormSetor from "./form-setor";

export default function ModalUpdateAndCreate({
  isUpdating,
  setor,
}: {
  isUpdating: boolean;
  setor?: Partial<SetorRow>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={
            isUpdating
              ? "bg-background hover:bg-primary"
              : "bg-primary hover:bg-primary hover:opacity-70 group transition-all ease-linear duration-200"
          }
        >
          {isUpdating ? (
            <SquarePen size={28} className="text-primary group-hover:text-white group" />
          ) : (
            <Plus size={28} className="text-white group" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdating ? "Editar " : "Criar "}Unidade</DialogTitle>
          <DialogDescription>
            {isUpdating
              ? "Altere o nome da unidade da assinatura."
              : "Preencha o nome para cadastrar uma nova unidade."}
          </DialogDescription>
        </DialogHeader>
        <FormSetor setor={setor} isUpdating={isUpdating} />
      </DialogContent>
    </Dialog>
  );
}
