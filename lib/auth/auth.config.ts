/** @format */

import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { prisma } from "@/lib/prisma";
import { autenticarLDAP } from "@/lib/auth/ldap";

export default {
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.senha) return null;

        const login = credentials.login as string;
        const senha = credentials.senha as string;
        const isDev = process.env.NODE_ENV === "development";

        try {
          // 1. Busca o usuário no banco local
          const usuario = await prisma.usuario.findUnique({ where: { login } });
          if (!usuario) {
            console.warn("[auth] Usuário não cadastrado no sistema:", login);
            return null;
          }
          if (!usuario.status) {
            console.warn("[auth] Usuário inativo:", login);
            return null;
          }

          // 2. Ambiente local: pula validação LDAP (igual ao backend original)
          const isLocal = process.env.ENVIRONMENT === "local";
          if (!isLocal) {
            const ldapUser = await autenticarLDAP(login, senha);
            if (!ldapUser) {
              console.warn("[auth] Falha LDAP – credenciais inválidas ou servidor inacessível. Login:", login);
              return null;
            }
            // Sincroniza dados do AD
            await prisma.usuario.update({
              where: { id: usuario.id },
              data: {
                ultimoLogin: new Date(),
                nome: ldapUser.nome || usuario.nome,
                email: ldapUser.email || usuario.email,
                ...(ldapUser.avatar ? { avatar: ldapUser.avatar } : {}),
              },
            });
            return {
              id: usuario.id,
              login: usuario.login,
              nome: ldapUser.nome || usuario.nome,
              email: ldapUser.email || usuario.email,
              permissao: usuario.permissao as string,
              nomeSocial: usuario.nomeSocial ?? undefined,
              avatar: ldapUser.avatar || usuario.avatar || undefined,
              coordenadoriaId: usuario.coordenadoriaId ?? undefined,
            };
          }

          // Modo local: atualiza só o último login
          await prisma.usuario.update({
            where: { id: usuario.id },
            data: { ultimoLogin: new Date() },
          });
          return {
            id: usuario.id,
            login: usuario.login,
            nome: usuario.nome,
            email: usuario.email,
            permissao: usuario.permissao as string,
            nomeSocial: usuario.nomeSocial ?? undefined,
            avatar: usuario.avatar || undefined,
            coordenadoriaId: usuario.coordenadoriaId ?? undefined,
          };
        } catch (err) {
          console.error("[auth] Erro inesperado ao autenticar:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.usuario) {
        token.usuario = { ...(token.usuario as object), ...(session.usuario as object) };
        return token;
      }
      if (user) token.usuario = user;
      return token;
    },
    async session({ session, token }) {
      if (token.usuario) (session as Record<string, unknown>).usuario = token.usuario;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig;
