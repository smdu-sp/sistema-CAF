import { redirect } from 'next/navigation';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';

export default async function NovaTransferenciaPage() {
  await verificarAcessoPaginaHelpdesk('patrimonio');
  redirect('/helpdesk/movimentacoes/nova');
}
