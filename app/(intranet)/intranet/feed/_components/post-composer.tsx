/** @format */

import { ImageIcon, Megaphone, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeAvatar } from "../../_components/shared/employee-avatar";

export function PostComposer() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <EmployeeAvatar name="Voce" className="size-11" />
          <Textarea placeholder="Compartilhe uma novidade com a intranet..." />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Megaphone />
            Comunicado
          </Button>
          <Button variant="outline" size="sm">
            <ImageIcon />
            Imagem
          </Button>
        </div>
      </CardContent>

      <CardFooter className="justify-end">
        <Button size="sm">
          <Send />
          Publicar
        </Button>
      </CardFooter>
    </Card>
  );
}
