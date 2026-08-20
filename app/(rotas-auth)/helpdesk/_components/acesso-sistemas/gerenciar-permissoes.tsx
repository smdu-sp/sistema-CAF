'use client';

import { useEffect, useState } from 'react';

type PermissaoRow = {
  id: number;
  sistemaId: number;
  sistema: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
};

type Sistema = { id: number; nome: string };

export function GerenciarPermissoesAcesso() {
  const [permissoes, setPermissoes] = useState<PermissaoRow[]>([]);
  const [sistemas, setSistemas] = useState<Sistema[]>([]);
  const [sistemaId, setSistemaId] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  function carregar() {
    Promise.all([
      fetch('/api/helpdesk/acesso-sistemas/permissoes').then(r => r.json()),
      fetch('/api/helpdesk/acesso-sistemas/catalogo').then(r => r.json()),
    ]).then(([perm, cat]) => {
      if (perm.error) throw new Error(perm.error);
      setPermissoes(perm.permissoes ?? []);
      setSistemas((cat.sistemas ?? []).map((s: { id: number; nome: string }) => ({ id: s.id, nome: s.nome })));
    }).catch(e => setErro(String(e)));
  }

  useEffect(() => { carregar(); }, []);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    const r = await fetch('/api/helpdesk/acesso-sistemas/permissoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sistemaId: Number(sistemaId), nome, descricao }),
    });
    const data = await r.json();
    if (!r.ok) { setErro(data.error); return; }
    setNome(''); setDescricao(''); setSistemaId('');
    carregar();
  }

  async function toggleAtivo(id: number, ativo: boolean) {
    await fetch(`/api/helpdesk/acesso-sistemas/permissoes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo }),
    });
    carregar();
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Permissões por sistema</h1>
      <p className="text-sm text-muted-foreground mb-6">Cadastro dos tipos de permissão disponíveis em cada sistema.</p>
      {erro && <p className="text-sm text-red-600 mb-4">{erro}</p>}

      <form onSubmit={criar} className="grid gap-3 sm:grid-cols-4 mb-8 border rounded-lg p-4">
        <select required className="rounded-md border px-3 py-2 text-sm" value={sistemaId} onChange={e => setSistemaId(e.target.value)}>
          <option value="">Sistema</option>
          {sistemas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
        </select>
        <input required className="rounded-md border px-3 py-2 text-sm" placeholder="Nome da permissão" value={nome} onChange={e => setNome(e.target.value)} />
        <input className="rounded-md border px-3 py-2 text-sm" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <button type="submit" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Adicionar</button>
      </form>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Sistema</th>
            <th className="py-2">Permissão</th>
            <th className="py-2">Status</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {permissoes.map(p => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{p.sistema}</td>
              <td className="py-2">{p.nome}{p.descricao ? ` — ${p.descricao}` : ''}</td>
              <td className="py-2">{p.ativo ? 'Ativo' : 'Inativo'}</td>
              <td className="py-2 text-right">
                <button type="button" className="text-xs underline" onClick={() => toggleAtivo(p.id, !p.ativo)}>
                  {p.ativo ? 'Desativar' : 'Ativar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
