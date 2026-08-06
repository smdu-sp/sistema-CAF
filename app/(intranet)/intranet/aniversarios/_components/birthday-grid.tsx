/** @format */

import { IntranetBirthday } from "../../_types/intranet";
import { mockBirthdays } from "../../_mock";
import { BirthdayCard } from "./birthday-card";

interface BirthdayGridProps {
  birthdays?: readonly IntranetBirthday[];
}

export function BirthdayGrid({ birthdays = mockBirthdays }: BirthdayGridProps) {
  const sortedBirthdays = [...birthdays].sort((a, b) => a.day - b.day);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sortedBirthdays.map((birthday) => (
        <BirthdayCard key={birthday.id} birthday={birthday} />
      ))}
    </div>
  );
}
