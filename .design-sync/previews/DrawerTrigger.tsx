import * as React from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Button,
} from "salas-reuniao-ui";
import { SlidersHorizontal } from "lucide-react";

export function AbrirFiltroDeSalas() {
  return (
    <Drawer defaultOpen>
      <DrawerTrigger asChild>
        <Button variant="outline" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SlidersHorizontal size={16} />
          Filtros
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filtrar Salas</DrawerTitle>
        </DrawerHeader>
        <p style={{ padding: "0 16px", fontSize: 14, color: "var(--muted-foreground)" }}>
          Capacidade, andar e layout disponíveis para reserva hoje.
        </p>
        <DrawerFooter>
          <Button>Aplicar filtros</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
