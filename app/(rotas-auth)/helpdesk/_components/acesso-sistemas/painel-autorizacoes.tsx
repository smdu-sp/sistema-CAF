'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Solicitacao = {
  id: number;
  chamadoId: number;
  nomeBeneficiario: string;
  rfBeneficiario: string;
  sistema: string;
  permissao: string;
  unidade: string;
  coordenadoria: string | null;
  observacao: string | null;
  statusAutorizacao: string;
  abertura: string;
  solicitante: string;
  motivoNegacao: string | null;
};

export function PainelAutorizacoesAcesso() {
  const [lista, setLista] = useState<Solicitacao[]>([]);
  const [status, setStatus] = useState('aguardando');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [negandoId, setNegandoId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');

  function carregar() {
    setLoading(true);
    fetch(`/api/helpdesk/acesso-sistemas/autorizacoes?status=${status}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setLista(data.solicitacoes ?? []);
      })
      .catch(e => setErro(String(e)))
      .finally(() => setLoading(false));
  }

  useEffect(() => { carregar(); }, [status]);

  async function negar(chamadoId: number) {
    if (!motivo.trim()) {
      setErro('Informe o motivo da negativa');
      return;
    }
    setErro(null);
    try {
      const r = await fetch(`/api/helpdesk/acesso-sistemas/chamados/${chamadoId}/negar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setNegandoId(null);
      setMotivo('');
      carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/helpdesk/chamados/acesso-sistemas" className="text-sm text-muted-foreground hover:underline">
          ← Voltar
        </Link>
        <h1 className="text-2xl font-bold mt-2">Autorizações de acesso</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Solicitações dos servidores sob sua coordenação. Negue apenas se não autorizar;
          sem negativa em 7 dias, a solicitação será autorizada automaticamente.
          Em caso de negativa, o setor de liberação de acessos é notificado por e-mail.
        </p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'aguardando', label: 'Aguardando' },
          { key: 'autorizado', label: 'Autorizadas' },
          { key: 'negado', label: 'Negadas' },
          { key: 'todos', label: 'Todas' },
        ].map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setStatus(t.key)}
            className={`rounded-full px-3 py-1 text-sm border ${status === t.key ? 'bg-primary text-primary-foreground' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {erro && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{erro}</div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : lista.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma solicitação encontrada.</p>
      ) : (
        <div className="space-y-4">
          {lista.map(s => (
            <div key={s.id} className="rounded-lg border p-4 bg-card">
              <div className="flex justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-semibold">
                    <Link href={`/helpdesk/chamados/${s.chamadoId}`} className="hover:underline">
                      #{s.chamadoId}
                    </Link>
                    {' — '}{s.sistema}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {s.nomeBeneficiario} (RF {s.rfBeneficiario}) · {s.permissao}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.unidade}{s.coordenadoria ? ` — ${s.coordenadoria}` : ''}</div>
                  {s.observacao && <div className="text-sm mt-2">{s.observacao}</div>}
                  {s.motivoNegacao && (
                    <div className="text-sm mt-2 text-red-700">Negativa: {s.motivoNegacao}</div>
                  )}
                </div>
                <div className="text-right text-sm">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    s.statusAutorizacao === 'aguardando' ? 'bg-amber-100 text-amber-900' :
                    s.statusAutorizacao === 'negado' ? 'bg-red-100 text-red-900' :
                    'bg-green-100 text-green-900'
                  }`}>
                    {s.statusAutorizacao === 'aguardando' ? 'Aguardando' : s.statusAutorizacao === 'negado' ? 'Negada' : 'Autorizada'}
                  </span>
                  <div className="text-muted-foreground mt-2">Ponto focal: {s.solicitante}</div>
                </div>
              </div>

              {s.statusAutorizacao === 'aguardando' && (
                <div className="mt-4 border-t pt-4">
                  {negandoId === s.chamadoId ? (
                    <div className="space-y-2">
                      <textarea
                        className="w-full rounded-md border px-3 py-2 text-sm min-h-[80px]"
                        placeholder="Motivo da negativa..."
                        value={motivo}
                        onChange={e => setMotivo(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => negar(s.chamadoId)}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white"
                        >
                          Confirmar negativa
                        </button>
                        <button type="button" onClick={() => { setNegandoId(null); setMotivo(''); }} className="text-sm">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setNegandoId(s.chamadoId)}
                      className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-800"
                    >
                      Negar solicitação
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
