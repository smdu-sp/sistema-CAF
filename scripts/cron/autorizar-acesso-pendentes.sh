#!/usr/bin/env bash
# Autoriza solicitações de acesso sem negativa após 7 dias.
# Uso manual: ./scripts/cron/autorizar-acesso-pendentes.sh
# Agendamento: scripts/cron/instalar-cron.sh (ou crontab.example)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="${ENV_FILE:-$PROJECT_ROOT/.env}"
LOG_DIR="${LOG_DIR:-/var/log/helpdesk}"
LOG_FILE="${LOG_FILE:-$LOG_DIR/autorizar-acesso-pendentes.log}"

ler_var_env() {
  local chave="$1"
  if [[ ! -f "$ENV_FILE" ]]; then
    return 0
  fi
  grep -E "^${chave}=" "$ENV_FILE" 2>/dev/null | tail -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//" | tr -d '\r'
}

CRON_SECRET="$(ler_var_env CRON_SECRET)"
APP_URL="$(ler_var_env NEXTAUTH_URL)"
if [[ -z "$APP_URL" ]]; then
  APP_URL="$(ler_var_env APP_URL)"
fi
if [[ -z "$APP_URL" ]]; then
  APP_URL="http://127.0.0.1:3000"
fi
APP_URL="${APP_URL%/}"

if [[ -z "$CRON_SECRET" ]]; then
  echo "[$(date -Is)] ERRO: CRON_SECRET não definido em $ENV_FILE" >&2
  exit 1
fi

if ! mkdir -p "$LOG_DIR" 2>/dev/null; then
  LOG_DIR="$PROJECT_ROOT/logs/cron"
  LOG_FILE="$LOG_DIR/autorizar-acesso-pendentes.log"
  mkdir -p "$LOG_DIR"
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "[$(date -Is)] ERRO: curl não instalado no servidor" >&2
  exit 1
fi

ENDPOINT="${APP_URL}/api/helpdesk/acesso-sistemas/jobs/autorizar-pendentes"
TIMESTAMP="$(date -Is)"

{
  echo "[$TIMESTAMP] Chamando $ENDPOINT"
  HTTP_CODE="$(curl -fsS -o /tmp/helpdesk-cron-response.json -w "%{http_code}" \
    -X POST "$ENDPOINT" \
    -H "Authorization: Bearer ${CRON_SECRET}" \
    -H "Content-Type: application/json" \
    --max-time 120)"
  echo "[$TIMESTAMP] HTTP $HTTP_CODE — $(cat /tmp/helpdesk-cron-response.json)"
  rm -f /tmp/helpdesk-cron-response.json
} >> "$LOG_FILE" 2>&1
