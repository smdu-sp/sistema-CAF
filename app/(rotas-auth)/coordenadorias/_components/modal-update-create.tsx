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
import type { CoordenadoriaRow } from './form-coordenadoria';
import FormCoordenadoria from './form-coordenadoria';

export default function ModalUpdateAndCreate({
	isUpdating,
	coordenadoria,
}: {
	isUpdating: boolean;
	coordenadoria?: Partial<CoordenadoriaRow>;
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
						{isUpdating ? 'Editar ' : 'Criar '}Coordenadoria
					</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Altere o nome da coordenadoria.'
							: 'Preencha o nome para cadastrar uma nova coordenadoria.'}
					</DialogDescription>
				</DialogHeader>
				<FormCoordenadoria
					coordenadoria={coordenadoria}
					isUpdating={isUpdating}
				/>
			</DialogContent>
		</Dialog>
	);
}
