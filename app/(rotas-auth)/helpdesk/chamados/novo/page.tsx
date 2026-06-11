import { HdApp } from '../../_components/hd-app';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';
import { isTipoChamado, type TipoChamado } from '@/lib/helpdesk/tipos-chamado';

export default async function NovoChamadoPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  await verificarAcessoPaginaHelpdesk('chamados');
  const { area } = await searchParams;
  const initialArea: TipoChamado | undefined =
    area && isTipoChamado(area) ? area : 'suporte_tecnico';
  return <HdApp initialView="novo-chamado" initialArea={initialArea} />;
}
