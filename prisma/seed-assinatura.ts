import type { PrismaClient } from "./generated";
import { UNIDADES_RAW } from "../lib/helpdesk/mock-dados";
import { AE_PERMISSOES } from "../lib/assinatura-email/constants";
import cargosSeed from "./data/assinatura-cargos.json";
import ramaisSeed from "./data/assinatura-ramais.json";

const PERMISSOES_AE = [
  {
    nome: AE_PERMISSOES.visualizar,
    descricao: "Acesso ao gerador de assinatura de e-mail",
  },
  {
    nome: AE_PERMISSOES.cadastros,
    descricao: "Gerenciar setores, cargos e ramais da assinatura",
  },
] as const;

export async function seedAssinaturaEmail(prisma: PrismaClient) {
  await prisma.permissao.createMany({
    data: PERMISSOES_AE.map((p) => ({
      nome: p.nome,
      modulo: "assinatura_email" as const,
      descricao: p.descricao,
    })),
    skipDuplicates: true,
  });

  const setores = [...UNIDADES_RAW];
  for (const nome of setores) {
    await prisma.assinaturaSetor.upsert({
      where: { nome },
      update: {},
      create: { nome, ativo: true },
    });
  }

  const cargos = Array.isArray(cargosSeed)
    ? cargosSeed
        .map((c) => (typeof c === "object" && c && "nome" in c ? String(c.nome).trim() : ""))
        .filter(Boolean)
    : [];
  if (cargos.length > 0) {
    await prisma.assinaturaCargo.createMany({
      data: cargos.map((nome) => ({ nome, ativo: true })),
      skipDuplicates: true,
    });
  }

  const ramais = Array.isArray(ramaisSeed)
    ? ramaisSeed
        .map((r) => {
          if (!r || typeof r !== "object") return null;
          const usuario = "usuario" in r ? String(r.usuario).trim() : "";
          const ramalGrupo = "ramalGrupo" in r ? String(r.ramalGrupo).trim() : "";
          if (!usuario || !ramalGrupo) return null;
          return { usuario, ramalGrupo };
        })
        .filter((r): r is { usuario: string; ramalGrupo: string } => r !== null)
    : [];

  const ramaisUnicos = new Map<string, string>();
  for (const r of ramais) {
    ramaisUnicos.set(r.usuario.toLowerCase(), r.ramalGrupo);
  }
  if (ramaisUnicos.size > 0) {
    await prisma.assinaturaGrupoRamal.createMany({
      data: [...ramaisUnicos.entries()].map(([usuario, ramalGrupo]) => ({
        usuario,
        ramalGrupo,
      })),
      skipDuplicates: true,
    });
  }

  console.log(
    `Seed assinatura: ${setores.length} setores, ${cargos.length} cargos, ${ramaisUnicos.size} ramais.`,
  );
}
