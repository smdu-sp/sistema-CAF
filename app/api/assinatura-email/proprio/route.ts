import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buscarPerfilCompleto,
  obterUsuarioAutenticado,
  podeGerarAssinatura,
} from "@/lib/assinatura-email/auth";

export async function GET() {
  const usuario = await obterUsuarioAutenticado();
  if (!usuario?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!(await podeGerarAssinatura())) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const { perfil, ramalGrupo } = await buscarPerfilCompleto(usuario.id, usuario.login);
  return NextResponse.json({
    id: usuario.id,
    nome: perfil?.nomeExibicao || usuario.nome,
    email: usuario.email,
    login: usuario.login,
    cargo: perfil?.cargo ?? "",
    setorId: perfil?.setorId ?? "",
    andar: perfil?.andar ?? "",
    aniversario: perfil?.aniversario ?? "",
    ramal: ramalGrupo || perfil?.ramal || "",
  });
}

export async function PUT(request: Request) {
  const usuario = await obterUsuarioAutenticado();
  if (!usuario?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!(await podeGerarAssinatura())) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  let body: {
    nomeExibicao?: string;
    cargo?: string;
    setorId?: string;
    andar?: string;
    aniversario?: string;
    ramal?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  const cargo = typeof body.cargo === "string" ? body.cargo.trim() : "";
  const setorId = typeof body.setorId === "string" ? body.setorId.trim() : "";
  const andar = typeof body.andar === "string" ? body.andar.trim() : "";
  const ramal = typeof body.ramal === "string" ? body.ramal.trim() : "";
  const aniversario =
    typeof body.aniversario === "string" ? body.aniversario.trim() : "";
  const nomeExibicao =
    typeof body.nomeExibicao === "string" ? body.nomeExibicao.trim() : "";

  if (!cargo || !setorId || !andar || !ramal) {
    return NextResponse.json(
      { error: "Cargo, unidade, andar e ramal são obrigatórios." },
      { status: 400 },
    );
  }

  const setor = await prisma.assinaturaSetor.findUnique({ where: { id: setorId } });
  if (!setor || !setor.ativo) {
    return NextResponse.json({ error: "Unidade selecionada não encontrada." }, { status: 400 });
  }

  const perfil = await prisma.assinaturaPerfil.upsert({
    where: { usuarioId: usuario.id },
    create: {
      usuarioId: usuario.id,
      nomeExibicao: nomeExibicao || usuario.nome,
      cargo,
      setorId,
      andar,
      ramal,
      aniversario: aniversario || null,
    },
    update: {
      nomeExibicao: nomeExibicao || usuario.nome,
      cargo,
      setorId,
      andar,
      ramal,
      aniversario: aniversario || null,
    },
  });

  return NextResponse.json({ message: "Dados da assinatura salvos.", perfil });
}
