import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Badge,
} from "salas-reuniao-ui";

export function TituloDoChamado() {
  return (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Chamado #482
            <Badge variant="secondary">Aberto</Badge>
          </DrawerTitle>
        </DrawerHeader>
        <p style={{ padding: "0 16px", fontSize: 14, color: "var(--muted-foreground)" }}>
          Impressora sem toner — Setor Financeiro, 3º andar.
        </p>
      </DrawerContent>
    </Drawer>
  );
}
