/** @format */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RecentActivityProps {
  text?: string;
}

export function RecentActivity({
  text = "Suas atividades recentes aparecerao aqui conforme voce interagir com a intranet.",
}: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas atividades</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
