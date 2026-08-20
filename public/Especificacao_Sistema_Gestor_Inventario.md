# Sistema de Gestão de Inventário (Projeto)

## Objetivo

Desenvolver um sistema moderno de inventário de ativos de TI, inspirado no FusionInventory, porém sem depender de plugins pesados instalados em cada computador. O sistema deve realizar descoberta automática da infraestrutura, inventário de hardware e software, controle patrimonial e gestão completa do ciclo de vida dos equipamentos.

---

# Arquitetura

## Descoberta sem agente

Sempre que possível, utilizar protocolos nativos da rede:

- WMI
- WinRM
- SMB
- LDAP / Active Directory
- SNMP
- SSH (Linux)
- PowerShell Remoting

Com isso será possível coletar:

- Nome do computador
- IP
- MAC Address
- Sistema Operacional
- Fabricante
- Modelo
- Número de Série
- Patrimônio
- Processador
- Memória RAM
- Discos
- Espaço livre
- Monitores
- Impressoras
- Serviços
- Compartilhamentos
- Softwares instalados
- Uptime
- Usuário logado
- Status Online/Offline

---

# Descoberta automática

Fluxo:

1. Escanear sub-redes cadastradas.
2. Identificar dispositivos ativos.
3. Classificar o tipo de equipamento.
4. Coletar informações automaticamente.
5. Atualizar o banco de dados.
6. Registrar alterações no histórico.

---

# Inventário de Hardware

Cada equipamento deve possuir:

- Nome
- Hostname
- IP
- MAC
- Fabricante
- Modelo
- Número de Série
- Patrimônio
- CPU
- RAM
- Discos
- Monitores
- Placa-mãe
- BIOS
- Placa de vídeo
- Adaptadores de rede
- Sistema Operacional
- Versão
- Build

---

# Inventário de Software

Registrar:

- Nome
- Fabricante
- Versão
- Data de instalação
- Caminho executável
- Atualizações
- Licença (quando disponível)

Relatórios:

- Máquinas com software específico
- Softwares desatualizados
- Softwares proibidos
- Softwares sem licença

---

# Usuários

Detectar automaticamente:

- Usuário logado
- Domínio
- Setor
- Unidade
- Último login

Permitir associação manual quando necessário.

---

# Histórico

Registrar toda alteração:

- Troca de usuário
- Mudança de setor
- Upgrade de RAM
- Troca de HD
- Atualizações do SO
- Instalação de software
- Alteração de IP
- Alteração de hostname

Nunca apagar informações históricas.

---

# Patrimônio

Campos:

- Número patrimonial
- Número de série
- Nota Fiscal
- Data de compra
- Garantia
- Fornecedor
- Centro de custo
- Situação
- Fotos
- Documentos anexos

---

# Localização

Estrutura:

- Prédio
- Andar
- Sala
- Mesa

Histórico de movimentações.

---

# QR Code

Cada equipamento possuirá:

- QR Code
- Código interno

Ao escanear:

- Dados completos
- Histórico
- Garantia
- Chamados
- Documentos

---

# Dashboard

Indicadores:

- Total de computadores
- Notebooks
- Servidores
- Switches
- Impressoras
- Equipamentos offline
- Equipamentos críticos
- Espaço em disco
- Windows desatualizados
- Softwares proibidos

---

# Alertas

Gerar alertas para:

- Disco cheio
- RAM insuficiente
- Máquina offline
- Novo software instalado
- Hardware alterado
- Usuário alterado
- Garantia próxima do vencimento
- Equipamento sem comunicação

---

# Agente opcional

Criar um agente extremamente leve para cenários onde a coleta remota não seja suficiente.

Funções:

- SMART detalhado
- Temperatura
- Processos
- Logs
- Inventário fora da rede
- Sincronização automática

---

# Arquitetura Técnica

## Frontend

- Next.js
- MUI / Joy UI
- TanStack Table
- React Query
- Chart.js

## Backend

- NestJS
- Prisma
- PostgreSQL

## Infraestrutura

- BullMQ
- Redis
- Workers paralelos

---

# Diferenciais

- Sem dependência obrigatória de agentes.
- Descoberta automática da rede.
- Histórico completo.
- Interface moderna.
- Controle patrimonial integrado.
- API REST.
- Integração com Active Directory.
- Integração futura com Microsoft 365.
- QR Codes.
- Relatórios PDF/Excel.
- Controle de licenças.
- Gestão de garantia.
- Inventário de periféricos.
- Portal do usuário.
- Mapa de localização dos ativos.
- Integração com sistemas de chamados.

---

# Roadmap

## Fase 1
- Descoberta da rede
- Inventário de hardware
- Inventário de software
- Dashboard
- Cadastro de patrimônio

## Fase 2
- Histórico
- Alertas
- QR Code
- Localização
- Relatórios

## Fase 3
- Agente opcional
- Integração Microsoft 365
- Controle de licenças
- API pública
- Aplicativo mobile
