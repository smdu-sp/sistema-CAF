import * as React from "react";
import { Avatar, AvatarFallback } from "salas-reuniao-ui";

export function Iniciais() {
  return (
    <Avatar>
      <AvatarFallback>BS</AvatarFallback>
    </Avatar>
  );
}

export function ComCorPersonalizada() {
  return (
    <Avatar>
      <AvatarFallback style={{ backgroundColor: "#2563eb", color: "white" }}>MA</AvatarFallback>
    </Avatar>
  );
}

export function VariasIniciais() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Avatar>
        <AvatarFallback style={{ backgroundColor: "#16a34a", color: "white" }}>JS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback style={{ backgroundColor: "#dc2626", color: "white" }}>RF</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback style={{ backgroundColor: "#7c3aed", color: "white" }}>CP</AvatarFallback>
      </Avatar>
    </div>
  );
}
