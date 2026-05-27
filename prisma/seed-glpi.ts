/**
 * Importa os últimos 500 chamados do GLPI 10 para o banco local de teste.
 * Cria unidades (HdUnidade), categorias (HdCategoria), usuários (Usuario),
 * chamados (HdChamado) e mensagens/followups (HdMensagem).
 *
 * Uso: npx tsx prisma/seed-glpi.ts
 */
import "dotenv/config";
import mariadb from "mariadb";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated";

// ─── Local DB ─────────────────────────────────────────────────────────────────
// Usa DATABASE_URL (banco "servicos") onde as migrations foram aplicadas
function parseLocalUrl(raw: string) {
  const u = new URL(raw.replace(/^mysql:\/\//, "http://"));
  return {
    host: u.hostname,
    port: parseInt(u.port) || 3306,
    user: decodeURIComponent(u.username) || "root",
    password: decodeURIComponent(u.password) || undefined,
    database: u.pathname.slice(1),
    connectionLimit: 5,
    allowPublicKeyRetrieval: true,
  };
}
const adapter = new PrismaMariaDb(parseLocalUrl(process.env.DATABASE_URL!));
const prisma = new PrismaClient({ adapter });

// ─── Parse GLPI URL ───────────────────────────────────────────────────────────
function parseGlpiUrl(raw: string) {
  // Corrige typo: "10.75.32.150ocalhost" → "10.75.32.150"
  const cleaned = raw.replace(/(\d{1,3}(?:\.\d{1,3}){3})ocalhost/, "$1");
  const u = new URL(cleaned.replace(/^mysql:\/\//, "http://"));
  return {
    host: u.hostname,
    port: parseInt(u.port) || 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    connectTimeout: 10000,
  };
}

// ─── Mapeamentos GLPI → schema local ─────────────────────────────────────────
function mapStatus(s: number) {
  if (s === 4) return "aguardando";
  if (s === 5) return "resolvido";
  if (s === 6) return "fechado";
  if (s === 2 || s === 3) return "atendimento";
  return "aberto";
}

function mapPriority(p: number) {
  if (p >= 5) return "urgente";
  if (p === 4) return "alta";
  if (p === 3) return "media";
  return "baixa";
}

function safeLogin(raw: string | null | undefined, fallback: string) {
  return (raw || fallback).replace(/[^a-zA-Z0-9_.@-]/g, "_").slice(0, 200);
}

// ─── Helpers de IN clause ─────────────────────────────────────────────────────
function inClause(ids: (number | string)[]) {
  if (!ids.length) throw new Error("Lista de IDs vazia");
  return ids.map(() => "?").join(",");
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const glpiConfig = parseGlpiUrl(process.env.GLPI_DATABASE_URL!);
  console.log(`\nConectando ao GLPI em ${glpiConfig.host}:${glpiConfig.port}/${glpiConfig.database}...`);

  const glpi = await mariadb.createConnection(glpiConfig);
  console.log("✓ Conectado ao GLPI\n");

  // ── 1. Últimos 500 chamados ─────────────────────────────────────────────────
  const tickets: any[] = await glpi.query(
    `SELECT id, name, content, status, priority, date, solvedate, closedate,
            entities_id, itilcategories_id
     FROM glpi_tickets
     WHERE is_deleted = 0
     ORDER BY id DESC
     LIMIT 500`
  );

  if (!tickets.length) {
    console.log("Nenhum chamado encontrado no GLPI.");
    await glpi.end();
    return;
  }

  const ticketIds = tickets.map((t) => Number(t.id));
  const entityIds = [...new Set(tickets.map((t) => Number(t.entities_id)).filter((x) => x > 0))];
  const rawCatIds = [...new Set(tickets.map((t) => Number(t.itilcategories_id)).filter((x) => x > 0))];

  console.log(`✓ ${tickets.length} chamados encontrados`);

  // ── 2. Entidades ────────────────────────────────────────────────────────────
  let entities: any[] = [];
  if (entityIds.length) {
    entities = await glpi.query(
      `SELECT id, name, completename, code FROM glpi_entities WHERE id IN (${inClause(entityIds)})`,
      entityIds
    );
  }

  // ── 3. Categorias ───────────────────────────────────────────────────────────
  let glpiCats: any[] = [];
  if (rawCatIds.length) {
    glpiCats = await glpi.query(
      `SELECT id, name, completename FROM glpi_itilcategories WHERE id IN (${inClause(rawCatIds)})`,
      rawCatIds
    );
  }

  // ── 4. Usuários dos chamados (solicitante=1, técnico=2) ─────────────────────
  const ticketUsers: any[] = await glpi.query(
    `SELECT tu.tickets_id, tu.users_id, tu.type,
            u.name AS login, u.firstname, u.realname, u.phone
     FROM glpi_tickets_users tu
     LEFT JOIN glpi_users u ON u.id = tu.users_id
     WHERE tu.tickets_id IN (${inClause(ticketIds)}) AND tu.type IN (1, 2)`,
    ticketIds
  );

  // ── 5. Followups / mensagens ────────────────────────────────────────────────
  let followups: any[] = [];
  try {
    followups = await glpi.query(
      `SELECT f.items_id AS ticket_id, f.content, f.date, f.users_id, f.is_private,
              u.name AS login, u.firstname, u.realname
       FROM glpi_itilfollowups f
       LEFT JOIN glpi_users u ON u.id = f.users_id
       WHERE f.itemtype = 'Ticket' AND f.items_id IN (${inClause(ticketIds)})
       ORDER BY f.date ASC`,
      ticketIds
    );
  } catch {
    console.warn("  ⚠ Tabela glpi_itilfollowups não encontrada — followups ignorados.");
  }

  await glpi.end();
  console.log(
    `✓ GLPI desconectado | ${entities.length} entidades | ${glpiCats.length} categorias | ${ticketUsers.length} usuários-ticket | ${followups.length} followups\n`
  );

  // ─── IMPORTAÇÃO LOCAL ─────────────────────────────────────────────────────

  // ── Unidades (entidades GLPI) ───────────────────────────────────────────────
  const entityMap = new Map<number, string>(); // glpi_entity_id → local id (uuid)
  for (const e of entities) {
    const codigo = `glpi_${e.id}`;
    const nome = (e.name || e.completename || "Sem Nome").slice(0, 200);
    const completeName: string = e.completename || e.name || "";
    const raiz = completeName.split(" > ")[0].slice(0, 100) || nome;
    const sigla = (e.code || nome).slice(0, 100);

    const u = await prisma.hdUnidade.upsert({
      where: { codigo },
      update: { nome },
      create: { codigo, nome, raiz, sigla },
    });
    entityMap.set(Number(e.id), u.id);
  }

  let defaultUnidade = await prisma.hdUnidade.findFirst({ where: { codigo: "glpi_default" } });
  if (!defaultUnidade) {
    defaultUnidade = await prisma.hdUnidade.create({
      data: { codigo: "glpi_default", nome: "Sem Entidade (GLPI)", raiz: "GLPI", sigla: "GLPI" },
    });
  }
  console.log(`✓ ${entityMap.size} unidades importadas`);

  // ── Categorias ──────────────────────────────────────────────────────────────
  const catMap = new Map<number, number>(); // glpi_cat_id → local id

  let defaultCat = await prisma.hdCategoria.findFirst({ where: { nome: "GLPI - Sem Categoria" } });
  if (!defaultCat) {
    defaultCat = await prisma.hdCategoria.create({
      data: { nome: "GLPI - Sem Categoria", pai: "GLPI", filho: null },
    });
  }

  for (const c of glpiCats) {
    const parts = (c.completename || c.name || "").split(" > ");
    const cat = await prisma.hdCategoria.create({
      data: {
        nome: (c.name || "Sem Categoria").slice(0, 200),
        pai: (parts[0] || "GLPI").slice(0, 100),
        filho: parts.length > 1 ? parts.slice(1).join(" > ").slice(0, 100) : null,
      },
    });
    catMap.set(Number(c.id), cat.id);
  }
  console.log(`✓ ${catMap.size} categorias importadas`);

  // ── Usuários ────────────────────────────────────────────────────────────────
  const allGlpiUsers = new Map<number, any>();
  for (const tu of ticketUsers) {
    if (tu.users_id && !allGlpiUsers.has(Number(tu.users_id))) {
      allGlpiUsers.set(Number(tu.users_id), tu);
    }
  }
  for (const f of followups) {
    if (f.users_id && !allGlpiUsers.has(Number(f.users_id))) {
      allGlpiUsers.set(Number(f.users_id), f);
    }
  }

  let systemUser = await prisma.usuario.findFirst({ where: { login: "glpi_system" } });
  if (!systemUser) {
    systemUser = await prisma.usuario.create({
      data: { login: "glpi_system", nome: "GLPI System", email: "glpi_system@glpi.local", permissao: "USR" },
    });
  }

  const userMap = new Map<number, string>(); // glpi_user_id → local usuario.id
  for (const [glpiId, u] of allGlpiUsers) {
    const rawLogin = u.login || String(glpiId);
    const login = `glpi_${safeLogin(rawLogin, String(glpiId))}`;
    const nome = ([u.firstname, u.realname].filter(Boolean).join(" ") || rawLogin).slice(0, 300);
    const email = `${login}@glpi.local`;
    try {
      const usuario = await prisma.usuario.upsert({
        where: { login },
        update: { nome },
        create: { login, nome, email, permissao: "USR" },
      });
      userMap.set(glpiId, usuario.id);
    } catch {
      userMap.set(glpiId, systemUser!.id);
    }
  }
  console.log(`✓ ${userMap.size} usuários importados`);

  // ── Montagem dos lookups ────────────────────────────────────────────────────
  const requesterByTicket = new Map<number, string>();
  const techByTicket = new Map<number, string>();

  for (const tu of ticketUsers) {
    const uid = userMap.get(Number(tu.users_id)) || systemUser!.id;
    const tid = Number(tu.tickets_id);
    if (tu.type === 1 && !requesterByTicket.has(tid)) requesterByTicket.set(tid, uid);
    if (tu.type === 2 && !techByTicket.has(tid)) techByTicket.set(tid, uid);
  }

  const followupsByTicket = new Map<number, any[]>();
  for (const f of followups) {
    const tid = Number(f.ticket_id);
    const list = followupsByTicket.get(tid) ?? [];
    list.push(f);
    followupsByTicket.set(tid, list);
  }

  // ── Chamados ────────────────────────────────────────────────────────────────
  let created = 0;
  let skipped = 0;

  for (const t of tickets) {
    const tid = Number(t.id);
    const solicitanteId = requesterByTicket.get(tid) || systemUser!.id;
    const unidadeId = entityMap.get(Number(t.entities_id)) || defaultUnidade!.id;
    const categoriaId = catMap.get(Number(t.itilcategories_id)) || defaultCat!.id;
    const techId = techByTicket.get(tid);

    try {
      const chamado = await prisma.hdChamado.create({
        data: {
          titulo: (t.name || "Sem título").slice(0, 300),
          descricao: t.content || "",
          status: mapStatus(Number(t.status)) as any,
          prioridade: mapPriority(Number(t.priority)) as any,
          solicitanteId,
          unidadeId,
          categoriaId,
          abertura: t.date ? new Date(t.date) : new Date(),
          dataResolucao: t.solvedate ? new Date(t.solvedate) : null,
          dataFechamento: t.closedate ? new Date(t.closedate) : null,
        },
      });

      // Vínculo técnico
      if (techId) {
        await prisma.hdChamadoUsuario.create({
          data: { chamadoId: chamado.id, usuarioId: techId, papel: "tecnico" },
        }).catch(() => {});
      }

      // Mensagens (followups)
      const fups = followupsByTicket.get(tid) ?? [];
      for (const f of fups) {
        const autorId = (f.users_id ? userMap.get(Number(f.users_id)) : null) || solicitanteId;
        await prisma.hdMensagem.create({
          data: {
            chamadoId: chamado.id,
            autorId,
            texto: f.content || "",
            tipo: f.is_private ? "interna" : "publica",
            criadoEm: f.date ? new Date(f.date) : new Date(),
          },
        });
      }

      created++;
      if (created % 50 === 0) process.stdout.write(`  → ${created} chamados importados...\n`);
    } catch (e: any) {
      console.warn(`  ⚠ Ticket GLPI #${t.id} ignorado: ${e.message?.slice(0, 120)}`);
      skipped++;
    }
  }

  console.log(`\n✓ Importação concluída: ${created} chamados criados, ${skipped} ignorados.`);
}

main()
  .catch((e) => { console.error("\n✗ Erro fatal:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
