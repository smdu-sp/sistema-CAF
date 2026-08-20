import * as React from "react";
import { Separator } from "salas-reuniao-ui";

export function Horizontal() {
  return (
    <div style={{ width: 240 }}>
      <p style={{ fontSize: 14, margin: 0 }}>Sala de Reunião 3</p>
      <Separator style={{ margin: "8px 0" }} />
      <p style={{ fontSize: 14, margin: 0, color: "#6b7280" }}>3º andar — Bloco B</p>
    </div>
  );
}

export function Vertical() {
  return (
    <div style={{ display: "flex", alignItems: "center", height: 32, gap: 12 }}>
      <span style={{ fontSize: 14 }}>Reservas</span>
      <Separator orientation="vertical" />
      <span style={{ fontSize: 14 }}>Salas</span>
    </div>
  );
}
