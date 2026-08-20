import type { PrismaClient } from "./generated";
import { CATALOGO_ATECC } from "../lib/teletrabalho/catalogo-atecc";
import { TT_PERMISSOES } from "../lib/teletrabalho/constants";
import { obterFeriadosDoAno } from "../lib/gestao-pessoas/feriados";

const PERMISSOES_TT = [
  { nome: TT_PERMISSOES.visualizar, descricao: "Acesso ao módulo de teletrabalho" },
  { nome: TT_PERMISSOES.cadastros, descricao: "Gerenciar cadastros do teletrabalho" },
  { nome: TT_PERMISSOES.registro, descricao: "Criar e enviar registro diário" },
  { nome: TT_PERMISSOES.validar, descricao: "Validar ou devolver registros da equipe" },
  { nome: TT_PERMISSOES.fechamento, descricao: "Executar fechamento mensal" },
  { nome: TT_PERMISSOES.relatorios, descricao: "Emitir relatórios mensais" },
  { nome: TT_PERMISSOES.adesoes, descricao: "Gerenciar termos de adesão e desligamento" },
  { nome: TT_PERMISSOES.escala, descricao: "Gerenciar regime e escala" },
] as const;

function tipoFeriado(nome: string): "nacional" | "municipal" | "ponto_facultativo" {
  const n = nome.toLowerCase();
  if (n.includes("aniversário") || n.includes("consciencia") || n.includes("consciência")) {
    return "municipal";
  }
  return "nacional";
}

const NOMES_FERIADOS: Record<string, string> = {
  "01-01": "Confraternização Universal",
  "04-21": "Tiradentes",
  "05-01": "Dia do Trabalho",
  "09-07": "Independência do Brasil",
  "10-12": "Nossa Senhora Aparecida",
  "11-02": "Finados",
  "11-15": "Proclamação da República",
  "11-20": "Consciência Negra",
  "12-25": "Natal",
};

function nomeFeriado(data: Date): string {
  const chave = `${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
  if (NOMES_FERIADOS[chave]) return NOMES_FERIADOS[chave];
  return "Feriado móvel";
}

export async function seedTeletrabalho(prisma: PrismaClient) {
  await prisma.permissao.createMany({
    data: PERMISSOES_TT.map((p) => ({
      nome: p.nome,
      modulo: "teletrabalho" as const,
      descricao: p.descricao,
    })),
    skipDuplicates: true,
  });

  const ano = new Date().getFullYear();
  await prisma.ttExercicio.updateMany({ data: { corrente: false } });
  const exercicio = await prisma.ttExercicio.upsert({
    where: { ano },
    update: { corrente: true },
    create: { ano, corrente: true },
  });

  const feriados = obterFeriadosDoAno(ano);
  for (const data of feriados) {
    const utc = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()));
    await prisma.ttFeriado.upsert({
      where: { exercicioId_data: { exercicioId: exercicio.id, data: utc } },
      update: {},
      create: {
        exercicioId: exercicio.id,
        data: utc,
        nome: nomeFeriado(data),
        tipo: tipoFeriado(nomeFeriado(data)),
      },
    });
  }

  const unidade = await prisma.ttUnidade.upsert({
    where: { codigoEh: CATALOGO_ATECC.unidade.codigoEh },
    update: {
      nome: CATALOGO_ATECC.unidade.nome,
      sigla: CATALOGO_ATECC.unidade.sigla,
      ativo: true,
    },
    create: {
      nome: CATALOGO_ATECC.unidade.nome,
      sigla: CATALOGO_ATECC.unidade.sigla,
      codigoEh: CATALOGO_ATECC.unidade.codigoEh,
    },
  });

  await prisma.ttRegimeEscala.upsert({
    where: { unidadeId: unidade.id },
    update: { algoritmo: "atecc_grupos_2", diasRemotos: 2, diasPresenciais: 3, gruposRodizio: 2 },
    create: {
      unidadeId: unidade.id,
      algoritmo: "atecc_grupos_2",
      diasRemotos: 2,
      diasPresenciais: 3,
      gruposRodizio: 2,
    },
  });

  const cargosPorNome = new Map<string, string>();
  for (const cargo of CATALOGO_ATECC.cargos) {
    const salvo = await prisma.ttCargo.upsert({
      where: { unidadeId_nome: { unidadeId: unidade.id, nome: cargo.nome } },
      update: { ativo: true },
      create: { unidadeId: unidade.id, nome: cargo.nome },
    });
    cargosPorNome.set(cargo.nome, salvo.id);

    const categorias = [...new Set(cargo.atividades.map((a) => a.categoria))];
    const categoriaIds = new Map<string, string>();
    for (const [i, nome] of categorias.entries()) {
      const cat = await prisma.ttCategoriaAtividade.upsert({
        where: { unidadeId_nome: { unidadeId: unidade.id, nome } },
        update: { ordem: i, ativo: true },
        create: { unidadeId: unidade.id, nome, ordem: i },
      });
      categoriaIds.set(nome, cat.id);
    }

    for (const atividade of cargo.atividades) {
      let existente = await prisma.ttAtividade.findFirst({
        where: {
          unidadeId: unidade.id,
          descricao: atividade.descricao,
          categoriaId: categoriaIds.get(atividade.categoria),
        },
      });
      if (!existente) {
        existente = await prisma.ttAtividade.create({
          data: {
            unidadeId: unidade.id,
            categoriaId: categoriaIds.get(atividade.categoria)!,
            descricao: atividade.descricao,
          },
        });
      }

      const vinculo = await prisma.ttCargoAtividade.findFirst({
        where: {
          cargoId: salvo.id,
          atividadeId: existente.id,
          fimVigencia: null,
        },
      });
      if (!vinculo) {
        await prisma.ttCargoAtividade.create({
          data: {
            cargoId: salvo.id,
            atividadeId: existente.id,
            pontuacao: atividade.pontuacao,
            inicioVigencia: new Date(Date.UTC(ano, 0, 1)),
          },
        });
      }
    }
  }

  const inicioAdesao = new Date(Date.UTC(ano, 0, 1));
  for (const s of CATALOGO_ATECC.servidores) {
    const cargoId = cargosPorNome.get(s.cargo);
    if (!cargoId) continue;
    const servidor = await prisma.ttServidor.upsert({
      where: { rf: s.rf },
      update: { nome: s.nome, unidadeId: unidade.id, cargoId, ativo: true },
      create: {
        rf: s.rf,
        nome: s.nome,
        email: `${s.rf}@prefeitura.sp.gov.br`,
        telefoneSetor: "3397-0000",
        unidadeId: unidade.id,
        cargoId,
      },
    });
    await prisma.ttEscalaServidor.upsert({
      where: { servidorId: servidor.id },
      update: { grupo: s.grupo },
      create: {
        servidorId: servidor.id,
        grupo: s.grupo,
        janelaInicio: "09:00",
        janelaFim: "18:00",
        horarioAlmocoInicio: "12:00",
        horarioAlmocoFim: "13:00",
      },
    });
    const adesao = await prisma.ttTermoAdesao.findFirst({
      where: { servidorId: servidor.id, situacao: "vigente" },
    });
    if (!adesao) {
      await prisma.ttTermoAdesao.create({
        data: {
          servidorId: servidor.id,
          dataAssinatura: inicioAdesao,
          dataCienciaChefia: inicioAdesao,
          situacao: "vigente",
        },
      });
    }
  }

  const cargoPadrao = cargosPorNome.get("ASO, AAG e Assessor");
  const admins = await prisma.usuario.findMany({
    where: { login: { in: ["d854440", "d927014"] } },
    select: { id: true, login: true, nome: true, email: true },
  });
  for (const admin of admins) {
    if (!cargoPadrao) continue;
    const rf = admin.login.slice(0, 7);
    const servidor = await prisma.ttServidor.upsert({
      where: { rf },
      update: {
        nome: admin.nome,
        email: admin.email,
        unidadeId: unidade.id,
        cargoId: cargoPadrao,
        usuarioId: admin.id,
        ativo: true,
      },
      create: {
        rf,
        nome: admin.nome,
        email: admin.email,
        telefoneSetor: "3397-0000",
        unidadeId: unidade.id,
        cargoId: cargoPadrao,
        usuarioId: admin.id,
      },
    });
    await prisma.ttEscalaServidor.upsert({
      where: { servidorId: servidor.id },
      update: { grupo: 1 },
      create: {
        servidorId: servidor.id,
        grupo: 1,
        janelaInicio: "09:00",
        janelaFim: "18:00",
        horarioAlmocoInicio: "12:00",
        horarioAlmocoFim: "13:00",
      },
    });
    const adesao = await prisma.ttTermoAdesao.findFirst({
      where: { servidorId: servidor.id, situacao: "vigente" },
    });
    if (!adesao) {
      await prisma.ttTermoAdesao.create({
        data: {
          servidorId: servidor.id,
          dataAssinatura: inicioAdesao,
          dataCienciaChefia: inicioAdesao,
          situacao: "vigente",
        },
      });
    }
    await prisma.ttUsuarioUnidade.upsert({
      where: { usuarioId_unidadeId: { usuarioId: admin.id, unidadeId: unidade.id } },
      update: { papel: "chefia" },
      create: { usuarioId: admin.id, unidadeId: unidade.id, papel: "chefia" },
    });
  }

  console.log("Seed: módulo teletrabalho (ATECC) criado/atualizado.");
}
