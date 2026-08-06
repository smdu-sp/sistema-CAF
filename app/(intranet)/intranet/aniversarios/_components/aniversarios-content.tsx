/** @format */

import { Cake } from "lucide-react";
import { numberToMonth } from "../data/conversorMonths";
import { pessoasMock as peopleMock } from "../data/people";
import { BirthdayCard } from "./birthday-card";

function parseDateBirthday(date: string) {
    const [year, month, day] = date.split("-").map(Number);
    return { year, month, day };
}

export function AniversariosContent() {
  const today = new Date();
  const currentMonth = numberToMonth[today.getMonth() + 1];
  
  const monthBirthdays = peopleMock
    .filter((person) => {
      const { month } = parseDateBirthday(person.data_nascimento);
      return month === today.getMonth() + 1;
    })
    .sort((a, b) => {
      const { day: dayA } = parseDateBirthday(a.data_nascimento);
      const { day: dayB } = parseDateBirthday(b.data_nascimento);
      return dayA - dayB;
    });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Cake className="h-12 w-12" />
        <div className="ml-4">
          <h1 className="text-2xl font-bold leading-tight md:text-2xl">
            Aniversários {currentMonth}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Envie uma felicitação para quem faz aniversário hoje! 🎉
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {monthBirthdays.map((person, index) => {
          const { day, month } = parseDateBirthday(person.data_nascimento);
          return (
            <BirthdayCard
              key={index}
              nome={person.nome}
              setor={person.setor}
              data_nascimento={{ day, month }}
            />
          );
        })}
      </section>
    </div>
  );
}
