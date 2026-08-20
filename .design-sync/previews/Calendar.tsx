import * as React from "react";
import { Calendar } from "salas-reuniao-ui";

const hoje = new Date(2026, 7, 19);

export function SelecaoDeData() {
  const [data, setData] = React.useState<Date | undefined>(new Date(2026, 7, 25));
  return (
    <Calendar
      mode="single"
      selected={data}
      onSelect={setData}
      defaultMonth={new Date(2026, 7, 1)}
    />
  );
}

export function DatasIndisponiveis() {
  return (
    <Calendar
      mode="single"
      selected={new Date(2026, 7, 21)}
      defaultMonth={new Date(2026, 7, 1)}
      disabled={(date: Date) => date < hoje || date.getDay() === 0 || date.getDay() === 6}
    />
  );
}
