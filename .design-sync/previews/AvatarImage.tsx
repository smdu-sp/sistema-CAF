import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "salas-reuniao-ui";

const fotoAzul =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='%230ea5e9'/><circle cx='32' cy='24' r='12' fill='white'/><path d='M12 58c0-13 9-22 20-22s20 9 20 22' fill='white'/></svg>";

const fotoVerde =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='%23059669'/><circle cx='32' cy='24' r='12' fill='white'/><path d='M12 58c0-13 9-22 20-22s20 9 20 22' fill='white'/></svg>";

export function FotoDoServidor() {
  return (
    <Avatar style={{ width: 48, height: 48 }}>
      <AvatarImage src={fotoAzul} alt="Bruno Silva" />
      <AvatarFallback>BS</AvatarFallback>
    </Avatar>
  );
}

export function FotoDaResponsavel() {
  return (
    <Avatar style={{ width: 48, height: 48 }}>
      <AvatarImage src={fotoVerde} alt="Maria Aparecida" />
      <AvatarFallback>MA</AvatarFallback>
    </Avatar>
  );
}
