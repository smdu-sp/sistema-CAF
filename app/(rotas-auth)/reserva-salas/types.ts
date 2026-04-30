export type SalaAdmin = {
  id: string;
  nome: string;
  andar: string | null;
  numero: string | null;
};

export type ReservaAdmin = {
  id: string;
  salaId: string;
  salaNome: string;
  titulo: string | null;
  usuarioNome: string | null;
  usuarioLogin: string;
  coordenadoriaNome: string | null;
  inicio: string;
  fim: string;
};