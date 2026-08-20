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

export function ConfirmarCancelamentoDeReserva() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar Reserva</DialogTitle>
        </DialogHeader>
        <p style={{ fontSize: 14 }}>
          Tem certeza que deseja cancelar a reserva da Sala Diretoria em 25/08/2026, das 14:00 às 15:00?
        </p>
        <DialogFooter>
          <div style={{ display: "flex", gap: 8 }}>
            <DialogClose asChild>
              <Button variant="outline">Manter reserva</Button>
            </DialogClose>
            <Button variant="destructive">Cancelar reserva</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
