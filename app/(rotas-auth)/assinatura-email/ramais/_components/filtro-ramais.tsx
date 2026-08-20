"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function FiltroRamais({ valorInicial }: { valorInicial: string }) {
  const [q, setQ] = useState(valorInicial);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    params.set("pagina", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 max-w-md">
      <Input
        placeholder="Buscar por login ou ramal"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <Button type="submit" variant="outline">
        Filtrar
      </Button>
    </form>
  );
}
