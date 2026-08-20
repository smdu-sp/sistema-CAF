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
import FormEquipamento from './form-equipamento';
import type { EquipamentoRow, UnidadeRef, UsuarioRef } from './tipos';

export default function ModalUpdateAndCreate({
	isUpdating,
	equipamento,
	unidades,
	usuarios,
}: {
	isUpdating: boolean;
	equipamento?: Partial<EquipamentoRow>;
	unidades: UnidadeRef[];
	usuarios: UsuarioRef[];
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
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{isUpdating ? 'Editar ' : 'Novo '}Equipamento</DialogTitle>
					<DialogDescription>
						{isUpdating
							? 'Altere os dados técnicos do equipamento.'
							: 'Cadastre um equipamento manualmente. O vínculo ao patrimônio é feito na tela de detalhe.'}
					</DialogDescription>
				</DialogHeader>
				<FormEquipamento
					isUpdating={isUpdating}
					equipamento={equipamento}
					unidades={unidades}
					usuarios={usuarios}
				/>
			</DialogContent>
		</Dialog>
	);
}
