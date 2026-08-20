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
import type { CargoRow } from "./form-cargo";
import FormCargo from "./form-cargo";

export default function ModalUpdateAndCreate({
  isUpdating,
  cargo,
}: {
  isUpdating: boolean;
  cargo?: Partial<CargoRow>;
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
          <DialogTitle>{isUpdating ? "Editar " : "Criar "}Cargo</DialogTitle>
          <DialogDescription>
            {isUpdating
              ? "Altere o nome do cargo da assinatura."
              : "Preencha o nome para cadastrar um novo cargo."}
          </DialogDescription>
        </DialogHeader>
        <FormCargo cargo={cargo} isUpdating={isUpdating} />
      </DialogContent>
    </Dialog>
  );
}
