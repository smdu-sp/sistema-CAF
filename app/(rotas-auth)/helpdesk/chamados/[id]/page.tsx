import { HdApp } from '@/app/(rotas-auth)/helpdesk/_components/hd-app';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';

export default async function ChamadoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  await verificarAcessoPaginaHelpdesk('chamados');
  const { id } = await params;
  return <HdApp initialView="chamado-detalhe" initialId={parseInt(id)} />;
}
