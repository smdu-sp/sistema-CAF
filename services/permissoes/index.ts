import { cookies } from "next/headers";

async function verificarDesenvolvedor(): Promise<boolean> {
    const cookieStore = await cookies();
    try {
        const resposta = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}api/usuarios/permissoes/desenvolvedor`, {
            headers: { cookie: cookieStore.toString() }
        });
        const { desenvolvedor } = await resposta.json();
        return desenvolvedor;
    } catch (error) {
        console.error("Erro ao verificar permissão de desenvolvedor:", error);
        return false;
    }
}

async function listarPermissoes(modulo?: string): Promise<string[]> {
    const cookieStore = await cookies();
    try {
        const resposta = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}api/usuarios/permissoes${modulo ? `?modulo=${modulo}` : ''}`, 
            { headers: { Cookie: cookieStore.toString() }}
        );
        const { permissoes } = await resposta.json();
        return permissoes;
    } catch (error) {
        throw new Error("Erro ao listar permissões: " + error);
    }
}

async function validarPermissao(permissao: string): Promise<boolean> {
    const cookieStore = await cookies();
    try {
        const resposta = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/usuarios/permissoes/validar/${permissao}`, 
        { headers: { Cookie: cookieStore.toString() }}
        );
        const { temPermissao } = await resposta.json();
        return temPermissao;
    } catch (error) {
        console.error("Erro ao validar permissão:", error);
        return false;
    }
}

export { verificarDesenvolvedor, listarPermissoes, validarPermissao };
