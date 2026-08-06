/** @format */

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeAvatar } from "../../_components/shared/employee-avatar";

export function CommentForm() {
  return (
    <div className="flex items-center gap-3 border-t pt-3">
      <EmployeeAvatar name="Voce" className="size-8" />
      <Input placeholder="Escreva um comentario..." />
      <Button size="icon" variant="secondary" aria-label="Enviar comentario">
        <Send className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
