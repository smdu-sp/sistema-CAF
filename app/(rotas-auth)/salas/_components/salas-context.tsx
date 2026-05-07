import DataTable from '@/components/data-table';
import { prisma } from '@/lib/prisma';
import { columns } from './columns';
import { ActionButton } from '@/components/action-button';
import { Plus } from 'lucide-react';
 
const LIMITE_SALAS = 10;
 
interface SalasContentProps {
    pagina?: number;
}
 
export async function SalasContent({ pagina = 1 }: SalasContentProps) {
    
    const paginaAtual = Math.max(1, pagina);
    const skip = (paginaAtual - 1) * LIMITE_SALAS;
 
    const [lista, total] = await Promise.all([
        prisma.salaReserva.findMany({
            orderBy: { nome: 'asc' },
            select: { 
                id: true, 
                nome: true, 
                andar: true, 
                numero: true, 
                lotacao: true, 
                layout: true, 
                ativo: true 
            },
            skip,
            take: LIMITE_SALAS,
        }),
        prisma.salaReserva.count(),
    ]);
 
    const totalPaginas = Math.max(1, Math.ceil(total / LIMITE_SALAS));
 
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex justify-center">
                <ActionButton
                    title="Criar Sala"
                    description="Adicione uma nova sala ao sistema de reservas"
                    href="/salas"
                    icon={Plus}
                />
            </div>
            <div className="flex flex-col gap-3 w-full">
                <DataTable 
                    columns={columns} 
                    data={lista}
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    totalItens={total}
                    labelItemSingular="sala"
                    labelItemPlural="salas"
                />
            </div>
        </div>
    );
}