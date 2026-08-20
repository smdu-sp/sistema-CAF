import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "salas-reuniao-ui";

const fotoServidor =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='%234f46e5'/><circle cx='32' cy='24' r='12' fill='white'/><path d='M12 58c0-13 9-22 20-22s20 9 20 22' fill='white'/></svg>";

export function ComFoto() {
  return (
    <Avatar>
      <AvatarImage src={fotoServidor} alt="Bruno Silva" />
      <AvatarFallback>BS</AvatarFallback>
    </Avatar>
  );
}

export function SomenteIniciais() {
  return (
    <Avatar>
      <AvatarFallback>JS</AvatarFallback>
    </Avatar>
  );
}

export function Grande() {
  return (
    <Avatar style={{ width: 56, height: 56 }}>
      <AvatarFallback style={{ fontSize: 18 }}>MA</AvatarFallback>
    </Avatar>
  );
}

export function GrupoDeServidores() {
  return (
    <div style={{ display: "flex" }}>
      <Avatar style={{ marginRight: -8, border: "2px solid white" }}>
        <AvatarFallback>BS</AvatarFallback>
      </Avatar>
      <Avatar style={{ marginRight: -8, border: "2px solid white" }}>
        <AvatarFallback>JS</AvatarFallback>
      </Avatar>
      <Avatar style={{ border: "2px solid white" }}>
        <AvatarFallback>+5</AvatarFallback>
      </Avatar>
    </div>
  );
}
