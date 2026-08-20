"use client";

import type { RamalRow } from "./form-ramal";
import ModalDelete from "./modal-delete";
import ModalUpdateAndCreate from "./modal-update-create";
import { ColumnDef } from "@tanstack/react-table";

export type { RamalRow };

export const columns: ColumnDef<RamalRow>[] = [
  {
    accessorKey: "usuario",
    header: "Login",
  },
  {
    accessorKey: "ramalGrupo",
    header: "Ramal de grupo",
  },
  {
    accessorKey: "actions",
    header: () => <p className="text-center">Ações</p>,
    cell: ({ row }) => (
      <div className="flex gap-2 items-center justify-center" key={row.id}>
        <ModalUpdateAndCreate ramal={row.original} isUpdating />
        <ModalDelete id={row.original.id} />
      </div>
    ),
  },
];
