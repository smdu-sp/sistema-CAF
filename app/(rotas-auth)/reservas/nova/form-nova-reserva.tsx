"use client";

import { useActionState, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, User, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { criarReserva } from "../actions";
import type { CoordenadoriaOption, SalaOption } from "../services/reservas";
import { cn } from "@/lib/utils";

type ParticipanteSugestao = { id: string; nome: string; login: string; email: string };

const HORA_INICIO = 9;
const HORA_FIM = 19;

function gerarHorarios(): string[] {
  const horarios: string[] = [];
  for (let h = HORA_INICIO; h <= HORA_FIM; h++) {
    horarios.push(`${h.toString().padStart(2, "0")}:00`);
    if (h < HORA_FIM)
      horarios.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return horarios;
}

const HORARIOS = gerarHorarios();

export function FormNovaReserva({
  salas,
  coordenadorias,
  coordenadoriaIdPadrao,
  valueSalaId,
  valueData,
  onSalaChange,
  onDataChange,
  usuarioNome,
  usuarioEmail,
}: {
  salas: SalaOption[];
  coordenadorias: CoordenadoriaOption[];
  coordenadoriaIdPadrao: string;
  valueSalaId?: string;
  valueData?: string;
  onSalaChange?: (salaId: string) => void;
  onDataChange?: (data: string) => void;
  usuarioNome?: string | null;
  usuarioEmail?: string | null;
}) {
  const [state, formAction, isPending] = useActionState(criarReserva, {});

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const controlledSala = valueSalaId !== undefined;
  const controlledData = valueData !== undefined;

  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [participantes, setParticipantes] = useState<ParticipanteSugestao[]>([]);
  const [participantesQuery, setParticipantesQuery] = useState("");
  const [participantesSugestoes, setParticipantesSugestoes] = useState<ParticipanteSugestao[]>([]);
  const [participantesLoading, setParticipantesLoading] = useState(false);
  const [participantesDropdownOpen, setParticipantesDropdownOpen] = useState(false);
  const participantesDropdownRef = useRef<HTMLDivElement>(null);

  const buscarUsuarios = useCallback(async (q: string) => {
    if (q.length < 2) {
      setParticipantesSugestoes([]);
      return;
    }
    setParticipantesLoading(true);
    try {
      const res = await fetch(`/api/usuarios/busca?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setParticipantesSugestoes(Array.isArray(data) ? data : []);
    } catch {
      setParticipantesSugestoes([]);
    } finally {
      setParticipantesLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => buscarUsuarios(participantesQuery), 300);
    return () => clearTimeout(t);
  }, [participantesQuery, buscarUsuarios]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (participantesDropdownRef.current && !participantesDropdownRef.current.contains(e.target as Node)) {
        setParticipantesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dataDate =
    valueData &&
    (() => {
      const [y, m, d] = valueData.split("-").map(Number);
      return new Date(y, m - 1, d);
    })();

  const tituloData = dataDate
    ? format(dataDate, "d 'de' MMMM", { locale: ptBR })
    : "";

  const indexInicio = HORARIOS.indexOf(horaInicio);
  const indexFim = HORARIOS.indexOf(horaFim);
  const horariosDesabilitados =
    indexInicio >= 0 && indexFim > indexInicio
      ? null
      : (slot: string) => {
          const i = HORARIOS.indexOf(slot);
          if (indexInicio < 0) return false;
          return selectingEnd ? i <= indexInicio : false;
        };

  const handleSlotClick = (slot: string) => {
    if (!selectingEnd) {
      setHoraInicio(slot);
      setHoraFim("");
      setSelectingEnd(true);
    } else {
      const i = HORARIOS.indexOf(slot);
      if (i > indexInicio) {
        setHoraFim(slot);
        setSelectingEnd(false);
      } else {
        setHoraInicio(slot);
        setHoraFim("");
      }
    }
  };

  const nomeExibicao = usuarioNome?.trim() || "";
  const emailExibicao = usuarioEmail?.trim() || "";

  const adicionarParticipante = (p: ParticipanteSugestao) => {
    if (participantes.some((x) => x.id === p.id)) return;
    setParticipantes((prev) => [...prev, p]);
    setParticipantesQuery("");
    setParticipantesSugestoes([]);
    setParticipantesDropdownOpen(false);
  };
  const removerParticipante = (id: string) => {
    setParticipantes((prev) => prev.filter((x) => x.id !== id));
  };
  const sugestoesFiltradas = participantesSugestoes.filter(
    (s) => !participantes.some((p) => p.id === s.id)
  );

  return (
    <form action={formAction} className="space-y-8">
      {/* Sala e coordenadoria (compactos no topo) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="coordenadoriaId">Coordenadoria *</Label>
          <select
            id="coordenadoriaId"
            name="coordenadoriaId"
            required
            defaultValue={coordenadoriaIdPadrao}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Selecione a coordenadoria</option>
            {coordenadorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaId">Sala *</Label>
          <select
            id="salaId"
            name="salaId"
            required
            value={controlledSala ? valueSalaId ?? "" : undefined}
            defaultValue={!controlledSala ? "" : undefined}
            onChange={
              onSalaChange ? (e) => onSalaChange(e.target.value) : undefined
            }
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Selecione a sala</option>
            {salas.map((s) => {
              const partes = [s.nome];
              if (s.andar) partes.push(s.andar);
              if (s.numero) partes.push(`Sala ${s.numero}`);
              if (s.layout) partes.push(s.layout === "MOVEL" ? "Layout móvel" : "Layout fixo");
              const textoAndarLocal =
                partes.length > 1 ? ` — ${partes.slice(1).join(", ")}` : "";
              const lotacaoTexto =
                s.lotacao != null ? ` (${s.lotacao} lugares)` : "";
              return (
                <option key={s.id} value={s.id}>
                  {s.nome}
                  {textoAndarLocal}
                  {lotacaoTexto}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* DATA + TEMPO */}
      <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
        <h2 className="text-lg font-semibold capitalize">
          {tituloData || "Selecione a data"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-8">
          {/* DATA */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Data
              </span>
            </div>
            <Calendar
              mode="single"
              selected={dataDate || undefined}
              onSelect={(d) => {
                if (d) onDataChange?.(format(d, "yyyy-MM-dd"));
              }}
              disabled={(date) => date < hoje}
              locale={ptBR}
            />
          </div>
          {/* TEMPO */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Tempo
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {HORARIOS.map((slot) => {
                const isInicio = slot === horaInicio;
                const isFim = slot === horaFim;
                const disabled =
                  horariosDesabilitados !== null &&
                  horariosDesabilitados(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSlotClick(slot)}
                    disabled={disabled}
                    className={cn(
                      "h-9 rounded-md border text-sm font-medium transition-colors",
                      isInicio &&
                        "bg-primary text-primary-foreground border-primary",
                      isFim &&
                        !isInicio &&
                        "bg-primary/80 text-primary-foreground border-primary",
                      !isInicio &&
                        !isFim &&
                        !disabled &&
                        "border-input hover:bg-accent hover:text-accent-foreground",
                      disabled && "opacity-50 cursor-not-allowed border-input"
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="size-3.5" />
              Todos os horários estão em (UTC-03:00) Brasília
            </p>
          </div>
        </div>
      </div>

      {/* Campos ocultos de data e horário para o form */}
      <input type="hidden" name="data" value={valueData ?? ""} />
      <input type="hidden" name="horaInicio" value={horaInicio} />
      <input type="hidden" name="horaFim" value={horaFim} />
      {participantes.map((p) => (
        <input key={p.id} type="hidden" name="participantesIds" value={p.id} />
      ))}

      {/* ADICIONAR SEUS DETALHES */}
      <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="size-4" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Adicionar seus detalhes
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Primeiro e sobrenome *</Label>
              <div
                className="flex h-9 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-1 text-sm text-muted-foreground"
                aria-readonly="true"
              >
                {nomeExibicao || "—"}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <div
                className="flex h-9 w-full items-center rounded-md border border-input bg-muted/50 px-3 py-1 text-sm text-muted-foreground"
                aria-readonly="true"
              >
                {emailExibicao || "—"}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="titulo">Título da reunião *</Label>
              <Input
                id="titulo"
                name="titulo"
                required
                placeholder="Ex: Reunião de planejamento"
              />
            </div>
            <div className="space-y-2" ref={participantesDropdownRef}>
              <Label htmlFor="participantes-input">Participantes</Label>
              <div className="relative">
                <Input
                  id="participantes-input"
                  type="text"
                  placeholder="Digite para buscar usuários..."
                  value={participantesQuery}
                  onChange={(e) => {
                    setParticipantesQuery(e.target.value);
                    setParticipantesDropdownOpen(true);
                  }}
                  onFocus={() => participantesQuery.length >= 2 && setParticipantesDropdownOpen(true)}
                  className="pr-3"
                />
                {participantesDropdownOpen && (participantesQuery.length >= 2 || sugestoesFiltradas.length > 0) && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md max-h-[220px] overflow-auto">
                    {participantesLoading ? (
                      <p className="px-3 py-2 text-sm text-muted-foreground">Buscando...</p>
                    ) : sugestoesFiltradas.length === 0 ? (
                      <p className="px-3 py-2 text-sm text-muted-foreground">
                        {participantesQuery.length < 2 ? "Digite ao menos 2 caracteres" : "Nenhum usuário encontrado"}
                      </p>
                    ) : (
                      <ul className="py-1">
                        {sugestoesFiltradas.map((u) => (
                          <li key={u.id}>
                            <button
                              type="button"
                              className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex flex-col gap-0.5"
                              onClick={() => adicionarParticipante(u)}
                            >
                              <span className="font-medium">{u.nome}</span>
                              <span className="text-xs text-muted-foreground truncate">{u.email}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              {participantes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {participantes.map((p) => (
                    <Badge key={p.id} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                      <span className="truncate max-w-[140px]">{p.nome}</span>
                      <button
                        type="button"
                        onClick={() => removerParticipante(p.id)}
                        className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                        aria-label={`Remover ${p.nome}`}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="solicitacoes">Solicitações especiais</Label>
            <textarea
              id="solicitacoes"
              name="solicitacoes"
              placeholder="Adicionar solicitações especiais"
              rows={5}
              className={cn(
                "flex w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
          </div>
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

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Button
          type="submit"
          disabled={isPending || !horaInicio || !horaFim || !valueData}
          size="lg"
          className="w-full sm:w-auto min-w-[180px]"
        >
          {isPending ? "Reservando..." : "Reservar"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard">Voltar</Link>
        </Button>
      </div>
    </form>
  );
}
