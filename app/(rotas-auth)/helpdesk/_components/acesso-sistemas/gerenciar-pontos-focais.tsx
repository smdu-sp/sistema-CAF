'use client';

import { CampoBuscaUsuario } from '../campo-busca-usuario';
import { useEffect, useState } from 'react';

type PontoFocal = {
  id: number;
  unidade: string;
  unidadeId: string;
  usuario: string;
  login: string;
  ativo: boolean;
};

type Unidade = { id: string; nome: string };

export function GerenciarPontosFocais() {
  const [lista, setLista] = useState<PontoFocal[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [unidadeId, setUnidadeId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [usuarioNome, setUsuarioNome] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  function carregar() {
    Promise.all([
      fetch('/api/helpdesk/acesso-sistemas/pontos-focais').then(r => r.json()),
      fetch('/api/helpdesk/acesso-sistemas/catalogo').then(r => r.json()),
    ]).then(([pf, cat]) => {
      if (pf.error) throw new Error(pf.error);
      if (cat.error) throw new Error(cat.error);
      setLista(pf.pontosFocais ?? []);
      setUnidades((cat.unidades ?? []).map((u: { id: string; nome: string }) => ({ id: u.id, nome: u.nome })));
    }).catch(e => setErro(String(e)));
  }

  useEffect(() => { carregar(); }, []);

  async function vincular(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!usuarioId) {
      setErro('Informe o ponto focal');
      return;
    }
    const r = await fetch('/api/helpdesk/acesso-sistemas/pontos-focais', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        unidadeId,
        usuarioId,
      }),
    });
    const data = await r.json();
    if (!r.ok) { setErro(data.error); return; }
    setUnidadeId(''); setUsuarioId(''); setUsuarioNome('');
    carregar();
  }

  async function toggle(id: number, ativo: boolean) {
    await fetch(`/api/helpdesk/acesso-sistemas/pontos-focais/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo }),
    });
    carregar();
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Pontos focais por unidade</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Somente usuários cadastrados aqui podem abrir solicitações de acesso para a unidade.
      </p>
      {erro && <p className="text-sm text-red-600 mb-4">{erro}</p>}

      <form onSubmit={vincular} className="grid gap-3 sm:grid-cols-3 mb-8 border rounded-lg p-4">
        <select required className="rounded-md border px-3 py-2 text-sm" value={unidadeId} onChange={e => setUnidadeId(e.target.value)}>
          <option value="">Unidade</option>
          {unidades.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>
        <CampoBuscaUsuario
          value={usuarioId}
          onChange={setUsuarioId}
          onSelecionar={(u) => setUsuarioNome(u.nome)}
          nomeInicial={usuarioNome}
          placeholder="Digite o nome do ponto focal..."
        />
        <button type="submit" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Vincular</button>
      </form>

      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Unidade</th>
            <th className="py-2">Ponto focal</th>
            <th className="py-2">Status</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {lista.map(p => (
            <tr key={p.id} className="border-b">
              <td className="py-2">{p.unidade}</td>
              <td className="py-2">{p.usuario} ({p.login})</td>
              <td className="py-2">{p.ativo ? 'Ativo' : 'Inativo'}</td>
              <td className="py-2 text-right">
                <button type="button" className="text-xs underline" onClick={() => toggle(p.id, !p.ativo)}>
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
