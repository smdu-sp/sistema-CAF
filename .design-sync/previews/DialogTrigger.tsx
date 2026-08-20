import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  Button,
} from "salas-reuniao-ui";
import { Trash2 } from "lucide-react";

export function AcionarExclusaoDeRamal() {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Trash2 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desativar Ramal</DialogTitle>
        </DialogHeader>
        <p style={{ fontSize: 14 }}>Tem certeza que deseja desativar o ramal 1234?</p>
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
