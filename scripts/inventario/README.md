# Coletor de Inventário de TI

Coleta agentless de hardware/software das máquinas da rede, enviando para a rota
de ingestão `POST /api/inventario/coleta`.

## Pré-requisitos

**No servidor (aplicação):**
- Definir a variável de ambiente `INV_COLETA_API_KEY` no `.env` com uma chave forte.
  É ela que o coletor envia no header `X-Api-Key`. Sem ela a rota responde `503`.

**Na máquina que roda o coletor:**
- Windows PowerShell 5.1+.
- Para `-FromAD`: módulo `ActiveDirectory` (RSAT instalado).
- Para coleta remota (`-ComputerName` / `-FromAD`): **WinRM habilitado** nas
  estações-alvo (via GPO: `Enable-PSRemoting`), uma **conta de serviço** com
  direito de administrador remoto, e o firewall liberando a **porta 5985**
  (WinRM HTTP) entre o coletor e as estações.

> O modo `-Local` **não** exige WinRM — inventaria a própria máquina. Use-o para
> testar o pipeline antes de liberar o remoting no parque.

## Uso

```powershell
# 1) Teste imediato — inventaria ESTA máquina e envia (sem WinRM)
.\coletar.ps1 -ApiUrl http://SERVIDOR:3000/api/inventario/coleta -ApiKey "SUA_CHAVE" -Local -IncludeSoftware

# 2) Máquinas específicas (via WinRM)
.\coletar.ps1 -ApiUrl http://SERVIDOR:3000/api/inventario/coleta -ApiKey "SUA_CHAVE" `
  -ComputerName PC-01,PC-02 -Credential (Get-Credential)

# 3) Descoberta automática pelo Active Directory
.\coletar.ps1 -ApiUrl http://SERVIDOR:3000/api/inventario/coleta -ApiKey "SUA_CHAVE" `
  -FromAD -IncludeSoftware -Credential (Get-Credential)
```

### Parâmetros

| Parâmetro          | Descrição                                                        |
|--------------------|------------------------------------------------------------------|
| `-ApiUrl`          | URL da rota de ingestão (obrigatório).                           |
| `-ApiKey`          | Chave `X-Api-Key` = `INV_COLETA_API_KEY` do servidor (obrigatório). |
| `-Local`           | Inventaria só a máquina local (sem WinRM).                       |
| `-ComputerName`    | Lista explícita de hosts.                                        |
| `-FromAD`          | Descobre os computadores via `Get-ADComputer`.                  |
| `-ADFilter`        | Filtro do AD (padrão `Enabled -eq $true`).                      |
| `-IncludeSoftware` | Também coleta softwares instalados (via registro). Mais lento.  |
| `-Credential`      | Credencial para o WinRM remoto.                                 |

## O que é coletado

`Win32_ComputerSystem`, `Win32_OperatingSystem`, `Win32_Processor`, `Win32_BIOS`,
`Win32_SystemEnclosure` (define o tipo: notebook/desktop/servidor), `Win32_BaseBoard`,
`Win32_VideoController`, `Win32_LogicalDisk` (discos fixos) e
`Win32_NetworkAdapterConfiguration` (IP/MAC). Softwares vêm do registro
(`Uninstall`), evitando o `Win32_Product` (lento e dispara reparos de MSI).

## Agendamento (Windows Task Scheduler)

Rodar, por exemplo, a cada 6 horas:

```powershell
$acao = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument '-NoProfile -ExecutionPolicy Bypass -File "C:\inventario\coletar.ps1" -ApiUrl http://SERVIDOR:3000/api/inventario/coleta -ApiKey "SUA_CHAVE" -FromAD -IncludeSoftware'
$gatilho = New-ScheduledTaskTrigger -Once -At 7am -RepetitionInterval (New-TimeSpan -Hours 6)
Register-ScheduledTask -TaskName "Inventario-TI-Coletor" -Action $acao -Trigger $gatilho `
  -User "DOMINIO\conta_servico" -RunLevel Highest
```

## Fila de buscas e o botão "Executar fila agora"

Na tela **Inventário → Solicitar buscas** você enfileira alvos e clica em
**Executar fila agora** — o servidor dispara `coletar.ps1 -FromQueue` (só funciona
se a app rodar em Windows na rede). O coletor também pode ser agendado no modo
`-FromQueue` para consumir a fila periodicamente:

```powershell
.\coletar.ps1 -ApiUrl http://SERVIDOR:3000/api/inventario/coleta -ApiKey "SUA_CHAVE" -FromQueue -IncludeSoftware
```

Dica de teste **sem WinRM**: enfileire o alvo `localhost` (ou o nome da própria
máquina do coletor) — a coleta é feita localmente.

## Como a ingestão trata os dados

A rota identifica o equipamento por **nº de série → MAC → hostname**, atualiza o
registro, grava as mudanças em histórico (IP, RAM, usuário, SO…), substitui o
snapshot de hardware/discos/softwares e, se o nº de série casar com um item de
patrimônio ainda sem equipamento, **vincula automaticamente**.
