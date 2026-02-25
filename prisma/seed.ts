import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.upsert({
    where: { login: "d854440" },
    update: {
      email: "blvieira@prefeitura.sp.gov.br",
      permissao: "DEV",
      nome: "d854440",
    },
    create: {
      login: "d854440",
      nome: "d854440",
      email: "blvieira@prefeitura.sp.gov.br",
      permissao: "DEV",
    },
  });
  console.log("Seed: usuário d854440 (DEV) criado/atualizado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
