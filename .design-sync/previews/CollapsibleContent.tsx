import * as React from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from "salas-reuniao-ui";
import { ChevronsUpDown } from "lucide-react";

export function InfraestruturaDaSala() {
  return (
    <Collapsible defaultOpen style={{ width: 300 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontWeight: 600, fontSize: 14 }}>Infraestrutura da sala</p>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <ChevronsUpDown size={16} />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={{ fontSize: 13 }}>Andar: 8º — Nº da sala: 802</p>
        <p style={{ fontSize: 13 }}>Mobiliário: mesa em U, 12 cadeiras</p>
        <p style={{ fontSize: 13 }}>Mídia: TV 55&quot;, videoconferência</p>
      </CollapsibleContent>
    </Collapsible>
  );
}
