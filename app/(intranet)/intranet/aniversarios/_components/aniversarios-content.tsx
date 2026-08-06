/** @format */

import { mockBirthdayConfig, mockBirthdays } from "../../_mock";
import { PageHeader } from "../../_components/shared/page-header";
import { BirthdayGrid } from "./birthday-grid";

export function AniversariosContent() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Aniversarios"
        description={`Aniversariantes de ${mockBirthdayConfig.monthLabel}`}
      />

      <BirthdayGrid birthdays={mockBirthdays} />
    </section>
  );
}
