import { redirect } from 'next/navigation';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';

export default async function TransferenciasPage() {
  await verificarAcessoPaginaHelpdesk('patrimonio');
  redirect('/helpdesk/movimentacoes');
}
