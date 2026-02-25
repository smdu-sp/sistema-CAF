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
import type { SalaRow } from './form-sala';
import FormSala from './form-sala';

export default function ModalUpdateAndCreate({
	isUpdating,
	sala,
}: {
	isUpdating: boolean;
	sala?: Partial<SalaRow>;
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
					<DialogTitle>
						{isUpdating ? 'Editar ' : 'Criar '}Sala
					</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Altere nome, andar e localização da sala.'
							: 'Preencha os dados para cadastrar uma nova sala.'}
					</DialogDescription>
				</DialogHeader>
				<FormSala sala={sala} isUpdating={isUpdating} />
			</DialogContent>
		</Dialog>
	);
}
