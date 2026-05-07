import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold">404 - Página Não Encontrada</h1>
      <p className="text-lg text-gray-600">Ops! A página que você procura não existe.</p>
        <Link href="/"><Button variant="outline">Voltar para a página inicial</Button></Link>
    </div>
  );
}