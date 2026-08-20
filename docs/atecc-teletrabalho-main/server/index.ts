import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import path from "path";
import { fileURLToPath } from "url";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });
const app = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- helpers ---

function serializeRegistro(r: any) {
  return {
    ...r,
    atividades: r.atividades.map((a: any) => ({
      id: a.atividadeId,
      quantidade: a.quantidade,
    })),
  };
}

function serializeCargoConfig(cc: any) {
  return {
    id: cc.id,
    atividades: cc.atividades.map((a: any) => ({
      id: a.id,
      categoria: a.categoria,
      descricao: a.descricao,
      pontuacao: a.pontuacao,
    })),
  };
}

// --- registros ---

app.get("/api/registros", async (_req, res) => {
  try {
    const registros = await prisma.registro.findMany({
      include: { atividades: true },
      orderBy: { timestamp: "desc" },
    });
    res.json(registros.map(serializeRegistro));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.post("/api/registros", async (req, res) => {
  try {
    const { atividades, ...data } = req.body;
    const registro = await prisma.registro.create({
      data: {
        ...data,
        atividades: {
          create: atividades.map((a: any) => ({
            atividadeId: a.id,
            quantidade: a.quantidade,
          })),
        },
      },
      include: { atividades: true },
    });
    res.json(serializeRegistro(registro));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.delete("/api/registros/:id", async (req, res) => {
  try {
    await prisma.registro.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// --- unidades ---

app.get("/api/unidades", async (_req, res) => {
  try {
    res.json(await prisma.unidade.findMany());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.put("/api/unidades", async (req, res) => {
  try {
    await prisma.$transaction([
      prisma.unidade.deleteMany(),
      prisma.unidade.createMany({ data: req.body }),
    ]);
    res.json(await prisma.unidade.findMany());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// --- users ---

app.get("/api/users", async (_req, res) => {
  try {
    res.json(await prisma.user.findMany());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.put("/api/users", async (req, res) => {
  try {
    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.user.createMany({ data: req.body }),
    ]);
    res.json(await prisma.user.findMany());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// --- cargo configs ---

app.get("/api/cargo-configs", async (_req, res) => {
  try {
    const configs = await prisma.cargoConfig.findMany({ include: { atividades: true } });
    res.json(configs.map(serializeCargoConfig));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.put("/api/cargo-configs", async (req, res) => {
  try {
    const configs: any[] = req.body;
    await prisma.$transaction(async (tx) => {
      await tx.cargoConfig.deleteMany();
      for (const cc of configs) {
        await tx.cargoConfig.create({
          data: {
            id: cc.id,
            atividades: {
              create: cc.atividades.map((a: any) => ({
                id: a.id,
                categoria: a.categoria,
                descricao: a.descricao,
                pontuacao: a.pontuacao,
              })),
            },
          },
        });
      }
    });
    const updated = await prisma.cargoConfig.findMany({ include: { atividades: true } });
    res.json(updated.map(serializeCargoConfig));
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// --- calendar activities ---

app.get("/api/calendar-activities", async (_req, res) => {
  try {
    res.json(await prisma.calendarActivity.findMany());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.put("/api/calendar-activities", async (req, res) => {
  try {
    await prisma.$transaction([
      prisma.calendarActivity.deleteMany(),
      prisma.calendarActivity.createMany({ data: req.body }),
    ]);
    res.json(await prisma.calendarActivity.findMany());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// --- duty staff ---

app.get("/api/duty-staff", async (_req, res) => {
  try {
    res.json(await prisma.dutyStaff.findMany());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.put("/api/duty-staff", async (req, res) => {
  try {
    await prisma.$transaction([
      prisma.dutyStaff.deleteMany(),
      prisma.dutyStaff.createMany({ data: req.body }),
    ]);
    res.json(await prisma.dutyStaff.findMany());
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// serve static build in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
