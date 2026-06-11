import mariadb from "mariadb";

type GlobalComPoolSgu = typeof globalThis & {
  __sguPool?: mariadb.Pool;
};

function parseSguUrl(raw: string) {
  const cleaned = raw.replace(/^mysql:\/\//, "http://");
  const u = new URL(cleaned);
  return {
    host: u.hostname,
    port: parseInt(u.port, 10) || 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
    connectionLimit: 3,
    connectTimeout: 10000,
  };
}

export function poolSguDisponivel(): boolean {
  return !!process.env.SGU_DATABASE_URL?.trim();
}

export function getPoolSgu(): mariadb.Pool | null {
  const raw = process.env.SGU_DATABASE_URL?.trim();
  if (!raw) return null;

  const g = globalThis as GlobalComPoolSgu;
  if (!g.__sguPool) {
    g.__sguPool = mariadb.createPool(parseSguUrl(raw));
  }
  return g.__sguPool;
}

export async function querySgu<T extends mariadb.RowDataPacket>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPoolSgu();
  if (!pool) return [];
  try {
    return (await pool.query(sql, params)) as T[];
  } catch (err) {
    console.error("[sgu] Erro na consulta:", err);
    return [];
  }
}
