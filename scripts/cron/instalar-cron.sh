#!/usr/bin/env bash
# Registra o cron diário para autorizar solicitações de acesso pendentes.
# Executar no servidor Linux, na pasta do projeto:
#   bash scripts/cron/instalar-cron.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
CRON_SCRIPT="$PROJECT_ROOT/scripts/cron/autorizar-acesso-pendentes.sh"
CRON_LINE="0 6 * * * PROJECT_ROOT=$PROJECT_ROOT bash $CRON_SCRIPT"
MARKER="# helpdesk-autorizar-acesso-pendentes"

chmod +x "$CRON_SCRIPT"

if ! command -v crontab >/dev/null 2>&1; then
  echo "Erro: crontab não encontrado. Instale o pacote cron no servidor." >&2
  exit 1
fi

if [[ ! -f "$PROJECT_ROOT/.env" ]]; then
  echo "Aviso: $PROJECT_ROOT/.env não encontrado. Defina CRON_SECRET antes do primeiro disparo." >&2
fi

if ! grep -qF "$MARKER" <<< "$(crontab -l 2>/dev/null || true)"; then
  (
    crontab -l 2>/dev/null || true
    echo ""
    echo "$MARKER"
    echo "$CRON_LINE"
  ) | crontab -
  echo "Cron instalado: diariamente às 06:00"
else
  echo "Cron já instalado (marcador $MARKER encontrado)."
fi

echo "Script: $CRON_SCRIPT"
echo "Log: /var/log/helpdesk/autorizar-acesso-pendentes.log"
echo ""
echo "Teste manual:"
echo "  bash $CRON_SCRIPT"
echo ""
echo "Ver log:"
echo "  tail -f /var/log/helpdesk/autorizar-acesso-pendentes.log"
