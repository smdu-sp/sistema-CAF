import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

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
