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

export function ConfirmarAtivacaoDeUsuario() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ativar Usuário</DialogTitle>
          <DialogDescription>O usuário voltará a ter acesso ao sistema imediatamente.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div style={{ display: "flex", gap: 8 }}>
            <DialogClose asChild>
              <Button variant="outline">Voltar</Button>
            </DialogClose>
            <Button>Ativar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
