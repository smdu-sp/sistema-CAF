'use client';

import { Badge } from '@/components/ui/badge';
import type { SalaRow } from './form-sala';
import ModalDelete from './modal-delete';
import { ColumnDef } from '@tanstack/react-table';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';
import { Tooltip } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type { SalaRow };

const ariaLabel = "Editar sala";

export const columns: ColumnDef<SalaRow>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },

  {
    accessorKey: 'andar',
    header: 'Andar',
    cell: ({ row }) =>
      row.original.andar ?? <span className="text-gray-500">Não informado</span>,
  },

  {
    accessorKey: 'numero',
    header: 'Número',
    cell: ({ row }) =>
      row.original.numero ?? <span className="text-gray-500">Não informado</span>,
  },

  {
    accessorKey: 'lotacao',
    header: 'Lotação',
    cell: ({ row }) =>
      row.original.lotacao ?? <span className="text-gray-500">Não informada</span>,
  },

  {
    accessorKey: 'layout',
    header: 'Layout',

    cell: ({ row }) => {
      if (!row.original.layout) {
        return <span className="text-gray-500">Não informado</span>;
      }

      return row.original.layout ===
        'MOVEL'
        ? 'Móvel'
        : 'Fixo';
    },
  },

  {
    accessorKey: 'ativo',

    header: () => (
      <p className="text-center">
        Status
      </p>
    ),

    cell: ({ row }) => {
      const ativo = row.original.ativo;

      return (
        <div className="flex items-center justify-center">
          <Badge
            variant={
              ativo
                ? 'default'
                : 'destructive'
            }
          >
            {ativo
              ? 'Ativa'
              : 'Inativa'}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: 'actions',

    header: () => (
      <p className="text-center">
        Ações
      </p>
    ),

    cell: ({ row }) => (
      <div
        className="flex items-center justify-center gap-2"
        key={row.id}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/reserva-salas/salas/${row.original.id}`}
            >
              <Button
                variant="outline"
                size="icon"
                aria-label={ariaLabel}
                type="button"
              >
                <SquarePen size={18} />
              </Button>
            </Link>
          </TooltipTrigger>

          <TooltipContent side="bottom">
            <p>{ariaLabel}</p>
          </TooltipContent>
        </Tooltip>

        <ModalDelete
          id={row.original.id}
          status={!row.original.ativo}
        />
      </div>
    ),
  },
];