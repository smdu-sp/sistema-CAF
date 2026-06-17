export type LinhaSigpeg = {
  rf: string;
  nome: string;
  vinculo: string;
  especie: string;
  inicio: string;
  termino: string;
  codigoCargo: string;
  nomeCargo: string;
  refCargo: string;
  codigoEh: string;
  nomeUnidade: string;
  relJurAdm: string;
  tipoEvento: string;
  inicioExerc: string;
  titularRf: string;
  numVincTit: string;
  nomeFuncTit: string;
  inicioRem: string;
  fimRem: string;
  observacao: string;
  vaga: string;
};

function limparCampo(valor: string): string {
  return valor.replace(/\r/g, "").trim();
}

export function parseArquivoSigpeg(conteudo: string): LinhaSigpeg[] {
  const linhas = conteudo
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (linhas.length < 2) return [];

  const resultado: LinhaSigpeg[] = [];

  for (let i = 1; i < linhas.length; i++) {
    const campos = linhas[i].split(";");
    if (campos.length < 11) continue;

    const rf = limparCampo(campos[0]);
    const nome = limparCampo(campos[1]);
    if (!rf || !nome) continue;

    resultado.push({
      rf,
      nome,
      vinculo: limparCampo(campos[2] ?? ""),
      especie: limparCampo(campos[3] ?? ""),
      inicio: limparCampo(campos[4] ?? ""),
      termino: limparCampo(campos[5] ?? ""),
      codigoCargo: limparCampo(campos[6] ?? ""),
      nomeCargo: limparCampo(campos[7] ?? ""),
      refCargo: limparCampo(campos[8] ?? ""),
      codigoEh: limparCampo(campos[9] ?? ""),
      nomeUnidade: limparCampo(campos[10] ?? ""),
      relJurAdm: limparCampo(campos[11] ?? ""),
      tipoEvento: limparCampo(campos[12] ?? ""),
      inicioExerc: limparCampo(campos[13] ?? ""),
      titularRf: limparCampo(campos[14] ?? ""),
      numVincTit: limparCampo(campos[15] ?? ""),
      nomeFuncTit: limparCampo(campos[16] ?? ""),
      inicioRem: limparCampo(campos[17] ?? ""),
      fimRem: limparCampo(campos[18] ?? ""),
      observacao: limparCampo(campos[19] ?? ""),
      vaga: limparCampo(campos[20] ?? ""),
    });
  }

  return resultado;
}
