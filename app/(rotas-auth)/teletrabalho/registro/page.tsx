import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import WizardRegistro from "./_components/wizard-registro";

export default async function RegistroPage() {
  const session = await auth();
  const usuarioId = (session as { usuario?: { id?: string } })?.usuario?.id;
  const servidor = usuarioId
    ? await prisma.ttServidor.findUnique({ where: { usuarioId }, select: { id: true } })
    : null;

  return (
    <div className="w-full px-0 md:px-8 pb-20 md:pb-14 h-full md:container mx-auto">
      <WizardRegistro servidorId={servidor?.id ?? null} />
    </div>
  );
}
