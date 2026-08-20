import { prisma } from "@/lib/prisma";
import { querySgu } from "./client";

export type ResponsavelUnidadeSgu = {
  rf: string;
  nome: string;
  login: string | null;
  email: string | null;
  cargo: string | null;
  setor: string | null;
};

type RowResponsavel = {
  cpRF: string | null;
  cpNome: string | null;
  cpUsuarioRede: string | null;
  cpnomecargo2: string | null;
  cpnomesetor2: string | null;
};

const CARGO_RESPONSAVEL =
  "UPPER(IFNULL(cpnomecargo2,'')) REGEXP 'COORDENAD|DIRETOR|CHEFE|SUPERINTENDENTE|SUBSECRET'";

/** Busca coordenador(a)/diretor(a) no SGU pela unidade ou sigla da coordenadoria. */
export async function buscarResponsavelUnidadeSgu(params: {
  siglaUnidade?: string | null;
  nomeUnidade?: string | null;
  raizCoordenadoria?: string | null;
}): Promise<ResponsavelUnidadeSgu | null> {
  const sigla = params.siglaUnidade?.trim();
  const nome = params.nomeUnidade?.trim();
  const raiz = params.raizCoordenadoria?.trim();

  if (!sigla && !nome && !raiz) return null;

  const rows = await querySgu<RowResponsavel>(
    `SELECT u.cpRF, u.cpNome, u.cpUsuarioRede, u.cpnomecargo2, u.cpnomesetor2
     FROM tblUsuarios u
     LEFT JOIN tblUnidades un ON un.cdUnid = u.cpUnid OR un.nome = u.cpnomesetor2
     WHERE IFNULL(u.cpUltimaCarga,'') = 'X'
       AND (${CARGO_RESPONSAVEL})
       AND (
         (? IS NOT NULL AND ? <> '' AND (un.sigla = ? OR u.cpUnid = ?))
         OR (? IS NOT NULL AND ? <> '' AND (u.cpnomesetor2 LIKE CONCAT('%', ?, '%') OR un.nome LIKE CONCAT('%', ?, '%')))
         OR (? IS NOT NULL AND ? <> '' AND (u.cpnomesetor2 LIKE CONCAT('%', ?, '%') OR un.sigla = ?))
       )
     ORDER BY
       CASE WHEN UPPER(IFNULL(u.cpnomecargo2,'')) LIKE '%DIRETOR%' THEN 0
            WHEN UPPER(IFNULL(u.cpnomecargo2,'')) LIKE '%COORDENAD%' THEN 1
            ELSE 2 END
     LIMIT 1`,
    [
      sigla, sigla, sigla, sigla,
      nome, nome, nome, nome,
      raiz, raiz, raiz, raiz,
    ]
  );

  const row = rows[0];
  if (!row?.cpRF && !row?.cpNome) return null;

  const login = row.cpUsuarioRede?.trim().toLowerCase() || null;
  let email: string | null = null;
  if (login) {
    const local = await prisma.usuario.findFirst({
      where: { login },
      select: { email: true },
    });
    email = local?.email ?? null;
  }

  return {
    rf: row.cpRF?.trim() || "",
    nome: row.cpNome?.trim() || "",
    login,
    email,
    cargo: row.cpnomecargo2?.trim() || null,
    setor: row.cpnomesetor2?.trim() || null,
  };
}

/** Servidores subordinados à mesma unidade/setor no SGU (para filtro do coordenador). */
export async function listarRfsSubordinadosSgu(params: {
  siglaUnidade?: string | null;
  nomeSetor?: string | null;
}): Promise<string[]> {
  const sigla = params.siglaUnidade?.trim();
  const setor = params.nomeSetor?.trim();
  if (!sigla && !setor) return [];

  const rows = await querySgu<{ cpRF: string | null }>(
    `SELECT DISTINCT u.cpRF
     FROM tblUsuarios u
     LEFT JOIN tblUnidades un ON un.cdUnid = u.cpUnid
     WHERE IFNULL(u.cpUltimaCarga,'') = 'X'
       AND u.cpRF IS NOT NULL AND TRIM(u.cpRF) <> ''
       AND (
         (? IS NOT NULL AND ? <> '' AND (un.sigla = ? OR u.cpUnid = ?))
         OR (? IS NOT NULL AND ? <> '' AND u.cpnomesetor2 LIKE CONCAT('%', ?, '%'))
       )`,
    [sigla, sigla, sigla, sigla, setor, setor, setor]
  );

  return rows.map((r) => r.cpRF!.trim()).filter(Boolean);
}

export type DadosUsuarioSgu = {
  rf: string;
  nome: string;
  login: string | null;
  setor: string | null;
  siglaUnidade: string | null;
};

export async function buscarUsuarioSguPorLogin(
  login: string
): Promise<DadosUsuarioSgu | null> {
  const l = login.trim().toLowerCase();
  if (!l) return null;

  const rows = await querySgu<{
    cpRF: string | null;
    cpNome: string | null;
    cpUsuarioRede: string | null;
    cpnomesetor2: string | null;
    siglaUnidade: string | null;
  }>(
    `SELECT u.cpRF, u.cpNome, u.cpUsuarioRede, u.cpnomesetor2, un.sigla AS siglaUnidade
     FROM tblUsuarios u
     LEFT JOIN tblUnidades un ON un.cdUnid = u.cpUnid
     WHERE LOWER(TRIM(u.cpUsuarioRede)) = ?
     LIMIT 1`,
    [l]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    rf: row.cpRF?.trim() || "",
    nome: row.cpNome?.trim() || "",
    login: row.cpUsuarioRede?.trim().toLowerCase() || null,
    setor: row.cpnomesetor2?.trim() || null,
    siglaUnidade: row.siglaUnidade?.trim() || null,
  };
}

export async function buscarUsuarioSguPorRf(rf: string): Promise<DadosUsuarioSgu | null> {
  const r = rf.trim();
  if (!r) return null;

  const rows = await querySgu<{
    cpRF: string | null;
    cpNome: string | null;
    cpUsuarioRede: string | null;
    cpnomesetor2: string | null;
    siglaUnidade: string | null;
  }>(
    `SELECT u.cpRF, u.cpNome, u.cpUsuarioRede, u.cpnomesetor2, un.sigla AS siglaUnidade
     FROM tblUsuarios u
     LEFT JOIN tblUnidades un ON un.cdUnid = u.cpUnid
     WHERE TRIM(u.cpRF) = ?
     LIMIT 1`,
    [r]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    rf: row.cpRF?.trim() || r,
    nome: row.cpNome?.trim() || "",
    login: row.cpUsuarioRede?.trim().toLowerCase() || null,
    setor: row.cpnomesetor2?.trim() || null,
    siglaUnidade: row.siglaUnidade?.trim() || null,
  };
}
