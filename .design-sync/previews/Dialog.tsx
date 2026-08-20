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

export function ConfirmAction() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desativar Cargo</DialogTitle>
          <DialogDescription>Esta ação pode ser revertida depois.</DialogDescription>
        </DialogHeader>
        <p style={{ fontSize: 14 }}>Tem certeza que deseja desativar este cargo?</p>
        <DialogFooter>
          <div style={{ display: "flex", gap: 8 }}>
            <DialogClose asChild>
              <Button variant="outline">Voltar</Button>
            </DialogClose>
            <Button variant="destructive">Desativar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
