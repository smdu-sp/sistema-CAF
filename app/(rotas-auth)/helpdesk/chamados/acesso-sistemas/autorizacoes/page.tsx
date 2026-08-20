import { PainelAutorizacoesAcesso } from '@/app/(rotas-auth)/helpdesk/_components/acesso-sistemas/painel-autorizacoes';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';

export default async function AutorizacoesAcessoPage() {
  await verificarAcessoPaginaHelpdesk('chamados');
  return <PainelAutorizacoesAcesso />;
}
