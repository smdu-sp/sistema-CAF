import { HdApp } from '../../_components/hd-app';
import { verificarAcessoPaginaHelpdesk } from '@/lib/helpdesk/verificar-acesso-pagina';

export default async function ChamadosAcessoSistemasPage() {
  await verificarAcessoPaginaHelpdesk('chamados');
  return <HdApp initialView="chamados" initialArea="acesso_sistemas" />;
}
