export interface IUsuario {
  id: string;
  nome: string;
  login: string;
  email: string;
  avatar?: string;
  status: boolean;
  ultimoLogin: Date;
  criadoEm: Date;
  atualizadoEm: Date;
  nomeSocial?: string;
}

export interface IRespostaUsuario {
  ok: boolean;
  error: string | null;
  data: IUsuario | null;
  status: number;
}
