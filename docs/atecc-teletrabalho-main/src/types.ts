export type Cargo = 
  | 'ASO, AAG e Assessor' 
  | 'Arquitetos' 
  | 'Arquitetos com cargo de Assessor';

export interface User {
  id: string;
  rf: string;
  nomeCompleto: string;
  unidadeId: string;
  cargo: Cargo;
  grupoTeletrabalho?: 1 | 2;
  role?: 'admin' | 'user';
}

export interface Atividade {
  id: string;
  categoria: string;
  descricao: string;
  pontuacao: number;
}

export interface CargoConfig {
  id: Cargo;
  atividades: Atividade[];
}

export interface Unidade {
  id: string;
  nome: string;
}

export interface AtividadeRegistro {
  id: string;
  quantidade: number;
}

export interface Registro {
  id: string;
  userId: string; // Link to User
  rf: string;
  nomeCompleto: string;
  unidadeLotacao: string;
  unidadeId: string;
  dataTeletrabalho: string;
  cargo: Cargo;
  atividades: AtividadeRegistro[];
  processosAnalisados?: string;
  dificuldades?: string;
  motivoAtraso?: string;
  compensacao?: boolean; // Optional for historical data
  dataRealPreenchimento: string;
  timestamp: string;
  pontuacaoTotal: number;
}

export interface CalendarActivity {
  id: string;
  userId: string;
  date: string; // ISO format YYYY-MM-DD
  time: string;
  subject: string;
}

export interface DutyStaff {
  id: string;
  userId: string;
  userName: string;
  userCargo: Cargo;
  date: string; // ISO format YYYY-MM-DD
}
