"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

type Usuario = { id: string; nome: string; login: string };
type Unidade = { id: string; codigoEh: string; nome: string; prefixoEh: string };
type Vinculo = {
  usuarioId: string;
  unidadeId: string;
  papel: "usuario" | "administrador" | "dgp";
  usuario: Usuario;
  unidade: Unidade;
};

const PAPEIS = [
  { valor: "usuario", label: "Usuário (imprime na unidade)" },
  { valor: "administrador", label: "Administrador da unidade" },
  { valor: "dgp", label: "DGP (todas as unidades)" },
] as const;

export default function PermissoesContent() {
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [unidadeId, setUnidadeId] = useState("");
  const [papel, setPapel] = useState<"usuario" | "administrador" | "dgp">("usuario");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await fetch("/api/gestao-pessoas/permissoes");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Erro ao carregar");
      }
      const data = await res.json();
      setVinculos(data.vinculos ?? []);
      setUsuarios(data.usuarios ?? []);
      setUnidades(data.unidades ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!usuarioId || !unidadeId) {
      toast.error("Selecione usuário e unidade.");
      return;
    }
    setSalvando(true);
    try {
      const res = await fetch("/api/gestao-pessoas/permissoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, unidadeId, papel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha ao salvar");
      toast.success("Permissão vinculada.");
      setUsuarioId("");
      setUnidadeId("");
      await carregar();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setSalvando(false);
    }
  }

  async function remover(usuarioId: string, unidadeId: string) {
    const res = await fetch(
      `/api/gestao-pessoas/permissoes?usuarioId=${usuarioId}&unidadeId=${unidadeId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      toast.success("Vínculo removido.");
      await carregar();
    } else {
      toast.error("Não foi possível remover.");
    }
  }

  if (carregando) {
    return (
      <div className="p-8 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Carregando...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 max-w-4xl">
      <form onSubmit={adicionar} className="border rounded-lg p-6 space-y-4">
        <h2 className="font-medium flex items-center gap-2">
          <UserPlus className="size-4" />
          Vincular usuário a unidade
        </h2>
        <p className="text-sm text-muted-foreground">
          Cada usuário pode ter permissão em uma ou mais unidades (código EH).
          O papel DGP permite imprimir folhas de todas as unidades.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <Label>Usuário do sistema</Label>
            <Select value={usuarioId} onValueChange={setUsuarioId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {usuarios.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.nome} ({u.login})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Unidade (EH)</Label>
            <Select value={unidadeId} onValueChange={setUnidadeId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {unidades.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.codigoEh} — {u.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Papel</Label>
            <Select value={papel} onValueChange={(v) => setPapel(v as typeof papel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAPEIS.map((p) => (
                  <SelectItem key={p.valor} value={p.valor}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" disabled={salvando}>
          {salvando ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
          Adicionar
        </Button>
      </form>

      <div>
        <h2 className="font-medium mb-3">Vínculos ativos</h2>
        {vinculos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum vínculo cadastrado. Importe uma carga SIGPEG para popular as
            unidades.
          </p>
        ) : (
          <ul className="divide-y border rounded-lg">
            {vinculos.map((v) => (
              <li
                key={`${v.usuarioId}-${v.unidadeId}`}
                className="p-3 flex items-center justify-between gap-4 text-sm"
              >
                <div>
                  <p className="font-medium">{v.usuario.nome}</p>
                  <p className="text-muted-foreground">
                    {v.unidade.codigoEh} — {v.unidade.nome}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase bg-muted px-2 py-1 rounded">
                    {v.papel}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => remover(v.usuarioId, v.unidadeId)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
