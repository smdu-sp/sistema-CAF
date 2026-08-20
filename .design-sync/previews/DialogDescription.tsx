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

export function EditarExtensao() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Ramal</DialogTitle>
          <DialogDescription>
            Alterações no ramal são refletidas automaticamente na assinatura de e-mail de todos os
            colaboradores vinculados a este setor.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div style={{ display: "flex", gap: 8 }}>
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
            <Button>Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
