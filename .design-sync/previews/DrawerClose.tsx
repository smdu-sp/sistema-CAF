import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Button,
} from "salas-reuniao-ui";

export function FecharDetalheDaSala() {
  return (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sala Diretoria</DrawerTitle>
        </DrawerHeader>
        <p style={{ padding: "0 16px", fontSize: 14, color: "var(--muted-foreground)" }}>
          8º andar — Capacidade para 12 pessoas.
        </p>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
