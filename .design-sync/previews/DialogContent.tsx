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
  Label,
  Input,
} from "salas-reuniao-ui";

export function NovoCargo() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Cargo</DialogTitle>
          <DialogDescription>Preencha o nome para cadastrar um novo cargo.</DialogDescription>
        </DialogHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <Label htmlFor="nome-cargo">Nome do cargo</Label>
          <Input id="nome-cargo" placeholder="Ex: Analista de Sistemas" />
        </div>
        <DialogFooter>
          <div style={{ display: "flex", gap: 8 }}>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button>Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
