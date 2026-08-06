/** @format */

import { mockBirthdays } from "../../_mock";
import { Birthday, BirthdayCard } from "./birthday-card";

interface BirthdayGridProps {
  birthdays?: readonly Birthday[];
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
