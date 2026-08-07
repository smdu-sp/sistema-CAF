/** @format */
"use client";

import { useState } from "react";
import { Cake } from "lucide-react";
import { numberToMonth } from "../data/conversorMonths";
import { pessoasMock, PessoaMock } from "../data/people";
import { usuarioAtualMock } from "../data/current-user";
import { parseDateBirthday, diasDesdeAniversario } from "../data/birthday-utils";
import { BirthdayCard } from "./birthday-card";

function estadoInicial(): PessoaMock[] {
  const today = new Date();
  return pessoasMock.map((person) => {
    const { day, month } = parseDateBirthday(person.data_nascimento);
    const diff = diasDesdeAniversario({ day, month }, today);
    const expirado = diff > 1;
    return expirado ? { ...person, felicitantes: [] } : person;
  });
}

export async function AniversariosContent() {
  const [pessoas, setPessoas] = useState<PessoaMock[]>(estadoInicial());

  const today = new Date();
  const currentMonth = numberToMonth[today.getMonth() + 1];

  const monthBirthdays = pessoas
    .filter((person) => {
      const { month } = parseDateBirthday(person.data_nascimento);
      return month === today.getMonth() + 1;
    })
    .sort((a, b) => {
      const { day: dayA } = parseDateBirthday(a.data_nascimento);
      const { day: dayB } = parseDateBirthday(b.data_nascimento);
      return dayA - dayB;
    });

  function handleParabenizar(personId: string) {
    setPessoas((atual) =>
      atual.map((person) =>
        person.id === personId
          ? { ...person, felicitantes: [...person.felicitantes, usuarioAtualMock] }
          : person
      )
    );
  }

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
        {monthBirthdays.map((person) => {
          const { day, month } = parseDateBirthday(person.data_nascimento);
          return (
            <BirthdayCard
              key={person.id}
              nome={person.nome}
              setor={person.setor}
              data_nascimento={{ day, month }}
              contagem={person.felicitantes.length}
              enviado={person.felicitantes.includes(usuarioAtualMock)}
              onParabenizar={() => handleParabenizar(person.id)}
            />
          );
        })}
      </section>
    </div>
  );
}