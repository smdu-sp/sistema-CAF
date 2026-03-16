/** @format */

import { Client } from "ldapts";

export interface LdapUserInfo {
  nome: string;
  email: string;
  avatar?: string;
}

function criarCliente() {
  const url = process.env.LDAP_URL;
  if (!url) throw new Error("LDAP_URL não configurada");
  return new Client({ url });
}

function ldapDomain() {
  // Suporta tanto "rede.sp" quanto "@rede.sp" (normaliza removendo @ inicial)
  return (process.env.LDAP_DOMAIN ?? "").replace(/^@/, "");
}

function ldapBaseDn() {
  return process.env.LDAP_BASE_DN ?? "";
}

function valorString(field: unknown): string {
  if (Array.isArray(field)) return (field[0] as string) ?? "";
  return (field as string) ?? "";
}

function extrairInfo(entry: Record<string, unknown>, login: string, domain: string): LdapUserInfo {
  const nome = valorString(entry.displayName) || login;
  const email = valorString(entry.mail) || `${login}@${domain}`;

  let avatar: string | undefined;
  const foto = entry.thumbnailPhoto;
  if (foto) {
    const buf = Buffer.isBuffer(foto) ? foto : Buffer.from(foto as string, "binary");
    if (buf.length > 0) avatar = `data:image/jpeg;base64,${buf.toString("base64")}`;
  }

  return { nome, email, avatar };
}

/** Autentica o usuário diretamente com suas próprias credenciais. */
export async function autenticarLDAP(
  login: string,
  senha: string,
): Promise<LdapUserInfo | null> {
  const domain = ldapDomain();
  const baseDn = ldapBaseDn();

  if (!process.env.LDAP_URL || !domain || !baseDn) {
    console.warn("[ldap] LDAP_URL, LDAP_DOMAIN ou LDAP_BASE_DN não configurados.");
    return null;
  }

  const client = criarCliente();
  try {
    await client.bind(`${login}@${domain}`, senha);

    const { searchEntries } = await client.search(baseDn, {
      scope: "sub",
      filter: `(sAMAccountName=${login})`,
      attributes: ["displayName", "mail", "thumbnailPhoto"],
    });

    await client.unbind();
    if (!searchEntries.length) return null;

    return extrairInfo(searchEntries[0] as Record<string, unknown>, login, domain);
  } catch (err: unknown) {
    try { await client.unbind(); } catch { /* silencia */ }
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[ldap] autenticarLDAP falhou para "${login}@${domain}" → ${msg}`);
    return null;
  }
}

/**
 * Busca dados de um usuário no AD usando uma conta de serviço.
 * Usado para importar usuários sem precisar da senha deles.
 */
export async function buscarUsuarioNoAD(loginAlvo: string): Promise<LdapUserInfo | null> {
  const domain = ldapDomain();
  const baseDn = ldapBaseDn();
  const bindDn = process.env.LDAP_BIND_DN;
  const bindSenha = process.env.LDAP_BIND_SENHA;

  if (!process.env.LDAP_URL || !domain || !baseDn || !bindDn || !bindSenha) {
    console.warn("[ldap] Variáveis de conta de serviço (LDAP_BIND_DN / LDAP_BIND_SENHA) não configuradas.");
    return null;
  }

  const client = criarCliente();
  try {
    await client.bind(bindDn, bindSenha);

    const { searchEntries } = await client.search(baseDn, {
      scope: "sub",
      filter: `(sAMAccountName=${loginAlvo})`,
      attributes: ["displayName", "mail", "thumbnailPhoto"],
    });

    await client.unbind();
    if (!searchEntries.length) return null;

    return extrairInfo(searchEntries[0] as Record<string, unknown>, loginAlvo, domain);
  } catch {
    try { await client.unbind(); } catch { /* silencia */ }
    return null;
  }
}

export type UsuarioADPorPrefixo = {
  login: string;
  nome: string;
  email: string;
  avatar?: string;
};

/**
 * Lista usuários no AD cujo login (sAMAccountName) começa com o prefixo dado.
 * Usa conta de serviço. A busca é restrita ao OU definido em LDAP_IMPORT_DN
 * (se configurado), caso contrário usa o LDAP_BASE_DN completo.
 * Retorna array vazio se LDAP não configurado ou em caso de erro.
 */
export async function listarUsuariosPorPrefixo(prefixo: string): Promise<UsuarioADPorPrefixo[]> {
  const domain = ldapDomain();
  const baseDn = ldapBaseDn();
  const bindDn = process.env.LDAP_BIND_DN;
  const bindSenha = process.env.LDAP_BIND_SENHA;

  if (!process.env.LDAP_URL || !domain || !baseDn || !bindDn || !bindSenha) {
    console.warn("[ldap] Variáveis de conta de serviço não configuradas.");
    return [];
  }

  // LDAP_IMPORT_DN restringe a busca a um OU específico (ex: OU=SMUL,DC=rede,DC=sp)
  const importDn = process.env.LDAP_IMPORT_DN || baseDn;

  const client = criarCliente();
  try {
    await client.bind(bindDn, bindSenha);

    const filtro = `(sAMAccountName=${escapeLdapFilterValue(prefixo)}*)`;
    const { searchEntries } = await client.search(importDn, {
      scope: "sub",
      filter: filtro,
      attributes: ["sAMAccountName", "displayName", "mail", "thumbnailPhoto"],
      paged: { pageSize: 500 },
    });

    await client.unbind();

    return searchEntries.map((entry) => {
      const e = entry as Record<string, unknown>;
      const raw = e.sAMAccountName;
      const login = (Array.isArray(raw) ? raw[0] : raw) as string ?? "";
      const info = extrairInfo(e, login, domain);
      return { login: String(login), nome: info.nome, email: info.email, avatar: info.avatar };
    }).filter((u) => u.login.length > 0);
  } catch (err) {
    try { await client.unbind(); } catch { /* silencia */ }
    console.error("[ldap] listarUsuariosPorPrefixo falhou:", err);
    return [];
  }
}

function escapeLdapFilterValue(value: string): string {
  return value.replace(/[\\*()\x00]/g, (c) => "\\" + c.charCodeAt(0).toString(16).padStart(2, "0"));
}
// Nota: o * no filtro (sAMAccountName=prefixo*) é wildcard do LDAP; só escapamos o prefixo.
