import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Button,
} from "salas-reuniao-ui";

export function EditarSetor() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Setor</DialogTitle>
          <DialogDescription>Altere o nome do setor da assinatura de e-mail.</DialogDescription>
        </DialogHeader>
        <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
          Setor atual: Tecnologia da Informação
        </p>
        <DialogFooter>
          <div style={{ display: "flex", gap: 8 }}>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button>Salvar alterações</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
