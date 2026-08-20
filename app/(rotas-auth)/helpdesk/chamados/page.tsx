import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';
import { redirect } from 'next/navigation';

export default async function ChamadosPage() {
  await verificarAcessoPaginaHelpdesk('chamados');
  redirect('/helpdesk/chamados/suporte-tecnico');
}
