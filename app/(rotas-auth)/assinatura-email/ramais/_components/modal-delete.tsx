"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function ModalDelete({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  async function handleAction() {
    const res = await fetch(`/api/assinatura-email/ramais/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error("Erro", { description: data.error });
      return;
    }
    toast.success("Ramal excluído com sucesso");
    window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="hover:bg-destructive cursor-pointer hover:text-white group transition-all ease-linear duration-200"
        >
          <Trash2 size={24} className="text-destructive dark:text-white group-hover:text-white group" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Ramal</DialogTitle>
        </DialogHeader>
        <p>Tem certeza que deseja excluir este ramal de grupo?</p>
        <DialogFooter>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button id="close" variant="outline">
                Voltar
              </Button>
            </DialogClose>
            <Button
              disabled={isPending}
              onClick={() => startTransition(() => handleAction())}
              type="button"
              variant="destructive"
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Deletar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
