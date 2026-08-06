/** @format */

import { mockDirectory } from "../../_mock";
import { IntranetDepartment } from "../../_types/intranet";
import { DepartmentCard } from "./department-card";

interface DepartmentListProps {
  departments?: readonly IntranetDepartment[];
}

export function DepartmentList({
  departments = mockDirectory,
}: DepartmentListProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {departments.map((department) => (
        <DepartmentCard key={department.id} department={department} />
      ))}
    </div>
  );
}
