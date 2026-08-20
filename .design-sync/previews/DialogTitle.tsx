import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Badge,
} from "salas-reuniao-ui";

export function DetalhesDoChamado() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ display: "flex", alignItems: "center", gap: 8 }}>
            Chamado #482 — Impressora sem toner
            <Badge variant="secondary">Aberto</Badge>
          </DialogTitle>
        </DialogHeader>
        <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
          Aberto por Maria Souza em 18/08/2026. Setor: Financeiro, 3º andar.
        </p>
      </DialogContent>
    </Dialog>
  );
}
