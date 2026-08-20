import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Button,
} from "salas-reuniao-ui";

export function ConfirmarExclusaoDeEquipamento() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remover Equipamento</DialogTitle>
        </DialogHeader>
        <p style={{ fontSize: 14 }}>
          Tem certeza que deseja remover o notebook (patrimônio 004521) do inventário?
        </p>
        <DialogFooter>
          <div style={{ display: "flex", gap: 8 }}>
            <DialogClose asChild>
              <Button variant="outline">Voltar</Button>
            </DialogClose>
            <Button variant="destructive">Remover</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
