import { auth } from '@/lib/auth/auth';
import { Suspense } from 'react';
import { TableSkeleton } from '@/components/data-table';
import { SalasContent } from './_components/salas-context';

export default async function SalasPage() {
    const session = await auth();
    const usuario = (session as any)?.usuario;
    const permissao = usuario?.permissao;

    if (!session) {
        return (
            <div className="w-full px-0 md:px-8 pb-20 md:pb-14">
                <p>Você precisa estar autenticado.</p>
            </div>
        );
    }

    if (permissao !== 'ADM' && permissao !== 'DEV') {
        return (
            <div className="w-full px-0 md:px-8 pb-20 md:pb-14">
                <p>Somente administradores podem acessar esta página.</p>
            </div>
        );
    }

    return (
        <Suspense fallback={<TableSkeleton />}>
            <SalasContent />
        </Suspense>
    );
}
