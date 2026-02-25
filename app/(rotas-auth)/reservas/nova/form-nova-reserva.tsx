"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { criarReserva } from "../actions";
import type { CoordenadoriaOption, SalaOption } from "../services/reservas";

export function FormNovaReserva({
  salas,
  coordenadorias,
  coordenadoriaIdPadrao,
  valueSalaId,
  valueData,
  onSalaChange,
  onDataChange,
}: {
  salas: SalaOption[];
  coordenadorias: CoordenadoriaOption[];
  coordenadoriaIdPadrao: string;
  valueSalaId?: string;
  valueData?: string;
  onSalaChange?: (salaId: string) => void;
  onDataChange?: (data: string) => void;
}) {
  const [state, formAction, isPending] = useActionState(criarReserva, {});

  const hoje = new Date().toISOString().slice(0, 10);
  const controlledSala = valueSalaId !== undefined;
  const controlledData = valueData !== undefined;

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="coordenadoriaId">Coordenadoria</Label>
        <select
          id="coordenadoriaId"
          name="coordenadoriaId"
          defaultValue={coordenadoriaIdPadrao}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Não informada</option>
          {coordenadorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="salaId">Sala</Label>
        <select
          id="salaId"
          name="salaId"
          required
          value={controlledSala ? valueSalaId ?? "" : undefined}
          defaultValue={!controlledSala ? "" : undefined}
          onChange={
            onSalaChange
              ? (e) => onSalaChange(e.target.value)
              : undefined
          }
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecione a sala</option>
          {salas.map((s) => {
            const partes = [s.nome];
            if (s.andar) partes.push(s.andar);
            if (s.localizacao) partes.push(s.localizacao);
            const textoAndarLocal = partes.length > 1 ? ` — ${partes.slice(1).join(", ")}` : "";
            const capacidade = s.capacidade != null ? ` (${s.capacidade} lugares)` : "";
            return (
              <option key={s.id} value={s.id}>
                {s.nome}{textoAndarLocal}{capacidade}
              </option>
            );
          })}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            name="data"
            type="date"
            required
            min={hoje}
            value={controlledData ? valueData ?? "" : undefined}
            defaultValue={!controlledData ? undefined : undefined}
            onChange={
              onDataChange
                ? (e) => onDataChange(e.target.value)
                : undefined
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            name="titulo"
            type="text"
            required
            placeholder="Ex: Reunião de planejamento"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="horaInicio">Horário início</Label>
          <Input
            id="horaInicio"
            name="horaInicio"
            type="time"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horaFim">Horário fim</Label>
          <Input
            id="horaFim"
            name="horaFim"
            type="time"
            required
          />
        </div>
      </div>
      {state.erro && (
        <p className="text-sm text-destructive">{state.erro}</p>
      )}
      {state.sucesso && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Reserva realizada com sucesso!
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Reservar"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard">Voltar</Link>
        </Button>
      </div>
    </form>
  );
}
