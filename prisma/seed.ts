import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
  allowPublicKeyRetrieval: true,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.usuario.upsert({
    where: { login: "x577989" },
    update: {
      email: "fmmarquessantos@prefeitura.sp.gov.br",
      permissao: "DEV",
      nome: "x577989",
    },
    create: {
      login: "x577989",
      nome: "x577989",
      email: "fmmarquessantos@prefeitura.sp.gov.br",
      permissao: "DEV",
    },
  });
  await prisma.usuario.upsert({
    where: { login: "x577988" },
    update: {
      email: "outro@prefeitura.sp.gov.br",
      permissao: "USR",
      nome: "x577988",
    },
    create: {
      login: "x577988",
      nome: "x577988",
      email: "outro@prefeitura.sp.gov.br",
      permissao: "USR",
    },
  });
  console.log("Seed: usuário x577988 (DEV) criado/atualizado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
