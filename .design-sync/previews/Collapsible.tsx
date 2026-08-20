import * as React from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from "salas-reuniao-ui";
import { ChevronsUpDown } from "lucide-react";

export function DetalhesDaSalaAberto() {
  return (
    <Collapsible defaultOpen style={{ width: 300 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontWeight: 600, fontSize: 14 }}>Sala Diretoria — 8º andar</p>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <ChevronsUpDown size={16} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent style={{ marginTop: 8 }}>
        <ul style={{ fontSize: 13, color: "var(--muted-foreground)", display: "flex", flexDirection: "column", gap: 4, paddingLeft: 16 }}>
          <li>Capacidade: 12 pessoas</li>
          <li>Layout: Fixo, mesa em U</li>
          <li>TV 55&quot;, videoconferência, quadro branco</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function DetalhesDaSalaFechado() {
  return (
    <Collapsible style={{ width: 300 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontWeight: 600, fontSize: 14 }}>Sala Diretoria — 8º andar</p>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <ChevronsUpDown size={16} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent style={{ marginTop: 8 }}>
        <ul style={{ fontSize: 13, color: "var(--muted-foreground)", display: "flex", flexDirection: "column", gap: 4, paddingLeft: 16 }}>
          <li>Capacidade: 12 pessoas</li>
          <li>Layout: Fixo, mesa em U</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
