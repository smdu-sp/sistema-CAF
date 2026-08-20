'use client';

import type { ReactNode } from 'react';
import type { BaixaPatrimonio, ItemPatrimonio, Unidade, Usuario } from '../../_types';
import type { ItemRow, UnidadeOption, UsuarioOption } from './form-item';
import { BotoesStatusItem } from './botoes-status-item';
import ModalDelete from './modal-delete';
import ModalUpdateAndCreate from './modal-update-create';

export function buildUnidadeOptions(unidades: Unidade[]): UnidadeOption[] {
	return unidades.map((u) => ({ id: u.id, nome: u.full }));
}

export function buildUsuarioOptions(
	usuarios: Usuario[],
	numToUuid: Record<string, string>,
): UsuarioOption[] {
	return usuarios
		.map((u) => ({
			id: numToUuid[String(u.id)] ?? '',
			nome: u.nome,
		}))
		.filter((u) => u.id);
}

export function itemPatrimonioToFormRow(
	item: ItemPatrimonio,
	numToUuid: Record<string, string>,
): Partial<ItemRow> {
	const servidorUuid =
		item.servidorId != null
			? numToUuid[String(item.servidorId)] ?? null
			: null;

	return {
		idbem: item.idbem,
		patrimonio: item.patrimonio,
		tipo: item.tipo,
		descsbpm: item.descsbpm,
		numserie: item.numserie || null,
		marca: item.marca || null,
		modelo: item.modelo || null,
		cimbpm: item.cimbpm || null,
		nomeRede: item.nomeRede ?? null,
		statusitem: item.statusitem,
		unidadeId: item.unidadeId ?? '',
		servidorId: servidorUuid ?? '__none__',
		unidadeNome: item.localizacao,
		servidorNome: item.servidor,
	};
}

export function PatrimonioNovoItemButton({
	trigger,
	unidades,
	usuarios,
}: {
	trigger: ReactNode;
	unidades: UnidadeOption[];
	usuarios: UsuarioOption[];
}) {
	return (
		<ModalUpdateAndCreate
			isUpdating={false}
			unidades={unidades}
			usuarios={usuarios}
			trigger={trigger}
		/>
	);
}

export function InventarioItemAcoes({
	item,
	unidades,
	usuarios,
	numToUuid,
	usuarioLogadoNome,
	baixas,
	inline = false,
}: {
	item: ItemPatrimonio;
	unidades: UnidadeOption[];
	usuarios: UsuarioOption[];
	numToUuid: Record<string, string>;
	usuarioLogadoNome?: string;
	baixas?: BaixaPatrimonio[];
	/** Mantém todos os botões na mesma linha (sem quebra) */
	inline?: boolean;
}) {
	const row = itemPatrimonioToFormRow(item, numToUuid);
	const inativo = item.statusitem === 'Inativo';

	return (
		<div
			className={`flex items-center justify-end gap-0.5 ${inline ? 'flex-nowrap shrink-0' : 'flex-wrap'}`}
			onClick={(e) => e.stopPropagation()}
			onKeyDown={(e) => e.stopPropagation()}
			role="presentation"
		>
			<ModalUpdateAndCreate
				isUpdating
				item={row}
				unidades={unidades}
				usuarios={usuarios}
			/>
			<BotoesStatusItem
				idbem={item.idbem}
				patrimonio={item.patrimonio}
				statusAtual={item.statusitem}
				localizacaoAtual={item.localizacao}
				servidorAtual={item.servidor}
				usuarioLogadoNome={usuarioLogadoNome}
				jaTemBaixa={baixas?.some((b) => b.idItem === item.idbem) ?? false}
			/>
			<ModalDelete
				idbem={item.idbem}
				inativo={inativo}
				localizacaoAtual={item.localizacao}
				servidorAtual={item.servidor}
			/>
		</div>
	);
}
