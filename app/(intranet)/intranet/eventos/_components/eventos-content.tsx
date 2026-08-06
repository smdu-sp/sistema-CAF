/** @format */

import { PageHeader } from "../../_components/shared/page-header";
import { mockEvents } from "../../_mock";
import { EventList } from "./event-list";

export function EventosContent() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Eventos"
        description="Agenda de encontros, comunicacoes internas e datas importantes."
      />

      <EventList events={mockEvents} />
    </section>
  );
}
