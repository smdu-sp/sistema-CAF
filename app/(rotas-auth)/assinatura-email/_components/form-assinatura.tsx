"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewAssinatura } from "./view-assinatura";
import * as htmlToImage from "html-to-image";
import { Copy, Download } from "lucide-react";
import { DatePickerAniversario } from "./date-picker-aniversario";
import {
  AE_ANDARES,
  AE_ENDERECO_BASE,
  AE_ENDERECO_CIDADE,
  AE_SECRETARIA,
  AE_SITE,
} from "@/lib/assinatura-email/constants";

type CatalogoItem = { id: string; nome: string };

export type DadosIniciaisAssinatura = {
  nome: string;
  email: string;
  cargo: string;
  setorId: string;
  andar: string;
  aniversario: string;
  ramal: string;
};

function mascararTelefone(value: string) {
  if (!value) return "";
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10) digits = digits.substring(0, 10);
  digits = digits.replace(/(\d{2})(\d)/, "($1) $2");
  digits = digits.replace(/(\d)(\d{4})$/, "$1-$2");
  return digits;
}

function nomeCurto(fullName: string | undefined) {
  if (!fullName) return "";
  if (fullName.length >= 30) {
    const parts = fullName.split(" ");
    return `${parts[0]} ${parts[parts.length - 1]}`;
  }
  return fullName;
}

interface FormAssinaturaProps {
  className?: string;
  inicial: DadosIniciaisAssinatura;
  setores: CatalogoItem[];
  cargos: CatalogoItem[];
}

export function FormAssinatura({ className, inicial, setores, cargos }: FormAssinaturaProps) {
  const [nome, setNome] = useState(nomeCurto(inicial.nome));
  const [cargo, setCargo] = useState(inicial.cargo);
  const [unidade, setUnidade] = useState(inicial.setorId);
  const [email] = useState(inicial.email);
  const [andar, setAndar] = useState(inicial.andar);
  const [nascimento, setNascimento] = useState(inicial.aniversario);
  const [ramal, setRamal] = useState(mascararTelefone(inicial.ramal));
  const displaySignatureRef = useRef<HTMLDivElement>(null);
  const copySignatureRef = useRef<HTMLDivElement>(null);

  const endereco = `${AE_ENDERECO_BASE} | ${andar}º andar`;

  async function gerarImagemAssinatura(): Promise<string | null> {
    if (!displaySignatureRef.current) {
      toast.error("Erro ao gerar imagem da assinatura.");
      return null;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return await htmlToImage.toPng(displaySignatureRef.current);
    } catch {
      toast.error("Erro ao gerar imagem da assinatura.");
      return null;
    }
  }

  async function salvarDados() {
    const response = await fetch("/api/assinatura-email/proprio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nomeExibicao: nome,
        setorId: unidade,
        cargo,
        aniversario: nascimento,
        andar,
        ramal,
      }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error || "Erro ao salvar dados");
      return false;
    }
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const actionType = submitter?.name;

    if (!nome || !email || !cargo || !unidade || !andar || !ramal) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const ok = await salvarDados();
    if (!ok) return;

    if (actionType === "download") {
      const dataUrl = await gerarImagemAssinatura();
      if (!dataUrl) return;
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "assinatura_email.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Assinatura baixada com sucesso!");
    } else if (actionType === "copy") {
      copiarAssinatura();
    }
  }

  function copiarAssinatura() {
    const divToCopy = copySignatureRef.current;
    if (!divToCopy) {
      toast.error("Não foi possível copiar a assinatura. Tente novamente.");
      return;
    }
    try {
      const range = document.createRange();
      range.selectNode(divToCopy);
      const selection = window.getSelection();
      if (!selection) {
        toast.error("Erro ao acessar a seleção do navegador.");
        return;
      }
      selection.removeAllRanges();
      selection.addRange(range);
      const success = document.execCommand("copy");
      selection.removeAllRanges();
      if (success) toast.success("Assinatura copiada com sucesso!");
      else toast.error("Falha ao copiar a assinatura.");
    } catch {
      toast.error("Ocorreu um erro inesperado ao copiar a assinatura.");
    }
  }

  const nomeUnidade = setores.find((setor) => setor.id === unidade)?.nome || "";

  return (
    <div className={cn("flex flex-col gap-6 w-full mx-auto", className)}>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <ViewAssinatura
          nome={nome}
          cargo={cargo}
          unidade={nomeUnidade}
          secretaria={AE_SECRETARIA}
          email={email}
          endereco={endereco}
          endereco2={AE_ENDERECO_CIDADE}
          andar={andar}
          site={AE_SITE}
          ramal={ramal}
          mode="display"
          ref={displaySignatureRef}
        />
      </div>

      <ViewAssinatura
        nome={nome}
        cargo={cargo}
        unidade={nomeUnidade}
        secretaria={AE_SECRETARIA}
        email={email}
        endereco={endereco}
        endereco2={AE_ENDERECO_CIDADE}
        andar={andar}
        site={AE_SITE}
        ramal={ramal}
        mode="copy"
        ref={copySignatureRef}
      />

      <form className="w-full" onSubmit={handleSubmit}>
        <p className="text-sm text-muted-foreground">Os campos marcados com * são obrigatórios.</p>
        <div className="grid grid-cols-6 gap-4 mt-4">
          <div className="grid col-span-6 md:col-span-3 gap-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              className="bg-background"
              id="nome"
              type="text"
              name="nome"
              placeholder="Nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="grid col-span-6 md:col-span-3 gap-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              disabled
              className="bg-background"
              id="email"
              placeholder="example@example.com"
              type="email"
              name="email"
              required
              value={email}
            />
          </div>
          <div className="grid col-span-6 md:col-span-2 gap-2">
            <Label htmlFor="unidade">Unidade *</Label>
            <Select required name="unidade" value={unidade || undefined} onValueChange={setUnidade}>
              <SelectTrigger className="w-full bg-background min-w-0">
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent side="bottom" className="max-w-[500px]">
                {setores.map((setor) => (
                  <SelectItem key={setor.id} value={setor.id}>
                    {setor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid col-span-6 md:col-span-2 gap-2">
            <Label htmlFor="cargo">Cargo *</Label>
            <Select required name="cargo" value={cargo || undefined} onValueChange={setCargo}>
              <SelectTrigger className="w-full bg-background min-w-0">
                <SelectValue placeholder="Selecione o cargo" />
              </SelectTrigger>
              <SelectContent side="bottom" className="max-w-[500px]">
                {cargos.map((item) => (
                  <SelectItem key={item.id} value={item.nome}>
                    {item.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid col-span-6 md:col-span-2 gap-2">
            <Label htmlFor="andar">Andar *</Label>
            <Select required name="andar" value={andar || undefined} onValueChange={setAndar}>
              <SelectTrigger className="w-full bg-background min-w-0">
                <SelectValue placeholder="Selecione o andar" />
              </SelectTrigger>
              <SelectContent side="bottom" className="max-w-[500px]">
                {AE_ANDARES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid col-span-6 md:col-span-3 gap-2">
            <Label htmlFor="ramal">Ramal de Grupo *</Label>
            <Input
              className="bg-background"
              id="ramal"
              placeholder="(11) 99999-9999"
              type="text"
              name="ramal"
              value={ramal}
              onChange={(e) => setRamal(mascararTelefone(e.target.value))}
            />
          </div>
          <div className="grid col-span-6 md:col-span-3 gap-2">
            <Label htmlFor="nascimento">Aniversário</Label>
            <DatePickerAniversario value={nascimento} onChange={(val) => setNascimento(val || "")} />
          </div>
          <div className="grid col-span-6 md:col-span-3 mt-4">
            <Button type="submit" name="download">
              <Download className="mr-2 h-4 w-4" />
              Baixar Assinatura
            </Button>
          </div>
          <div className="grid col-span-6 md:col-span-3 mt-4">
            <Button type="submit" name="copy">
              <Copy className="mr-2 h-4 w-4" />
              Copiar Assinatura
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
