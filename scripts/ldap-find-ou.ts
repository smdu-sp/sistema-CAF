/**
 * Descobre o DN do OU "SMUL" no Active Directory.
 * Uso: npx tsx --env-file=.env scripts/ldap-find-ou.ts
 */
import { Client } from "ldapts";

const url       = process.env.LDAP_URL!;
const baseDn    = process.env.LDAP_BASE_DN!;
const bindDn    = process.env.LDAP_BIND_DN!;
const bindSenha = process.env.LDAP_BIND_SENHA!;

if (!url || !baseDn || !bindDn || !bindSenha) {
  console.error("Variáveis LDAP_URL, LDAP_BASE_DN, LDAP_BIND_DN e LDAP_BIND_SENHA precisam estar no .env");
  process.exit(1);
}

const client = new Client({ url });

async function main() {
  await client.bind(bindDn, bindSenha);
  console.log(`\nConectado a ${url} — buscando OUs com nome "SMUL" em "${baseDn}"...\n`);

  const { searchEntries } = await client.search(baseDn, {
    scope: "sub",
    filter: "(&(objectClass=organizationalUnit)(ou=SMUL))",
    attributes: ["dn", "ou"],
    paged: { pageSize: 200 },
  });

  await client.unbind();

  if (!searchEntries.length) {
    console.log('Nenhum OU com nome "SMUL" encontrado.');
    return;
  }

  console.log(`Encontrado(s) ${searchEntries.length} OU(s):\n`);
  for (const entry of searchEntries) {
    console.log("  dn:", entry.dn);
  }

  console.log("\n→ Copie o dn correto e adicione ao .env:");
  console.log(`   LDAP_IMPORT_DN=${searchEntries[0].dn}\n`);
}

main().catch((err) => {
  console.error("Erro:", err.message);
  client.unbind().catch(() => {});
  process.exit(1);
});
