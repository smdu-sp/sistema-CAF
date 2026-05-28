/** @format */

import type { IUsuario } from "@/types/usuario";

declare module "next-auth" {
  interface Session {
    usuario?: IUsuario;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    usuario?: IUsuario;
  }
}
