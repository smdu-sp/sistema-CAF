import DataTable from '@/components/data-table';
import { prisma } from '@/lib/prisma';
import { columns } from './columns';
import ModalUpdateAndCreate from './modal-update-create';

export async function SalasContent() {
    const lista = await prisma.salaReserva.findMany({
        orderBy: { nome: 'asc' },
        select: { id: true, nome: true, andar: true, numero: true, lotacao: true, layout: true, ativo: true },
    });

    return (
        <div className="w-full px-0 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
            <div className="flex flex-col max-w-sm mx-auto md:max-w-full gap-3 my-5 w-full">
                <DataTable columns={columns} data={lista} />
            </div>
            <div className="absolute bottom-10 md:bottom-5 right-2 md:right-8 hover:scale-110">
                <ModalUpdateAndCreate isUpdating={false} />
            </div>
        </div>
    );
}