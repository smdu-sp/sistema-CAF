/** @format */

export interface IUsuario {
  id: string;
  nome: string;
  login: string;
  email: string;
  permissao: IPermissao;
  avatar?: string;
  status: boolean;
  ultimoLogin: Date;
  criadoEm: Date;
  atualizadoEm: Date;
  nomeSocial?: string;
}

export enum IPermissao {
  DEV,
  TEC,
  ADM,
  USR,
}

export interface IRespostaUsuario {
  ok: boolean;
  error: string | null;
  data: IUsuario | null;
  status: number;
}
