export interface IUsuario {
  id: string;
  nome: string;
  login: string;
  email: string;
  permissao?: string;
  desenvolvedor?: boolean;
  avatar?: string;
  status: boolean;
  ultimoLogin: Date;
  criadoEm: Date;
  atualizadoEm: Date;
  nomeSocial?: string;
  coordenadoriaId?: string;
}

export interface IRespostaUsuario {
  ok: boolean;
  error: string | null;
  data: IUsuario | null;
  status: number;
}
