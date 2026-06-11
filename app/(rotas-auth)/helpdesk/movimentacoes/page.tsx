import { HdApp } from '../_components/hd-app';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';

export default async function MovimentacoesPage() {
  await verificarAcessoPaginaHelpdesk('patrimonio');
  return <HdApp initialView="movimentacoes" />;
}
