/** @format */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { EmployeeAvatar } from "../../_components/shared/employee-avatar";
import { mockBirthdayConfig, mockBirthdays } from "../../_mock";

export type Birthday = (typeof mockBirthdays)[number];

interface BirthdayCardProps {
  birthday: Birthday;
}

export function BirthdayCard({ birthday }: BirthdayCardProps) {
  const isToday = birthday.day === mockBirthdayConfig.today;
  const congratulatorsCount = birthday.congratulators.length;
  const congratulatorsLabel =
    congratulatorsCount === 0
      ? "Seja o primeiro a parabenizar"
      : `${congratulatorsCount} felicitacao${
          congratulatorsCount > 1 ? "es" : ""
        }`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <EmployeeAvatar name={birthday.name} className="size-11" />

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold">
                {birthday.name}
              </h2>
              {isToday && <Badge variant="success">Hoje</Badge>}
            </div>

            <p className="text-sm text-muted-foreground">{birthday.dept}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {birthday.day} de {mockBirthdayConfig.monthLabel}
          </p>
          <p className="text-xs text-muted-foreground">{congratulatorsLabel}</p>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          size="sm"
          variant={birthday.congratulated ? "secondary" : "default"}
          className="w-full"
        >
          {birthday.congratulated ? "Parabenizado" : "Parabenizar"}
        </Button>
      </CardFooter>
    </Card>
  );
}
