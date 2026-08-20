import { HdApp } from '@/app/(rotas-auth)/helpdesk/_components/hd-app';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';

export default async function ItemDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  await verificarAcessoPaginaHelpdesk('patrimonio');
  const { id } = await params;
  return <HdApp initialView="item-detalhe" initialId={parseInt(id)} />;
}
