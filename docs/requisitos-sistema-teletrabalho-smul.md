# Sistema de Controle de Teletrabalho — SMUL

**Documento de Requisitos**
Versão 0.1 — rascunho para validação

---

## 1. Objetivo

Sistema para gestão do regime permanente de teletrabalho nas unidades da Secretaria Municipal de Urbanismo e Licenciamento (SMUL), cobrindo:

- registro e validação das atividades diárias dos servidores em teletrabalho;
- fechamento e emissão de relatórios mensais por dia trabalhado, para acompanhar a Folha de Frequência Individual;
- cadastro, acompanhamento e aferição das metas dos Planos de Trabalho Institucionais (PTI);
- geração dos documentos institucionais do ciclo anual (Anexo III e Relatório de Metas).

O sistema é o *system of record* das atividades, metas e evidências. O **SEI permanece o system of record jurídico** — o sistema referencia números de documento SEI, não os substitui.

---

## 2. Base normativa

| Norma | O que rege |
|---|---|
| Decreto nº 59.755/2020 | Institui o teletrabalho no município |
| Portaria SEGES nº 63/2023 | Anexo I (Termo de Adesão), Anexo II (Termo de Desligamento), Anexo III (Plano de Trabalho); art. 9º (deveres do servidor) |
| Portaria SMUL nº 164/2023 | Art. 3º — regime permanente em SMUL |
| Ordem Interna SMUL nº 01/2024 | Arts. 8º e 9º — avaliação e renovação dos planos |
| Orientações para formalização do teletrabalho nas unidades de SMUL (v1.0, fev/2024) | Fluxo operacional, construção de metas e indicadores, estoque de processos físicos |

> **Pendência:** o texto integral da Portaria SEGES nº 63/2023 e do Decreto 59.755/2020 não foi analisado (os documentos disponíveis apenas os referenciam). Confirmar antes do congelamento dos requisitos se há previsão de critérios de pontuação ou avaliação escalar de desempenho.

---

## 3. Glossário

| Termo | Definição |
|---|---|
| **PTI** | Plano de Trabalho Institucional — instrumento anual, por unidade, que torna a área elegível ao teletrabalho |
| **Meta** | Resultado pretendido ao final da vigência do plano, expresso em um indicador |
| **Indicador** | Variável de mensuração da meta. **Exatamente um por meta** |
| **Valor-base** | Valor conhecido do indicador em data determinada, usado como parâmetro |
| **Valor-meta** | Valor que se pretende alcançar ao término da vigência |
| **Aferição** | Período de apuração dos dados: 01/01 a 31/12 do exercício |
| **Vigência do plano** | Da data do Despacho Autorizatório até 31/12 do mesmo ano (≠ período de aferição) |
| **Registro diário** | Lançamento das atividades executadas por um servidor em um dia de teletrabalho |
| **Fechamento mensal** | Ato da chefia que consolida e congela os registros do mês |
| **Pontuação** | Métrica interna de esforço por atividade. **Não é indicador normativo** |

---

## 4. Atores e perfis

| Perfil | Permissões |
|---|---|
| **Servidor** | Registrar e enviar seus próprios registros diários; consultar sua escala, seu histórico e seu relatório mensal |
| **Chefia imediata** | Tudo do servidor + validar/devolver registros da equipe; gerenciar escala e plantão; executar o fechamento mensal |
| **Coordenador/Chefe de unidade** | Elaborar e submeter o PTI; lançar apurações de meta; consultar painel da unidade |
| **APPGG** | Analisar planos, emitir parecer com os quatro quesitos, solicitar ajustes |
| **Gabinete** | Registrar o Despacho Autorizatório |
| **CAF/DGP** | Controlar termos de adesão/desligamento; consolidar relatórios mensais; gerir cadastro de servidores |
| **Administrador** | Configurações globais, catálogos, calendário de feriados, auditoria |

---

## 5. Requisitos funcionais

Prioridade: **P0** bloqueante · **P1** essencial · **P2** importante · **P3** desejável

### 5.1 Módulo 1 — Cadastros e base

| ID | Requisito | Pri |
|---|---|---|
| RF-01 | Cadastrar unidades com hierarquia (coordenadoria → divisão), sigla, EH e chefia responsável | P0 |
| RF-02 | Cadastrar servidores com RF, nome, cargo/função, e-mail funcional, telefone **setorial** e unidade de lotação | P0 |
| RF-03 | Cadastrar exercícios (anos) e controlar o exercício corrente | P0 |
| RF-04 | Manter calendário de feriados nacionais, municipais e pontos facultativos, por exercício | P0 |
| RF-05 | Disponibilizar serviço de cálculo de dias úteis entre datas, considerando o calendário de RF-04 | P0 |
| RF-06 | Cadastrar cargos por unidade | P0 |
| RF-07 | Cadastrar categorias de atividade como entidade (não texto livre), com ordem de exibição | P1 |
| RF-08 | Cadastrar atividades com descrição, categoria e situação (ativa/inativa) | P0 |
| RF-09 | Associar atividades a cargos com pontuação e vigência **próprias da associação** | P0 |
| RF-10 | Importar catálogo de atividades a partir de planilha, para carga inicial das unidades | P3 |

### 5.2 Módulo 2 — Plano de Trabalho Institucional

| ID | Requisito | Pri |
|---|---|---|
| RF-11 | Elaborar PTI por unidade e exercício, com todos os campos do Anexo III | P1 |
| RF-12 | Cadastrar atividades do plano e suas tarefas a serem realizadas | P1 |
| RF-13 | Cadastrar metas com título, descrição e prazo | P1 |
| RF-14 | Cadastrar **um** indicador por meta, com fórmula de cálculo, valor-base, fonte do valor-base, valor-meta e unidade | P1 |
| RF-15 | Anexar ao valor-base o documento comprobatório (nº SEI, arquivo ou link) | P1 |
| RF-16 | Marcar meta como cumulativa plurianual, informando o exercício inicial do acúmulo | P1 |
| RF-17 | Registrar a relação do plano com outros instrumentos (Programa de Metas, PPA, RT, Bonificação) ou "Não se aplica" | P2 |
| RF-18 | Registrar demonstração do estoque de processos físicos (inexistência, redução de 20% ou meta específica de redução) | P2 |
| RF-19 | Relacionar servidores elegíveis ao plano | P1 |
| RF-20 | Registrar escala de comparecimento, janela de disponibilidade e horário de almoço por servidor | P1 |
| RF-21 | Registrar condições específicas e observações adicionais | P2 |
| RF-22 | Tramitar o plano pela máquina de estados do fluxo SMUL (RN-20) | P1 |
| RF-23 | Registrar Parecer da APPGG com os quatro quesitos avaliados e a conclusão | P2 |
| RF-24 | Registrar Despacho Autorizatório com data — que inicia a vigência do plano | P1 |
| RF-25 | Exportar o plano no formato do documento modelo do SEI, pronto para inserção | P2 |
| RF-26 | Renovar plano do exercício seguinte a partir de cópia do anterior, com valores-base recalculados | P2 |

### 5.3 Módulo 3 — Adesão e escala

| ID | Requisito | Pri |
|---|---|---|
| RF-27 | Registrar Termo de Adesão por servidor: data de assinatura, data de ciência da chefia e situação | P1 |
| RF-28 | Registrar Termo de Desligamento: data, iniciativa (servidor ou chefia) e motivo | P1 |
| RF-29 | Configurar regime de escala por unidade: nº de dias remotos/presenciais, grupos de rodízio e dia de presença integral | P1 |
| RF-30 | Calcular e exibir a escala de cada servidor em calendário mensal, resolvida contra o calendário de feriados | P1 |
| RF-31 | Permitir exceções pontuais de escala (troca de dia), com justificativa e aprovação da chefia | P2 |
| RF-32 | Gerenciar escala de plantão presencial, com auto-candidatura restrita aos dias presenciais do servidor | P2 |
| RF-33 | Registrar agenda de compromissos da unidade (reuniões, comissões) no calendário | P3 |

### 5.4 Módulo 4 — Registro diário de atividades

| ID | Requisito | Pri |
|---|---|---|
| RF-34 | Registrar as atividades executadas em um dia de teletrabalho, informando atividade e quantidade | P0 |
| RF-35 | Restringir as atividades ofertadas às vigentes para o cargo do servidor na data do registro | P0 |
| RF-36 | Calcular a pontuação total **no servidor**, a partir das atividades e quantidades | P0 |
| RF-37 | Registrar processos analisados, dificuldades encontradas e observações | P1 |
| RF-38 | Registrar motivo de atraso e indicação de compensação em lançamento retroativo | P1 |
| RF-39 | Tramitar o registro por RASCUNHO → ENVIADO → VALIDADO / DEVOLVIDO | P0 |
| RF-40 | Permitir à chefia validar ou devolver registros em lote, com justificativa na devolução | P1 |
| RF-41 | Notificar o servidor sobre registro devolvido e sobre prazo de preenchimento vencido | P2 |
| RF-42 | Exibir ao servidor painel com dias pendentes de registro no mês corrente | P2 |

### 5.5 Módulo 5 — Fechamento e relatório mensal

| ID | Requisito | Pri |
|---|---|---|
| RF-43 | Executar o fechamento mensal por unidade, congelando os registros da competência | P1 |
| RF-44 | Bloquear o fechamento enquanto houver registros em RASCUNHO ou ENVIADO na competência | P1 |
| RF-45 | Gerar relatório mensal individual, listando por dia trabalhado: data, atividades, quantidades, pontuação, processos e observações | P1 |
| RF-46 | Gerar relatório mensal consolidado da unidade, para assinatura da chefia e envio à CAF/DGP com a Folha de Frequência | P1 |
| RF-47 | Exportar relatórios em PDF e XLSX | P1 |
| RF-48 | Reabrir competência fechada mediante justificativa registrada em auditoria | P2 |
| RF-49 | Consultar histórico de fechamentos e relatórios emitidos | P2 |

### 5.6 Módulo 6 — Controle de metas

| ID | Requisito | Pri |
|---|---|---|
| RF-50 | Vincular atividades do catálogo às metas do PTI, com fator de contribuição para o indicador | P2 |
| RF-51 | Gerar apuração automática por competência, agregando os registros validados vinculados a cada meta | P2 |
| RF-52 | Lançar apuração manual, com valor, data e evidência obrigatória | P1 |
| RF-53 | Ingerir apurações por conector externo (ex.: relatório de metadados atualizados do GeoNetwork, caixa institucional, registros de cursos) | P3 |
| RF-54 | Anexar evidências à apuração: link, nº de documento SEI, arquivo ou print | P1 |
| RF-55 | Exibir painel de acompanhamento por meta: realizado × valor-meta, série histórica e percentual de atingimento | P1 |
| RF-56 | Projetar o atingimento até 31/12 com base no ritmo apurado e sinalizar meta em risco | P2 |
| RF-57 | Consolidar metas cumulativas plurianuais somando as apurações desde o exercício inicial | P2 |
| RF-58 | Gerar o Relatório de Metas anual (descrição, metodologia, aferição, observações e tabela síntese por meta) | P2 |
| RF-59 | Exibir painel comparativo entre unidades, para uso do Gabinete e da APPGG | P3 |

---

## 6. Regras de negócio

### Cadastro e catálogo

- **RN-01** Um cargo deve possuir no mínimo 1 e no máximo N atividades vigentes. Cargo sem atividade vigente não pode ser ativado.
- **RN-02** Uma atividade pode estar associada a 0 ou N cargos.
- **RN-03** A pontuação é atributo da **associação cargo × atividade**, não da atividade. A mesma atividade pode valer pontuações diferentes em cargos diferentes.
- **RN-04** Alterar pontuação não sobrescreve o valor anterior: encerra-se a vigência corrente e cria-se nova associação. Registros anteriores permanecem inalterados.
- **RN-05** Atividade referenciada por algum registro não pode ser excluída, apenas inativada.

### Registro diário

- **RN-06** Um registro por servidor por dia (chave única servidor + data).
- **RN-07** Só é permitido registrar em data que a escala do servidor classifique como teletrabalho, excluídos fins de semana e feriados.
- **RN-08** Só pode registrar servidor com Termo de Adesão vigente e plano autorizado na data.
- **RN-09** Prazo padrão de preenchimento: até o primeiro dia útil seguinte. Após o prazo, motivo de atraso passa a ser obrigatório.
- **RN-10** A pontuação total é sempre recalculada no servidor; valor recebido do cliente é ignorado.
- **RN-11** No lançamento, gravam-se em snapshot a descrição e a pontuação unitária vigentes.
- **RN-12** Registro VALIDADO só pode ser alterado por devolução da chefia, com justificativa.
- **RN-13** Exclusão é lógica (soft delete), com autor, data e motivo.

### Fechamento mensal

- **RN-14** O fechamento é por unidade e competência, e exige todos os registros da competência em VALIDADO.
- **RN-15** Registros de competência fechada tornam-se imutáveis.
- **RN-16** A reabertura exige justificativa e gera novo evento de auditoria; o relatório anterior é preservado com sua versão.

### Plano de trabalho e metas

- **RN-17** Cada meta possui exatamente um indicador.
- **RN-18** Valor-base e valor-meta são obrigatórios; o valor-base exige fonte comprobatória anexada.
- **RN-19** A vigência do plano vai da data do Despacho Autorizatório a 31/12 do mesmo ano e nunca excede 12 meses. O período de aferição vai de 01/01 a 31/12 do exercício e **não se confunde com a vigência**.
- **RN-20** Estados do plano: `RASCUNHO → JUSTIFICATIVA_ENVIADA → EM_ANALISE_PRELIMINAR → AJUSTES_SOLICITADOS → PLANO_INSERIDO → PARECER_EMITIDO → AUTORIZADO → VIGENTE → EM_AVALIACAO → ENCERRADO`. `AJUSTES_SOLICITADOS` retorna a `RASCUNHO`.
- **RN-21** Metas devem ser mensuráveis. O sistema bloqueia declarações genéricas de propósito (ex.: "envidar esforços na melhoria contínua", "cumprir com zelo suas obrigações"), conforme vedação das Orientações.
- **RN-22** Meta cumulativa plurianual acumula as apurações desde o exercício inicial declarado; a virada de exercício não zera o realizado.
- **RN-23** Toda apuração exige ao menos uma evidência.
- **RN-24** A pontuação de atividades **não constitui indicador de meta** e não pode ser usada como valor-meta no PTI.

### Tipos de indicador suportados

| Tipo | Cálculo | Exemplo real |
|---|---|---|
| `CONTAGEM_ABSOLUTA` | soma das apurações no exercício | 4 Informes Urbanos em 2026 |
| `ACUMULADO` | soma desde o exercício inicial | 414 metadados cumulativos (2024–2026) |
| `PERCENTUAL_UNIVERSO` | realizado ÷ universo × 100 | 25% dos metadados da intranet |
| `PERCENTUAL_SLA` | itens dentro do prazo ÷ universo válido × 100 | 80% dos e-mails respondidos em até 2 dias úteis |
| `TEMPO_MEDIO` | média do tempo apurado | tempo médio de devolutiva |
| `RAZAO` | razão entre duas variáveis | processos por servidor |

- **RN-25** No `PERCENTUAL_SLA`, o universo considera apenas itens recebidos na janela declarada (ex.: seg–sex, 08h–17h) e o prazo é contado em dias úteis pelo calendário de RF-04.

### Proteção de dados

- **RN-26** Não são armazenados endereço residencial nem telefone pessoal. Apenas telefone setorial.
- **RN-27** Termos de adesão e desligamento têm apenas metadados no sistema (datas, situação, responsável pela coleta). Os documentos assinados permanecem sob custódia da CAF/DGP, fora do processo público.
- **RN-28** O acesso a registros diários é restrito ao próprio servidor, sua chefia imediata, a coordenação da unidade e CAF/DGP.

---

## 7. Requisitos não funcionais

### Segurança

| ID | Requisito | Pri |
|---|---|---|
| RNF-01 | Autenticação individual obrigatória para todos os perfis, preferencialmente integrada ao AD/SSO da PMSP | P0 |
| RNF-02 | Sessão mantida em cookie `httpOnly` assinado no servidor. Perfil e permissões **nunca** derivados de dado enviado pelo cliente | P0 |
| RNF-03 | Toda rota da API protegida por middleware de autenticação e autorização por perfil | P0 |
| RNF-04 | Nenhum segredo em variável exposta ao bundle do cliente | P0 |
| RNF-05 | Operações de escrita granulares por recurso. Vedado o padrão "apaga tudo e recria" em endpoints de coleção | P0 |
| RNF-06 | Validação de payload no servidor em todas as rotas de escrita | P0 |

### Auditoria e integridade

| ID | Requisito | Pri |
|---|---|---|
| RNF-07 | Trilha de auditoria imutável para criação, alteração, validação, exclusão, fechamento e reabertura, com ator, data e estado anterior | P0 |
| RNF-08 | Integridade referencial por chave estrangeira em todos os relacionamentos | P0 |
| RNF-09 | Datas persistidas como tipo temporal (`DATE`/`DATETIME`), nunca como texto | P0 |
| RNF-10 | Índices em todas as chaves de busca dos painéis (servidor, unidade, data, competência, meta) | P1 |
| RNF-11 | Migrations versionadas; `migrate deploy` em produção | P1 |
| RNF-12 | Rotina de backup e procedimento de restauração documentado | P1 |

### Desempenho e operação

| ID | Requisito | Pri |
|---|---|---|
| RNF-13 | Listagens paginadas e filtradas no servidor. Nenhuma tela carrega a base completa | P1 |
| RNF-14 | Painéis respondem em até 2s para uma unidade em um exercício | P2 |
| RNF-15 | Suporte multiunidade desde a primeira versão: catálogos, cargos, escalas e metas são por unidade, nunca globais | P0 |
| RNF-16 | Interface responsiva e acessível (contraste e navegação por teclado) | P2 |
| RNF-17 | Idioma pt-BR; datas em `dd/mm/aaaa`; fuso `America/Sao_Paulo` | P1 |

### Arquitetura sugerida

- **Frontend/Backend:** Next.js (App Router) + TypeScript, com Server Actions e autorização no servidor por padrão
- **ORM/Banco:** Prisma + MySQL
- **Autenticação:** AD/SSO PMSP
- **Componentes:** React + Tailwind (aproveitáveis do protótipo ATECC)

---

## 8. Entidades do modelo de dados

| Entidade | Observação |
|---|---|
| `Unidade` | Hierárquica (self-relation) |
| `Servidor` | RF único; sem dados pessoais sensíveis |
| `Cargo` | Por unidade |
| `CategoriaAtividade` | Entidade, não texto livre |
| `Atividade` | 0..N cargos |
| `CargoAtividade` | Associação N:N com `pontuacao` e vigência |
| `Exercicio` | Ano de referência |
| `PlanoTrabalho` | Unidade × exercício; nº SEI, CRC, vigência, estado |
| `AtividadePlano` / `TarefaPlano` | Atividades e tarefas declaradas no Anexo III |
| `Meta` | Cumulativa ou não; exercício inicial |
| `Indicador` | 1:1 com meta; tipo, fórmula, valor-base, valor-meta |
| `Apuracao` | Competência, valor, origem |
| `Evidencia` | Link, doc SEI, arquivo ou print |
| `Parecer` | Quatro quesitos + conclusão |
| `Despacho` | Autorizatório; define início da vigência |
| `Elegibilidade` | Servidor × plano |
| `TermoAdesao` / `TermoDesligamento` | Apenas metadados |
| `RegimeEscala` | Configuração de rodízio por unidade |
| `EscalaServidor` | Grupo, janela de disponibilidade, almoço |
| `ExcecaoEscala` | Troca de dia com aprovação |
| `Plantao` | Escala presencial |
| `Feriado` | Nacional, municipal, ponto facultativo |
| `RegistroDiario` | Único por servidor + data; estado; pontuação total |
| `AtividadeRegistro` | Item do registro, com snapshot de descrição e pontuação |
| `FechamentoMensal` | Unidade × competência; congelamento |
| `RelatorioEmitido` | Versão do documento gerado |
| `AuditLog` | Imutável |

---

## 9. Premissas e restrições

- O SEI não possui integração automatizada disponível nesta fase. A referência é manual (nº do documento e CRC).
- Os documentos assinados dos termos individuais não trafegam pelo sistema.
- A pontuação por atividade é convenção interna de cada unidade, não decorre de norma.
- O catálogo de atividades da ATECC é ponto de partida, mas cada unidade terá o seu.
- O sistema não substitui a Folha de Frequência Individual; produz o relatório que a acompanha.

## 10. Fora de escopo (v1)

- Controle de ponto e apuração de jornada
- Integração com folha de pagamento e Bonificação por Resultados
- Assinatura digital de documentos (permanece no SEI)
- Aplicativo móvel nativo

---

## 11. Roadmap

| Fase | Conteúdo | Requisitos |
|---|---|---|
| **1** | Base, catálogo N:N, registro diário com validação, fechamento e relatório mensal, segurança P0 | RF-01 a RF-10, RF-27 a RF-30, RF-34 a RF-49, RNF-01 a RNF-09 |
| **2** | PTI, metas, indicadores, apuração manual e painel | RF-11 a RF-26, RF-52, RF-54, RF-55 |
| **3** | Costura registro → meta, geradores do Anexo III e do Relatório de Metas | RF-50, RF-51, RF-56 a RF-58 |
| **4** | Conectores externos, painel comparativo, rollout às demais coordenadorias | RF-53, RF-59 |

---

## 12. Questões em aberto

1. Uma atividade pode estar vinculada a **0 ou N metas** ou a no máximo uma? A resposta define se `metaId` é campo em `Atividade` ou se há tabela de junção `AtividadeMeta` com fator de contribuição.
2. A Portaria SEGES nº 63/2023 prevê algum critério de pontuação ou avaliação escalar de desempenho? (texto integral ainda não analisado)
3. O prazo de preenchimento do registro diário é decisão da SMUL ou de cada unidade?
4. O relatório mensal exige assinatura da chefia no SEI ou basta o envio à CAF/DGP junto da folha de frequência?
5. A escala é sempre 2 remotos / 3 presenciais ou varia por unidade?
6. Há previsão de acesso da APPGG e do Gabinete ao registro diário individual, ou apenas aos consolidados?
