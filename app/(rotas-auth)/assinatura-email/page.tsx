import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FormAssinatura } from "./_components/form-assinatura";

export default async function AssinaturaEmailPage() {
  const session = await auth();
  const usuario = session?.usuario;
  if (!usuario?.id) return null;

  const [perfil, ramalGrupo, setores, cargos] = await Promise.all([
    prisma.assinaturaPerfil.findUnique({ where: { usuarioId: usuario.id } }),
    prisma.assinaturaGrupoRamal.findFirst({
      where: {
        OR: [
          { usuario: usuario.login },
          { usuario: usuario.login.toLowerCase() },
          { usuario: usuario.login.toUpperCase() },
        ],
      },
      select: { ramalGrupo: true },
    }),
    prisma.assinaturaSetor.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.assinaturaCargo.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
  ]);

  return (
    <div className="w-full max-w-3xl mx-auto pb-10">
      <FormAssinatura
        setores={setores}
        cargos={cargos}
        inicial={{
          nome: perfil?.nomeExibicao || usuario.nome,
          email: usuario.email,
          cargo: perfil?.cargo ?? "",
          setorId: perfil?.setorId ?? "",
          andar: perfil?.andar ?? "",
          aniversario: perfil?.aniversario ?? "",
          ramal: ramalGrupo?.ramalGrupo || perfil?.ramal || "",
        }}
      />
    </div>
  );
}
