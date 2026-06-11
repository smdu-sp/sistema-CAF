'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, SquarePen } from 'lucide-react';
import type { ReactNode } from 'react';
import type { ItemRow, UnidadeOption, UsuarioOption } from './form-item';
import FormItemPatrimonio from './form-item';

export default function ModalUpdateAndCreate({
	isUpdating,
	item,
	unidades,
	usuarios,
	trigger,
	open,
	onOpenChange,
}: {
	isUpdating: boolean;
	item?: Partial<ItemRow>;
	unidades: UnidadeOption[];
	usuarios: UsuarioOption[];
	trigger?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const controlled = open !== undefined;

	return (
		<Dialog {...(controlled ? { open, onOpenChange } : {})}>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button
						size="icon"
						variant="outline"
						className={
							isUpdating
								? 'bg-background hover:bg-primary h-8 w-8 shrink-0'
								: 'bg-primary hover:bg-primary hover:opacity-70 group h-8 w-8 shrink-0'
						}
					>
						{isUpdating ? (
							<SquarePen size={16} className="text-primary group-hover:text-white" />
						) : (
							<Plus size={16} className="text-white" />
						)}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{isUpdating ? 'Editar ' : 'Criar '}Item</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Altere os dados do equipamento de patrimônio.'
							: 'Cadastre um novo item no inventário de TI.'}
					</DialogDescription>
				</DialogHeader>
				<FormItemPatrimonio
					item={item}
					isUpdating={isUpdating}
					unidades={unidades}
					usuarios={usuarios}
				/>
			</DialogContent>
		</Dialog>
	);
}
