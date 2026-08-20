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

export function CancelarSolicitacaoDeTeletrabalho() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar Solicitação</DialogTitle>
        </DialogHeader>
        <p style={{ fontSize: 14 }}>
          Deseja cancelar a solicitação de teletrabalho para o período de 24/08 a 28/08/2026?
        </p>
        <DialogFooter>
          <div style={{ display: "flex", gap: 8 }}>
            <DialogClose asChild>
              <Button variant="outline">Voltar</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive">Cancelar solicitação</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
