import DataTable from '@/components/data-table';
import { prisma } from '@/lib/prisma';
import { columns } from './columns';
import { ActionButton } from '@/components/action-button';
import { Plus } from 'lucide-react';

export async function SalasContent() {
    const lista = await prisma.salaReserva.findMany({
        orderBy: { nome: 'asc' },
        select: { id: true, nome: true, andar: true, numero: true, lotacao: true, layout: true, ativo: true },
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-center">
                <ActionButton
                    title="Criar Sala"
                    description="Adicione uma nova sala ao sistema de reservas"
                    href="#"
                    icon={Plus}
                />
            </div>
            <div className="flex flex-col gap-3 w-full">
                <DataTable columns={columns} data={lista} />
            </div>
        </div>
    );
}