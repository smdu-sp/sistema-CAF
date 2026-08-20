import * as React from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from "salas-reuniao-ui";
import { ChevronsUpDown } from "lucide-react";

export function VerMaisDetalhes() {
  return (
    <Collapsible defaultOpen style={{ width: 300 }}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ChevronsUpDown size={14} />
          Ver mais detalhes
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent style={{ marginTop: 10 }}>
        <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
          Mobiliário: 1 mesa em U, 12 cadeiras. Mídia: TV 55&quot;, sistema de videoconferência.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}
