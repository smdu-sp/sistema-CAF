"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cancelarReserva } from "@/app/(rotas-auth)/reservas/actions";
import { toast } from "sonner";
import { SalaAdmin, ReservaAdmin } from "../types";

const HORA_INICIO = 9;
const HORA_FIM = 19;
const MINUTOS_TOTAL = (HORA_FIM - HORA_INICIO) * 60;

function minutosDesdeNoveHoras(d: Date): number {
  const h = d.getHours();
  const min = d.getMinutes();
  return (h - HORA_INICIO) * 60 + min;
}

function dataParaInput(d: Date): string {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export function AgendaAdmin() {
  const [data, setData] = useState<Date>(new Date());
  const [salas, setSalas] = useState<SalaAdmin[]>([]);
  const [reservas, setReservas] = useState<ReservaAdmin[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);
  const [reservaParaCancelar, setReservaParaCancelar] = useState<{
    id: string;
    titulo: string;
  } | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [salaIdFiltro, setSalaIdFiltro] = useState("");

  const dataStr = dataParaInput(data);

  const carregar = useCallback(() => {
    setLoading(true);
    fetch(`/api/reservas/admin?data=${dataStr}`)
      .then((r) => r.json())
      .then((body) => {
        setSalas(body.salas ?? []);
        setReservas(body.reservas ?? []);
      })
      .catch(() => {
        setSalas([]);
        setReservas([]);
      })
      .finally(() => setLoading(false));
  }, [dataStr]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function abrirModalCancelar(r: { id: string; titulo: string | null }) {
    setReservaParaCancelar({ id: r.id, titulo: r.titulo ?? "Sem título" });
    setMotivoCancelamento("");
  }

  function fecharModalCancelar() {
    setReservaParaCancelar(null);
    setMotivoCancelamento("");
  }

  async function confirmarCancelamento() {
    if (!reservaParaCancelar) return;
    setCancelandoId(reservaParaCancelar.id);
    const result = await cancelarReserva(
      reservaParaCancelar.id,
      motivoCancelamento.trim() || undefined
    );
    setCancelandoId(null);
    fecharModalCancelar();
    if (result.erro) {
      toast.error("Erro ao cancelar", { description: result.erro });
    } else {
      toast.success("Reserva cancelada.");
      carregar();
    }
  }

  const reservasPorSalaFiltradas = salas
    .filter((sala) => !salaIdFiltro || sala.id === salaIdFiltro)
    .map((sala) => ({
      sala,
      reservas: reservas
        .filter((r) => r.salaId === sala.id)
        .map((r) => {
        const inicio = new Date(r.inicio);
        const fim = new Date(r.fim);
        const topMin = Math.max(0, minutosDesdeNoveHoras(inicio));
        const fimMin = Math.min(MINUTOS_TOTAL, minutosDesdeNoveHoras(fim));
        const duracaoMin = Math.max(0, fimMin - topMin);
        const topPct = (topMin / MINUTOS_TOTAL) * 100;
        const heightPct = (duracaoMin / MINUTOS_TOTAL) * 100;
          return { ...r, topPct, heightPct };
        }),
    }));

  const horas: number[] = [];
  for (let h = HORA_INICIO; h < HORA_FIM; h++) horas.push(h);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Data</label>
          <Calendar
            mode="single"
            selected={data}
            onSelect={(d) => d && setData(d)}
          />
        </div>
        <div className="min-w-[200px]">
          <label className="text-sm font-medium mb-1 block">Sala</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={salaIdFiltro}
            onChange={(e) => setSalaIdFiltro(e.target.value)}
          >
            <option value="">Todas as salas</option>
            {salas.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
                {(s.andar || s.numero) &&
                  ` — ${[s.andar, s.numero ? `Sala ${s.numero}` : null].filter(Boolean).join(", ")}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando agenda...</p>
      ) : (
        <div className="space-y-8">
          {reservasPorSalaFiltradas.map(({ sala, reservas: reservasSala }) => (
            <div
              key={sala.id}
              className="rounded-lg border bg-card overflow-hidden"
            >
              <div className="px-4 py-2 border-b bg-muted/40">
                <h3 className="font-semibold text-sm">{sala.nome}</h3>
                {(sala.andar || sala.numero) && (
                  <p className="text-xs text-muted-foreground">
                    {[sala.andar, sala.numero ? `Sala ${sala.numero}` : null].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <div
                className="flex relative"
                style={{ height: `${MINUTOS_TOTAL}px` }}
              >
                <div className="w-12 shrink-0 flex flex-col border-r text-right pr-2 py-1 text-xs text-muted-foreground">
                  {horas.map((h) => (
                    <div
                      key={h}
                      className="flex items-start justify-end"
                      style={{ height: "60px" }}
                    >
                      {h.toString().padStart(2, "0")}:00
                    </div>
                  ))}
                </div>
                <div className="flex-1 relative overflow-hidden h-full border-l border-border/60">
                  {horas.slice(0, -1).map((h) => (
                    <div
                      key={h}
                      className="absolute left-0 right-0 border-t border-border/60"
                      style={{
                        top: `${((h - HORA_INICIO) * 60 / MINUTOS_TOTAL) * 100}%`,
                        height: `${(60 / MINUTOS_TOTAL) * 100}%`,
                      }}
                    />
                  ))}
                  {reservasSala.map((r) => (
                    <div
                      key={r.id}
                      className="absolute left-1 right-1 rounded-md overflow-hidden border border-border/80 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                      style={{
                        top: `${r.topPct}%`,
                        height: `${r.heightPct}%`,
                        minHeight: "44px",
                      }}
                    >
                      <div className="h-full w-full p-2 flex flex-col justify-between text-left overflow-hidden">
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate text-foreground">
                            {r.titulo ?? "Sem título"}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {r.usuarioNome ?? r.usuarioLogin}
                            {r.coordenadoriaNome ? ` · ${r.coordenadoriaNome}` : ""}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="mt-1 h-7 text-xs w-fit"
                          disabled={cancelandoId === r.id}
                          onClick={() => abrirModalCancelar(r)}
                        >
                          {cancelandoId === r.id ? "Cancelando..." : "Cancelar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {salas.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">
              Nenhuma sala cadastrada.
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Horário do prédio: 9h às 19h
      </p>

      <Dialog open={!!reservaParaCancelar} onOpenChange={(open) => !open && fecharModalCancelar()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar reserva</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar a reserva &quot;{reservaParaCancelar?.titulo}&quot;?
              Informe o motivo do cancelamento (opcional).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="motivo-cancelamento">Motivo do cancelamento</Label>
            <textarea
              id="motivo-cancelamento"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Ex: Reunião remarcada, sala em manutenção..."
              value={motivoCancelamento}
              onChange={(e) => setMotivoCancelamento(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={fecharModalCancelar}>
              Voltar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={cancelandoId === reservaParaCancelar?.id}
              onClick={confirmarCancelamento}
            >
              {cancelandoId === reservaParaCancelar?.id ? "Cancelando..." : "Confirmar cancelamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
