import * as React from "react";
import { Skeleton } from "salas-reuniao-ui";

export function LinhasDeTexto() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 240 }}>
      <Skeleton style={{ height: 16, width: "70%" }} />
      <Skeleton style={{ height: 16, width: "50%" }} />
    </div>
  );
}

export function CardDeCarregamento() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Skeleton style={{ height: 40, width: 40, borderRadius: "9999px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton style={{ height: 12, width: 160 }} />
        <Skeleton style={{ height: 12, width: 100 }} />
      </div>
    </div>
  );
}
