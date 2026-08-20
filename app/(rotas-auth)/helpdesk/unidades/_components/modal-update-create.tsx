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
import type { UnidadeRow } from './form-unidade';
import FormUnidade from './form-unidade';

export default function ModalUpdateAndCreate({
	isUpdating,
	unidade,
}: {
	isUpdating: boolean;
	unidade?: Partial<UnidadeRow>;
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
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{isUpdating ? 'Editar ' : 'Criar '}Unidade</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Altere os dados da unidade de atendimento.'
							: 'Cadastre uma unidade para chamados e patrimônio.'}
					</DialogDescription>
				</DialogHeader>
				<FormUnidade unidade={unidade} isUpdating={isUpdating} />
			</DialogContent>
		</Dialog>
	);
}
