"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Printer } from "lucide-react";
import { toast } from "sonner";

type UnidadeImpressao = {
  prefixoEh: string;
  codigoEh: string;
  nomeUnidade: string;
};

const MESES = [
  { valor: "1", label: "Janeiro" },
  { valor: "2", label: "Fevereiro" },
  { valor: "3", label: "Março" },
  { valor: "4", label: "Abril" },
  { valor: "5", label: "Maio" },
  { valor: "6", label: "Junho" },
  { valor: "7", label: "Julho" },
  { valor: "8", label: "Agosto" },
  { valor: "9", label: "Setembro" },
  { valor: "10", label: "Outubro" },
  { valor: "11", label: "Novembro" },
  { valor: "12", label: "Dezembro" },
];

const ANOS = Array.from({ length: 12 }, (_, i) => String(2020 + i));

export default function FolhaPontoContent() {
  const agora = new Date();
  const [mes, setMes] = useState(String(agora.getMonth() + 1));
  const [ano, setAno] = useState(String(agora.getFullYear()));
  const [unidades, setUnidades] = useState<UnidadeImpressao[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [cargaDisponivel, setCargaDisponivel] = useState<boolean | null>(null);
  const [ehDgp, setEhDgp] = useState(false);

  const carregarUnidades = useCallback(async () => {
    setCarregando(true);
    try {
      const [resAcesso, resUnidades] = await Promise.all([
        fetch("/api/gestao-pessoas/acesso"),
        fetch(`/api/gestao-pessoas/unidades-impressao?mes=${mes}&ano=${ano}`),
      ]);
      if (resAcesso.ok) {
        const acesso = await resAcesso.json();
        setEhDgp(Boolean(acesso.ehDgp));
      }
      if (!resUnidades.ok) {
        const err = await resUnidades.json();
        throw new Error(err.error ?? "Erro ao listar unidades");
      }
      const data = await resUnidades.json();
      setCargaDisponivel(data.disponivel);
      setUnidades(data.unidades ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao carregar dados");
      setUnidades([]);
      setCargaDisponivel(false);
    } finally {
      setCarregando(false);
    }
  }, [mes, ano]);

  useEffect(() => {
    carregarUnidades();
  }, [carregarUnidades]);

  function abrirPdf(prefixo?: string, rf?: string) {
    const params = new URLSearchParams({ mes, ano });
    if (prefixo) params.set("prefixo", prefixo);
    if (rf) params.set("rf", rf);
    window.open(`/api/gestao-pessoas/folha-ponto/pdf?${params}`, "_blank");
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl">
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
        Antes de imprimir, faça a carga do arquivo SIGPEG referente ao mês/ano
        selecionado.
      </p>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <label className="text-sm font-medium">Mês</label>
          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((m) => (
                <SelectItem key={m.valor} value={m.valor}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Ano</label>
          <Select value={ano} onValueChange={setAno}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ANOS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={carregarUnidades} disabled={carregando}>
          {carregando ? <Loader2 className="size-4 animate-spin" /> : "Atualizar"}
        </Button>
      </div>

      {cargaDisponivel === false && (
        <p className="text-sm text-destructive">
          Carga de {mes.padStart(2, "0")}/{ano} não encontrada. Importe o arquivo
          na aba Importação SIGPEG.
        </p>
      )}

      {ehDgp && cargaDisponivel && (
        <p className="text-sm text-muted-foreground">
          Perfil DGP: você pode imprimir folhas de todas as unidades.
        </p>
      )}

      {carregando ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Carregando unidades...
        </div>
      ) : (
        <div className="space-y-2">
          {unidades.map((u) => (
            <div
              key={u.prefixoEh}
              className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/40"
            >
              <div>
                <p className="font-medium text-sm">{u.codigoEh}</p>
                <p className="text-sm text-muted-foreground">{u.nomeUnidade}</p>
              </div>
              <Button size="sm" onClick={() => abrirPdf(u.prefixoEh)}>
                <Printer className="size-4 mr-2" />
                Imprimir unidade
              </Button>
            </div>
          ))}
          {cargaDisponivel && unidades.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma unidade disponível para seu perfil nesta competência.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
