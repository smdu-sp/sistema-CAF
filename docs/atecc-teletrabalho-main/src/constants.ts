import { Cargo, CargoConfig, Unidade, User } from './types';

export const UNIDADES_INICIAIS: Unidade[] = [
  { id: 'atecc', nome: 'ATECC (Assessoria Técnica de Comissões e Colegiados)' }
];

export const CARGOS: Cargo[] = [
  'ASO, AAG e Assessor',
  'Arquitetos',
  'Arquitetos com cargo de Assessor'
];

export const USUARIOS_PADRAO: User[] = [
  // Administrador
  { id: 'admin', rf: '000.000-0', nomeCompleto: 'Administrador', unidadeId: 'atecc', cargo: 'ASO, AAG e Assessor', role: 'admin' },
  // Grupo 1
  { id: 'u1', rf: '800.001-1', nomeCompleto: 'ALESSANDRO', unidadeId: 'atecc', cargo: 'ASO, AAG e Assessor', grupoTeletrabalho: 1, role: 'user' },
  { id: 'u2', rf: '800.002-1', nomeCompleto: 'CECILIA', unidadeId: 'atecc', cargo: 'ASO, AAG e Assessor', grupoTeletrabalho: 1, role: 'user' },
  { id: 'u3', rf: '800.003-1', nomeCompleto: 'GABRIEL', unidadeId: 'atecc', cargo: 'ASO, AAG e Assessor', grupoTeletrabalho: 1, role: 'user' },
  { id: 'u4', rf: '800.004-1', nomeCompleto: 'ÉRICA', unidadeId: 'atecc', cargo: 'Arquitetos com cargo de Assessor', grupoTeletrabalho: 1, role: 'user' },
  { id: 'u5', rf: '800.005-1', nomeCompleto: 'PAULA', unidadeId: 'atecc', cargo: 'Arquitetos com cargo de Assessor', grupoTeletrabalho: 1, role: 'user' },
  { id: 'u6', rf: '800.006-1', nomeCompleto: 'MARIANA', unidadeId: 'atecc', cargo: 'Arquitetos com cargo de Assessor', grupoTeletrabalho: 1, role: 'user' },
  { id: 'u7', rf: '800.007-1', nomeCompleto: 'ANA', unidadeId: 'atecc', cargo: 'Arquitetos', grupoTeletrabalho: 1, role: 'user' },
  { id: 'u8', rf: '800.008-1', nomeCompleto: 'RENAN', unidadeId: 'atecc', cargo: 'Arquitetos', grupoTeletrabalho: 1, role: 'user' },
  { id: 'u9', rf: '800.009-1', nomeCompleto: 'THAYS', unidadeId: 'atecc', cargo: 'Arquitetos', grupoTeletrabalho: 1, role: 'user' },
  // Grupo 2
  { id: 'u10', rf: '800.010-1', nomeCompleto: 'MARCO', unidadeId: 'atecc', cargo: 'ASO, AAG e Assessor', grupoTeletrabalho: 2, role: 'user' },
  { id: 'u11', rf: '800.011-1', nomeCompleto: 'MARCOS', unidadeId: 'atecc', cargo: 'ASO, AAG e Assessor', grupoTeletrabalho: 2, role: 'user' },
  { id: 'u12', rf: '800.012-1', nomeCompleto: 'THIAGO', unidadeId: 'atecc', cargo: 'ASO, AAG e Assessor', grupoTeletrabalho: 2, role: 'user' },
  { id: 'u13', rf: '800.013-1', nomeCompleto: 'HENRIQUE', unidadeId: 'atecc', cargo: 'ASO, AAG e Assessor', grupoTeletrabalho: 2, role: 'user' },
  { id: 'u14', rf: '800.014-1', nomeCompleto: 'MARILIA', unidadeId: 'atecc', cargo: 'Arquitetos com cargo de Assessor', grupoTeletrabalho: 2, role: 'user' },
  { id: 'u15', rf: '800.015-1', nomeCompleto: 'ROSANA', unidadeId: 'atecc', cargo: 'Arquitetos com cargo de Assessor', grupoTeletrabalho: 2, role: 'user' },
  { id: 'u16', rf: '800.016-1', nomeCompleto: 'FERNANDA', unidadeId: 'atecc', cargo: 'Arquitetos', grupoTeletrabalho: 2, role: 'user' },
  { id: 'u17', rf: '800.017-1', nomeCompleto: 'MARIELY', unidadeId: 'atecc', cargo: 'Arquitetos', grupoTeletrabalho: 2, role: 'user' },
  { id: 'u18', rf: '800.018-1', nomeCompleto: 'GIL', unidadeId: 'atecc', cargo: 'Arquitetos', grupoTeletrabalho: 2, role: 'user' }
];

export const CARGO_CONFIGS_INICIAIS: CargoConfig[] = [
  {
    id: 'ASO, AAG e Assessor',
    atividades: [
      { id: 'aso_1', categoria: 'ADMINISTRATIVO', descricao: 'Recepção de solicitações enviadas pelos demais servidores, Solicitações de providências a outros setores internos, Avisos Gerais dentro do setor', pontuacao: 20 },
      { id: 'aso_2', categoria: 'ADMINISTRATIVO', descricao: 'Registro e solicitação de materiais, Conferência de dados do patrimônio no SBPM, Aceite de movimentação, Checagem de movimentações pendentes', pontuacao: 30 },
      { id: 'aso_3', categoria: 'ADMINISTRATIVO', descricao: 'Organização nas pastas da intranet e Microsoft Teams; Alimentação com documentos e dados faltantes nas pastas do setor', pontuacao: 30 },
      { id: 'aso_4', categoria: 'ADMINISTRATIVO', descricao: 'Criação e atualização de manuais com os procedimentos internos, entre outros', pontuacao: 50 },
      { id: 'aso_5', categoria: 'ADMINISTRATIVO', descricao: 'Recebimento, conferência e tramitação de processos em ATECC, Aprova Rápido, CEUSO, CAIEPS, CAEHIS, CTLU, CPPU, CMPU, FUNDURB e CIMPDE', pontuacao: 10 },
      { id: 'aso_6', categoria: 'ADMINISTRATIVO', descricao: 'Geração de relatórios e gráficos diversos sobre o Aprova Rápido, CEUSO, CAIEPS, CAEHIS, CTLU, CPPU, CMPU, FUNDURB, CIMPDE e AIU-VL; Geração de relatório de estoque de processos', pontuacao: 30 },
      { id: 'aso_7', categoria: 'ADMINISTRATIVO', descricao: 'Inclusão e acompanhamento nas planilhas de controle de processos, Acompanhamento de prazos gerais, Publicações via SEI e demais sistemas, Consultas aos sistemas internos e geração de dados', pontuacao: 30 },
      { id: 'aso_8', categoria: 'ADMINISTRATIVO', descricao: 'Recepção e juntada de cartas de desistência, documentos, pedidos de reconsideração de inadmissibilidade e petições diversas, bem como geração de DAMSP', pontuacao: 25 },
      { id: 'aso_9', categoria: 'ADMINISTRATIVO', descricao: 'Geração de relatórios do SEI e conferência de dados nos documentos e encaminhamentos', pontuacao: 30 },
      { id: 'aso_10', categoria: 'ADMINISTRATIVO', descricao: 'Conferência e auxílio de processos de Ciência do corpo técnico; Auxílio administrativo aos técnicos e ao Chefe de Assessoria', pontuacao: 30 },
      { id: 'aso_11', categoria: 'ADMINISTRATIVO', descricao: 'Atendimento de dúvidas encaminhadas pela Imprensa de SMUL e outros órgãos internos e externos', pontuacao: 20 },
      { id: 'aso_12', categoria: 'ATENDIMENTO', descricao: 'Participação nas reuniões virtuais com munícipes para apoio administrativo', pontuacao: 20 },
      { id: 'aso_13', categoria: 'ATENDIMENTO', descricao: 'Conferência e resposta de e-mails; Auxílio e contato no recebimento, análise e soluções de dúvidas de munícipes; Suporte aos munícipes no protocolo de processos eletrônicos', pontuacao: 30 },
      { id: 'aso_14', categoria: 'ATENDIMENTO', descricao: 'Atendimentos e auxílio das demandas de marcação e alteração de férias, Esclarecimentos de dúvidas aos servidores do setor, Conferências das folhas de frequência digitalizadas, Mediação pelos elos para troca de informação com o setor de recursos humanos', pontuacao: 30 },
      { id: 'aso_15', categoria: 'COLEGIADOS', descricao: 'Auxílio na preparação e organização das reuniões das Comissões (levantamento de processos, elaboração da pauta, convocação, preparação e conferência de documentos, entre outros)', pontuacao: 40 },
      { id: 'aso_16', categoria: 'COLEGIADOS', descricao: 'Participação nas reuniões das Comissões para apoio administrativo', pontuacao: 50 },
      { id: 'aso_17', categoria: 'COLEGIADOS', descricao: 'Redação de informações, manifestações, listas de presenças, atas, pronunciamentos e despachos, a partir das deliberações do Plenário', pontuacao: 30 },
      { id: 'aso_18', categoria: 'COLEGIADOS', descricao: 'Aviso, suporte aos membros das Comissões com as assinaturas digitais, controle e cobrança de pendências no pós-reunião', pontuacao: 20 },
      { id: 'aso_19', categoria: 'COLEGIADOS', descricao: 'Atualização de atas, deliberações, calendários e lista de membros no site da prefeitura', pontuacao: 20 },
      { id: 'aso_20', categoria: 'COLEGIADOS', descricao: 'Preparação da eleição das Comissões e Colegiados', pontuacao: 50 }
    ]
  },
  {
    id: 'Arquitetos',
    atividades: [
      { id: 'arq_1', categoria: 'Análise Técnica', descricao: 'Análise no SEI, SLC e Aprova Digital', pontuacao: 10 },
      { id: 'arq_2', categoria: 'Análise Técnica', descricao: 'Admissibilidade do Aprova Rápido', pontuacao: 15 },
      { id: 'arq_3', categoria: 'Análise Técnica', descricao: 'Processos físicos digitalizados', pontuacao: 10 },
      { id: 'arq_4', categoria: 'Análise Técnica', descricao: 'FUNDURB (processos e balancetes)', pontuacao: 20 },
      { id: 'arq_5', categoria: 'Análise Técnica', descricao: 'Execução orçamentária', pontuacao: 20 },
      { id: 'arq_6', categoria: 'Relatórios', descricao: 'Elaboração e revisão de manifestações', pontuacao: 25 },
      { id: 'arq_7', categoria: 'Relatórios', descricao: 'Relatoria na CTLU', pontuacao: 30 },
      { id: 'arq_8', categoria: 'Relatórios', descricao: 'Propostas, resoluções e normas', pontuacao: 40 },
      { id: 'arq_9', categoria: 'Relatórios', descricao: 'Demandas relacionadas a Projetos de Lei', pontuacao: 40 },
      { id: 'arq_10', categoria: 'Administrativo', descricao: 'Apoio ao setor técnico', pontuacao: 10 },
      { id: 'arq_11', categoria: 'Administrativo', descricao: 'Planilhas de controle', pontuacao: 10 },
      { id: 'arq_12', categoria: 'Administrativo', descricao: 'Ofícios e memorandos via SEI', pontuacao: 15 },
      { id: 'arq_13', categoria: 'Comissões', descricao: 'Organização e participação', pontuacao: 30 },
      { id: 'arq_14', categoria: 'Comissões', descricao: 'Apresentações técnicas', pontuacao: 30 },
      { id: 'arq_15', categoria: 'Comissões', descricao: 'Eleições do CMPU e AIU‑VL', pontuacao: 50 },
      { id: 'arq_16', categoria: 'Atendimento', descricao: 'Atendimento à imprensa', pontuacao: 20 },
      { id: 'arq_17', categoria: 'Atendimento', descricao: 'Atendimento a munícipes', pontuacao: 20 },
      { id: 'arq_18', categoria: 'Atendimento', descricao: 'Reuniões virtuais', pontuacao: 20 },
      { id: 'arq_19', categoria: 'Atendimento', descricao: 'Outras demandas definidas pela chefia', pontuacao: 10 }
    ]
  },
  {
    id: 'Arquitetos com cargo de Assessor',
    atividades: [
      { id: 'ass_1', categoria: 'Análise Técnica', descricao: 'Análise, Revisão e Validação Técnica', pontuacao: 30 },
      { id: 'ass_2', categoria: 'Gestão', descricao: 'Supervisão, Coordenação e Controle', pontuacao: 40 },
      { id: 'ass_3', categoria: 'Estratégico', descricao: 'Produção de Documentos Estratégicos', pontuacao: 50 },
      { id: 'ass_4', categoria: 'Comissões', descricao: 'Atuação em Comissões (com relatoria)', pontuacao: 50 },
      { id: 'ass_5', categoria: 'Relacionamento', descricao: 'Atendimento e Relações Institucionais', pontuacao: 30 }
    ]
  }
];
