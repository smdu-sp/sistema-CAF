/** @format */

import { PageHeader } from "../../_components/shared/page-header";
import { mockDirectory } from "../../_mock";
import { DepartmentList } from "./department-list";

export function DepartmentContent() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Diretorio de Secretarias"
        description="Contatos das areas e coordenadorias da intranet."
      />

      <DepartmentList departments={mockDirectory} />
    </section>
  );
}
