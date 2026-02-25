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

function extrairInfo(entry: Record<string, unknown>, login: string, domain: string): LdapUserInfo {
  const nome = (entry.displayName as string) || login;
  const email = (entry.mail as string) || `${login}@${domain}`;

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
