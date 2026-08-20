import * as React from "react";
import { toast } from "sonner";
import { Toaster } from "salas-reuniao-ui";

export function Sucesso() {
  React.useEffect(() => {
    toast.success("Sala reservada com sucesso!", {
      description: "Sala 101 — hoje às 14h00",
    });
  }, []);
  return <Toaster />;
}

export function Erro() {
  React.useEffect(() => {
    toast.error("Erro", {
      description: "Não foi possível concluir a operação.",
    });
  }, []);
  return <Toaster />;
}

export function Informativo() {
  React.useEffect(() => {
    toast("Chamado #1044 atualizado", {
      description: "Status alterado para Concluído.",
    });
  }, []);
  return <Toaster />;
}
