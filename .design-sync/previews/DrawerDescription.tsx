import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "salas-reuniao-ui";

export function DescricaoDoTeletrabalho() {
  return (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Solicitação de Teletrabalho</DrawerTitle>
          <DrawerDescription>
            Período de 24/08 a 28/08/2026. Aguardando aprovação da coordenadoria.
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
