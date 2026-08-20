import Link from "next/link";

export function AcessoNegadoHelpdesk({ mensagem }: { mensagem: string }) {
  return (
    <div className="w-full px-0 md:px-8 pb-20 md:pb-14 md:container mx-auto">
      <h1 className="text-xl md:text-2xl font-bold">Acesso não permitido</h1>
      <p className="text-sm text-muted-foreground mt-2">{mensagem}</p>
      <Link
        href="/home"
        className="inline-block mt-4 text-sm text-primary underline"
      >
        Voltar à página inicial
      </Link>
    </div>
  );
}
