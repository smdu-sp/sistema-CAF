import { HdApp } from '../_components/hd-app';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';

export default async function RelatoriosPage() {
  await verificarAcessoPaginaHelpdesk('relatorios');
  return <HdApp initialView="relatorios" />;
}
