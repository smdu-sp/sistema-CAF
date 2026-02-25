'use client';

import { ColumnDef } from '@tanstack/react-table';

export type UsuarioRow = {
  id: string;
  nome: string;
  login: string;
  email: string;
  permissao: string;
  coordenadoriaId: string | null;
  coordenadoria: { id: string; nome: string } | null;
};

type CoordenadoriaOption = { id: string; nome: string };

export function getColumns(
  coordenadorias: CoordenadoriaOption[],
  onCoordenadoriaChange: (usuarioId: string, coordenadoriaId: string | null) => void,
): ColumnDef<UsuarioRow>[] {
  return [
    {
      accessorKey: 'nome',
      header: 'Nome',
      cell: ({ row }) => (
        <span>
          <span className="font-medium">{row.original.nome}</span>
          <span className="text-muted-foreground ml-1">({row.original.login})</span>
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'E-mail',
    },
    {
      accessorKey: 'coordenadoriaId',
      header: 'Coordenadoria',
      cell: ({ row }) => (
        <select
          className="flex h-8 w-full max-w-[220px] rounded-md border border-input bg-transparent px-2 text-sm"
          value={row.original.coordenadoriaId ?? ''}
          onChange={(e) =>
            onCoordenadoriaChange(
              row.original.id,
              e.target.value ? e.target.value : null,
            )
          }
        >
          <option value="">Nenhuma</option>
          {coordenadorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      ),
    },
  ];
}
