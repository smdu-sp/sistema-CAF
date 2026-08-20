import { HdApp } from '../../_components/hd-app';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';
import { isTipoChamado, type TipoChamado } from '@/lib/helpdesk/tipos-chamado';

export default async function NovoChamadoPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; modo?: string }>;
}) {
  await verificarAcessoPaginaHelpdesk('chamados');
  const { area, modo } = await searchParams;
  const initialArea: TipoChamado | undefined =
    area && isTipoChamado(area) ? area : undefined;
  const initialView = modo === 'tecnico' ? 'novo-chamado' : 'novo-chamado-assistente';
  return <HdApp initialView={initialView} initialArea={initialArea} />;
}
