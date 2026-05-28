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
import type { PermissaoRow } from './columns';
import FormPermissao from './form-permissao';

export default function ModalUpdateAndCreate({
	isUpdating,
	permissao,
}: {
	isUpdating: boolean;
	permissao?: Partial<PermissaoRow>;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size="icon"
					variant="outline"
					className={
						isUpdating
							? 'bg-background hover:bg-primary'
							: 'bg-primary hover:bg-primary hover:opacity-70 group transition-all ease-linear duration-200'
					}
				>
					{isUpdating ? (
						<SquarePen size={28} className="text-primary group-hover:text-white group" />
					) : (
						<Plus size={28} className="text-white group" />
					)}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isUpdating ? 'Editar ' : 'Criar '}Permissão</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Altere os dados da permissão.'
							: 'Preencha os campos para cadastrar uma nova permissão.'}
					</DialogDescription>
				</DialogHeader>
				<FormPermissao permissao={permissao} isUpdating={isUpdating} />
			</DialogContent>
		</Dialog>
	);
}
