"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

type Carga = {
  id: string;
  mes: number;
  ano: number;
  totalRegistros: number;
  importadoEm: string;
  importadoPor: { nome: string; login: string } | null;
};

const MESES = Array.from({ length: 12 }, (_, i) => ({
  valor: String(i + 1),
  label: new Date(2000, i, 1).toLocaleString("pt-BR", { month: "long" }),
}));

export default function ImportacaoContent() {
  const agora = new Date();
  const [mes, setMes] = useState(String(agora.getMonth() + 1));
  const [ano, setAno] = useState(String(agora.getFullYear()));
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [cargas, setCargas] = useState<Carga[]>([]);

  const listarCargas = useCallback(async () => {
    const res = await fetch("/api/gestao-pessoas/cargas");
    if (res.ok) {
      const data = await res.json();
      setCargas(data.cargas ?? []);
    }
  }, []);

  useEffect(() => {
    listarCargas();
  }, [listarCargas]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo) {
      toast.error("Selecione o arquivo SIGPEG.");
      return;
    }
    setEnviando(true);
    try {
      const form = new FormData();
      form.append("arquivo", arquivo);
      form.append("mes", mes);
      form.append("ano", ano);
      const res = await fetch("/api/gestao-pessoas/importacao", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha na importação");
      toast.success(
        `Importados ${data.totalRegistros} registros para ${String(data.mes).padStart(2, "0")}/${data.ano}.`
      );
      setArquivo(null);
      await listarCargas();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro na importação");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="p-4 space-y-8 max-w-2xl">
      <form onSubmit={enviar} className="space-y-4 border rounded-lg p-6">
        <h2 className="font-medium">Nova carga SIGPEG</h2>
        <p className="text-sm text-muted-foreground">
          Arquivo texto separado por ponto e vírgula (;), como o exportado
          mensalmente pelo SIGPEG.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Mês de referência</Label>
            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger>
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
            <Label>Ano</Label>
            <Input
              type="number"
              min={2000}
              max={2100}
              value={ano}
              onChange={(e) => setAno(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label>Arquivo</Label>
          <Input
            type="file"
            accept=".txt,.csv"
            onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
          />
        </div>

        <Button type="submit" disabled={enviando}>
          {enviando ? (
            <Loader2 className="size-4 animate-spin mr-2" />
          ) : (
            <Upload className="size-4 mr-2" />
          )}
          Importar
        </Button>
      </form>

      <div>
        <h2 className="font-medium mb-3">Cargas realizadas</h2>
        {cargas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma carga importada.</p>
        ) : (
          <ul className="divide-y border rounded-lg">
            {cargas.map((c) => (
              <li key={c.id} className="p-3 text-sm flex justify-between">
                <span>
                  {String(c.mes).padStart(2, "0")}/{c.ano} — {c.totalRegistros}{" "}
                  registros
                </span>
                <span className="text-muted-foreground">
                  {c.importadoPor?.nome ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
