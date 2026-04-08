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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
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
	const labelAcao = isUpdating ? 'Editar sala' : 'Cadastrar nova sala';

	return (
		<Dialog>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button
							type="button"
							size="icon"
							variant="outline"
							aria-label={labelAcao}
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
				</TooltipTrigger>
				<TooltipContent side="top">
					<p>{labelAcao}</p>
				</TooltipContent>
			</Tooltip>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{isUpdating ? 'Editar ' : 'Criar '}Sala
					</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Altere os dados da sala, incluindo mobiliário e mídia.'
							: 'Preencha os dados para cadastrar uma nova sala.'}
					</DialogDescription>
				</DialogHeader>
				<FormSala sala={sala} isUpdating={isUpdating} />
			</DialogContent>
		</Dialog>
	);
}
