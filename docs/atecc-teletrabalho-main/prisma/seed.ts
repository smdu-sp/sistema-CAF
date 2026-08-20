import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { UNIDADES_INICIAIS, CARGO_CONFIGS_INICIAIS, USUARIOS_PADRAO } from "../src/constants";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log("Banco já possui dados, seed ignorado.");
    return;
  }

  await prisma.unidade.createMany({ data: UNIDADES_INICIAIS });

  await prisma.user.createMany({
    data: USUARIOS_PADRAO.map((u) => ({
      id: u.id,
      rf: u.rf,
      nomeCompleto: u.nomeCompleto,
      unidadeId: u.unidadeId,
      cargo: u.cargo,
      grupoTeletrabalho: u.grupoTeletrabalho ?? null,
      role: u.role ?? "user",
    })),
  });

  for (const cc of CARGO_CONFIGS_INICIAIS) {
    await prisma.cargoConfig.create({
      data: {
        id: cc.id,
        atividades: {
          create: cc.atividades.map((a) => ({
            id: a.id,
            categoria: a.categoria,
            descricao: a.descricao,
            pontuacao: a.pontuacao,
          })),
        },
      },
    });
  }

  console.log("Seed concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
