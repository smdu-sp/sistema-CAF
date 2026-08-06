/** @format */
import { numberToMonth } from "../data/conversorMonths";

export interface BirthdayCardProps {
  nome: string;
  setor: string;
  data_nascimento: {
    day: number;
    month: number;
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function BirthdayCard({ nome, setor, data_nascimento }: BirthdayCardProps) {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const todaysBirthdays = (
    data_nascimento.month === currentMonth && data_nascimento.day === currentDay
  );
  const initials = getInitials(nome);

  return (
    <div className="relative flex items-center gap-4 p-4 border rounded-md shadow-sm">
      {todaysBirthdays && (
        <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-1 text-[10px] font-semibold uppercase text-primary-foreground">
          HOJE
        </span>
      )}
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
        {initials}
      </div>
      <div>
        <p className="font-semibold">{nome}</p>
        <p className="text-sm text-gray-500">{setor}</p>
        <p className="text-sm text-gray-500">{data_nascimento.day} {numberToMonth[data_nascimento.month]}</p>
      </div>
    </div>
  );
}