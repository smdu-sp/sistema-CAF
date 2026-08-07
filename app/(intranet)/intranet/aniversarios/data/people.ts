export interface PessoaMock {
  id: string;
  nome: string;
  setor: string;
  data_nascimento: string;
  felicitantes: string[]; // nomes de quem já parabenizou (mock, sem backend)
}

export const pessoasMock: PessoaMock[] = [
  { id: "ana-souza", nome: "Ana Souza", setor: "ATIC", data_nascimento: "1994-03-15", felicitantes: [] },
  { id: "carlos-eduardo-oliveira", nome: "Carlos Eduardo Oliveira", setor: "ATIC", data_nascimento: "1988-08-06", felicitantes: ["Mariana Costa", "Lucas Mendes"] },
  { id: "mariana-costa", nome: "Mariana Costa", setor: "ATIC", data_nascimento: "2000-11-05", felicitantes: [] },
  { id: "lucas-mendes", nome: "Lucas Mendes", setor: "STEL", data_nascimento: "1991-08-30", felicitantes: [] },
  { id: "beatriz-lima", nome: "Beatriz Lima", setor: "STEL", data_nascimento: "1996-08-07", felicitantes: [] },
  { id: "rafael-fernandes", nome: "Rafael Fernandes", setor: "STEL", data_nascimento: "1985-08-12", felicitantes: [] },
  { id: "juliana-rocha", nome: "Juliana Rocha", setor: "CAF", data_nascimento: "1998-07-25", felicitantes: [] },
  { id: "gabriel-alves", nome: "Gabriel Alves", setor: "CAF", data_nascimento: "1990-08-07", felicitantes: ["Camila Ribeiro"] },
  { id: "camila-ribeiro", nome: "Camila Ribeiro", setor: "CAF", data_nascimento: "2002-02-14", felicitantes: [] },
  { id: "junior-madara", nome: "Junior Madara", setor: "ADM", data_nascimento: "1983-08-07", felicitantes: [] },
  { id: "eneias-junior", nome: "Eneias Junior", setor: "ADM", data_nascimento: "1983-08-19", felicitantes: [] },
];