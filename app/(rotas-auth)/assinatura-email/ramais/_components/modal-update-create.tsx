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
import type { RamalRow } from "./form-ramal";
import FormRamal from "./form-ramal";

export default function ModalUpdateAndCreate({
  isUpdating,
  ramal,
}: {
  isUpdating: boolean;
  ramal?: Partial<RamalRow>;
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
          <DialogTitle>{isUpdating ? "Editar " : "Criar "}Ramal</DialogTitle>
          <DialogDescription>
            {isUpdating
              ? "Altere o login ou o ramal de grupo."
              : "Informe o login do servidor e o ramal de grupo."}
          </DialogDescription>
        </DialogHeader>
        <FormRamal ramal={ramal} isUpdating={isUpdating} />
      </DialogContent>
    </Dialog>
  );
}
