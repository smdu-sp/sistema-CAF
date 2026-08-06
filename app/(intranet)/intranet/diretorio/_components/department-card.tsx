/** @format */

import { Mail, Phone, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IntranetDepartment } from "../../_types/intranet";

interface DepartmentCardProps {
  department: IntranetDepartment;
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-xs font-bold">{department.sigla}</span>
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <CardTitle className="leading-snug">{department.name}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <UserRound className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Responsavel</p>
              <p className="text-muted-foreground">{department.head}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">E-mail</p>
              <p className="break-all text-muted-foreground">
                {department.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Telefone</p>
              <p className="text-muted-foreground">{department.phone}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
