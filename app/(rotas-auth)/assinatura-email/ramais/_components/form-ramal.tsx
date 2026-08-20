"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  usuario: z.string().min(1, "Login é obrigatório"),
  ramalGrupo: z.string().min(1, "Ramal é obrigatório"),
});

export type RamalRow = {
  id: string;
  usuario: string;
  ramalGrupo: string;
};

interface FormRamalProps {
  isUpdating: boolean;
  ramal?: Partial<RamalRow>;
}

export default function FormRamal({ isUpdating, ramal }: FormRamalProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usuario: ramal?.usuario ?? "",
      ramalGrupo: ramal?.ramalGrupo ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        if (isUpdating && ramal?.id) {
          const res = await fetch(`/api/assinatura-email/ramais/${ramal.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuario: values.usuario.trim(),
              ramalGrupo: values.ramalGrupo.trim(),
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            toast.error("Erro ao atualizar", { description: data.error });
            return;
          }
          toast.success("Ramal atualizado");
        } else {
          const res = await fetch("/api/assinatura-email/ramais", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuario: values.usuario.trim(),
              ramalGrupo: values.ramalGrupo.trim(),
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            toast.error("Erro ao cadastrar", { description: data.error });
            return;
          }
          toast.success("Ramal cadastrado");
        }
        window.location.reload();
      } catch {
        toast.error("Falha na comunicação com o servidor");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="usuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input placeholder="Ex: d854440" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ramalGrupo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ramal de grupo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 1154661720" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 items-center justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Voltar
            </Button>
          </DialogClose>
          <Button disabled={isPending} type="submit">
            {isUpdating ? (
              <>
                Atualizar {isPending && <Loader2 className="animate-spin" />}
              </>
            ) : (
              <>
                Adicionar {isPending && <Loader2 className="animate-spin" />}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
