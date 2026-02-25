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

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export default function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<div className="rounded-md">
			<Table className="bg-background dark:bg-muted/50 border">
				<TableHeader className="bg-primary hover:bg-primary">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow className="hover:bg-primary" key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									className="text-white text-xs text-nowrap"
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
								className="px-4"
								key={row.id}
								data-state={row.getIsSelected() ? 'selected' : undefined}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										className="text-sm px-4 text-nowrap font-light"
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
								className="h-24 text-center"
							>
								Sem resultados.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export function TableSkeleton() {
	return <Skeleton className="h-[240px] w-full rounded-xl" />;
}
