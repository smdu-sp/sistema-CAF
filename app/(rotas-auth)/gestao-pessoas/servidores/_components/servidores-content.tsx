"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Printer } from "lucide-react";

type Servidor = {
  rf: string;
  nome: string;
  vinculo?: string | null;
  codigoEh?: string;
  nomeUnidade?: string;
  unidadeEh?: string | null;
  nomeUnidadeCadastro?: string;
};

export default function ServidoresContent() {
  const agora = new Date();
  const [mes, setMes] = useState(String(agora.getMonth() + 1));
  const [ano, setAno] = useState(String(agora.getFullYear()));
  const [busca, setBusca] = useState("");
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [carregando, setCarregando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await fetch(
        `/api/gestao-pessoas/servidores?mes=${mes}&ano=${ano}`
      );
      if (res.ok) {
        const data = await res.json();
        setServidores(data.servidores ?? []);
      }
    } finally {
      setCarregando(false);
    }
  }, [mes, ano]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtrados = servidores.filter((s) => {
    const q = busca.toLowerCase();
    return (
      s.nome.toLowerCase().includes(q) ||
      s.rf.includes(q) ||
      (s.nomeUnidade ?? s.nomeUnidadeCadastro ?? "").toLowerCase().includes(q)
    );
  });

  function imprimirIndividual(rf: string) {
    window.open(
      `/api/gestao-pessoas/folha-ponto/pdf?mes=${mes}&ano=${ano}&rf=${rf}`,
      "_blank"
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <label className="text-sm font-medium">Mês</label>
          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {String(i + 1).padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Ano</label>
          <Input
            className="w-[100px]"
            type="number"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
          />
        </div>
        <div className="space-y-1 flex-1 min-w-[200px]">
          <label className="text-sm font-medium">Buscar</label>
          <Input
            placeholder="Nome, RF ou unidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={carregar} disabled={carregando}>
          {carregando ? <Loader2 className="size-4 animate-spin" /> : "Atualizar"}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtrados.length} servidor(es)
      </p>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-2">RF</th>
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Unidade (EH)</th>
              <th className="p-2 w-24">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((s) => (
              <tr key={`${s.rf}-${s.codigoEh ?? s.unidadeEh}`} className="border-t">
                <td className="p-2 font-mono">{s.rf}</td>
                <td className="p-2">{s.nome}</td>
                <td className="p-2 text-muted-foreground">
                  <div>{s.codigoEh ?? s.unidadeEh}</div>
                  <div className="text-xs">
                    {s.nomeUnidade ?? s.nomeUnidadeCadastro}
                  </div>
                </td>
                <td className="p-2 text-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Imprimir FFI"
                    onClick={() => imprimirIndividual(s.rf)}
                  >
                    <Printer className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
