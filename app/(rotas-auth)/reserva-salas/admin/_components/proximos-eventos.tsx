"use client";

import { useCallback, useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cancelarReserva } from "@/app/(rotas-auth)/reservas/actions";
import { toast } from "sonner";
import { ReservaAdmin } from "../../types";

const LIMITE_PROXIMOS = 4;

export function ProximosEventos() {
  const [proximos, setProximos] = useState<ReservaAdmin[]>([]);
  const [totalProximos, setTotalProximos] = useState(0);
  const [paginaProximos, setPaginaProximos] = useState(1);
  const [loadingProximos, setLoadingProximos] = useState(false);
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);
  const [reservaParaCancelar, setReservaParaCancelar] = useState<{
    id: string;
    titulo: string;
  } | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState("");

  const totalPaginasProximos = Math.max(1, Math.ceil(totalProximos / LIMITE_PROXIMOS));

  const carregarProximos = useCallback(() => {
    setLoadingProximos(true);
    fetch(
      `/api/reservas/proximos?pagina=${paginaProximos}&limite=${LIMITE_PROXIMOS}`
    )
      .then((r) => r.json())
      .then((body) => {
        setProximos(body.data ?? []);
        setTotalProximos(body.total ?? 0);
      })
      .catch(() => {
        setProximos([]);
        setTotalProximos(0);
      })
      .finally(() => setLoadingProximos(false));
  }, [paginaProximos]);

  useEffect(() => {
    carregarProximos();
  }, [carregarProximos]);

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
      carregarProximos();
    }
  }

  return (
    <>
      <section className="rounded-lg border bg-card overflow-hidden">
        {loadingProximos ? (
          <p className="text-sm text-muted-foreground p-4">
            Carregando...
          </p>
        ) : proximos.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4">
            Nenhuma reserva futura.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-white text-xs">Sala</TableHead>
                  <TableHead className="text-white text-xs">Título</TableHead>
                  <TableHead className="text-white text-xs">Responsável</TableHead>
                  <TableHead className="text-white text-xs">Início</TableHead>
                  <TableHead className="text-white text-xs">Fim</TableHead>
                  <TableHead className="text-white text-xs text-center w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proximos.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-xs">{r.salaNome}</TableCell>
                    <TableCell className="text-xs">
                      {r.titulo ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs">
                      {r.usuarioNome ?? r.usuarioLogin}
                      {r.coordenadoriaNome ? ` · ${r.coordenadoriaNome}` : ""}
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(r.inicio).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(r.fim).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-xs text-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs"
                        disabled={cancelandoId === r.id}
                        onClick={() => abrirModalCancelar(r)}
                      >
                        {cancelandoId === r.id ? "..." : "Cancelar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between gap-2 px-4 py-2 border-t bg-muted/30 text-sm">
              <span className="text-muted-foreground">
                Página {paginaProximos} de {totalPaginasProximos} ({totalProximos}{" "}
                {totalProximos === 1 ? "evento" : "eventos"})
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={paginaProximos <= 1}
                  onClick={() => setPaginaProximos((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={paginaProximos >= totalPaginasProximos}
                  onClick={() =>
                    setPaginaProximos((p) =>
                      Math.min(totalPaginasProximos, p + 1)
                    )
                  }
                >
                  Próxima
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

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
    </>
  );
}