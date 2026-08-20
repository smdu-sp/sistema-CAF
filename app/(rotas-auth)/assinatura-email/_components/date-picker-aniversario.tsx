"use client";

import * as React from "react";
import {
  format,
  getDay,
  getDaysInMonth,
  isSameDay,
  setMonth,
  setDate,
  startOfMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DatePickerAniversarioProps {
  value?: string;
  onChange: (dateString: string | undefined) => void;
  disabled?: boolean;
}

function parseValor(value?: string) {
  if (!value) return undefined;
  const match = value.match(/^(\d{2})-(\d{2})$/);
  if (!match) return undefined;
  const day = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  return new Date(2024, month - 1, day);
}

export function DatePickerAniversario({
  value,
  onChange,
  disabled,
}: DatePickerAniversarioProps) {
  const [open, setOpen] = React.useState(false);
  const initialDate = parseValor(value) ?? new Date(2024, 0, 1);
  const [displayDate, setDisplayDate] = React.useState(initialDate);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    parseValor(value),
  );

  React.useEffect(() => {
    const parsed = parseValor(value);
    setSelectedDate(parsed);
    if (parsed) setDisplayDate(parsed);
  }, [value]);

  const generateDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(displayDate);
    const firstDayOfMonth = startOfMonth(displayDate);
    const startingDayOfWeek = getDay(firstDayOfMonth);

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const day = setDate(displayDate, i);
      const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;

      days.push(
        <Button
          key={i}
          type="button"
          variant={isSelected ? "default" : "ghost"}
          className="h-8 w-8 p-0 text-sm rounded-full"
          onClick={() => {
            setSelectedDate(day);
            onChange(format(day, "dd-MM"));
            setOpen(false);
          }}
        >
          {i}
        </Button>,
      );
    }

    return days;
  };

  const formattedDate = selectedDate
    ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
    : "Selecione";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-background",
            !value && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto p-3 [&>button]:hidden">
        <DialogTitle className="hidden">Selecione uma data</DialogTitle>
        <DialogDescription className="hidden">
          Selecione o dia e o mês do aniversário
        </DialogDescription>
        <div className="flex justify-between items-center mb-2">
          <Button
            type="button"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setDisplayDate(setMonth(displayDate, displayDate.getMonth() - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium capitalize">
            {format(displayDate, "MMMM", { locale: ptBR })}
          </span>
          <Button
            type="button"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setDisplayDate(setMonth(displayDate, displayDate.getMonth() + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 mt-2">{generateDays()}</div>
      </DialogContent>
    </Dialog>
  );
}
