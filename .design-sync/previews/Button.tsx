import * as React from "react";
import { Loader2, Trash2, Plus } from "lucide-react";
import { Button } from "salas-reuniao-ui";

export function Variants() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      <Button variant="default">Salvar</Button>
      <Button variant="destructive">Excluir</Button>
      <Button variant="outline">Cancelar</Button>
      <Button variant="secondary">Voltar</Button>
      <Button variant="ghost">Ignorar</Button>
      <Button variant="link">Saiba mais</Button>
    </div>
  );
}

export function Sizes() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Button size="sm">Pequeno</Button>
      <Button size="default">Padrão</Button>
      <Button size="lg">Grande</Button>
      <Button size="icon" aria-label="Adicionar">
        <Plus />
      </Button>
    </div>
  );
}

export function WithIcon() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Button variant="destructive">
        <Trash2 />
        Excluir cargo
      </Button>
      <Button disabled>
        <Loader2 className="animate-spin" />
        Salvando...
      </Button>
    </div>
  );
}

export function Disabled() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Button disabled>Salvar</Button>
      <Button variant="outline" disabled>
        Cancelar
      </Button>
    </div>
  );
}
