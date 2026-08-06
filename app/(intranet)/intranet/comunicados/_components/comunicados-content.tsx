/** @format */

import { PageHeader } from "../../_components/shared/page-header";
import { AnnouncementList } from "./announcement-list";
export function ComunicadosContent() {
  return (
    <section className="space-y-6">
      <PageHeader 
      title="Comunicados"
      description=""
      />

      <AnnouncementList />
    </section>
  );
}
