import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  Button,
} from "salas-reuniao-ui";

export function ConfirmarSaidaDeParticipante() {
  return (
    <Drawer defaultOpen>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Remover Participante</DrawerTitle>
          <DrawerDescription>Maria Souza será removida da reunião de 25/08/2026.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button variant="destructive">Remover</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
