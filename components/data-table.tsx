/** @format */

'use client';

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Paginacao } from './paginacao';
import { useRouter, useSearchParams } from 'next/navigation';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	className?: string;
	paginaAtual?: number;
	totalPaginas?: number;
	totalItens?: number;
	labelItemSingular?: string;
	labelItemPlural?: string;
}

export default function DataTable<TData, TValue>({
	columns,
	data,
	className,
	paginaAtual = 1,
    totalPaginas = 1,
    totalItens = 0,
    labelItemSingular = "item",
    labelItemPlural = "itens",
}: DataTableProps<TData, TValue>) {
	const router = useRouter();
    const searchParams = useSearchParams();
	
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const handlePageChange = (novoNumero: number) => {
		const params = new URLSearchParams(searchParams);
		params.set('pagina', String(novoNumero));
		router.push(`?${params.toString()}`);
	}
	return (
		<div className={cn("w-full overflow-x-auto rounded-md border", className)}>
			<Table className="bg-background dark:bg-muted/50 w-full min-w-full">
				<TableHeader className="bg-primary hover:bg-primary">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow className="hover:bg-primary" key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									className="text-white text-xs sm:text-sm text-nowrap px-2 sm:px-4 py-2 sm:py-3"
									key={header.id}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								className="hover:bg-muted/50 transition-colors"
								key={row.id}
								data-state={row.getIsSelected() ? 'selected' : undefined}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 font-light break-words"
									>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext(),
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center text-muted-foreground"
							>
								Sem resultados.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<Paginacao
                paginaAtual={paginaAtual}
                totalPaginas={totalPaginas}
                totalItens={totalItens}
                labelItemSingular={labelItemSingular}
                labelItemPlural={labelItemPlural}
                onPageChange={handlePageChange}
            />
		</div>
	);
}

export function TableSkeleton() {
	return <Skeleton className="h-[240px] w-full rounded-xl" />;
}