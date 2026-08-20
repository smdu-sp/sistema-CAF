import React, { useState } from 'react';
import { Plus, Trash2, UserPlus, Users, Search, RotateCcw, Pencil, Check, X } from 'lucide-react';
import { User, Unidade, Cargo } from '../types';
import { CARGOS, USUARIOS_PADRAO } from '../constants';
import { cn, randomUUID } from '../lib/utils';

interface UserSettingsProps {
  users: User[];
  unidades: Unidade[];
  onUpdateUsers: (users: User[]) => void;
}

function applyRfMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 7);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function UserSettings({ users, unidades, onUpdateUsers }: UserSettingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState<Partial<User>>({
    rf: '',
    nomeCompleto: '',
    unidadeId: '',
    cargo: 'ASO, AAG e Assessor',
    grupoTeletrabalho: 1
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ rf: string; nomeCompleto: string }>({ rf: '', nomeCompleto: '' });

  const handleAddUser = () => {
    if (!newUser.rf || !newUser.nomeCompleto || !newUser.unidadeId || !newUser.cargo) return;

    const user: User = {
      id: randomUUID(),
      rf: newUser.rf,
      nomeCompleto: newUser.nomeCompleto,
      unidadeId: newUser.unidadeId,
      cargo: newUser.cargo as Cargo,
      grupoTeletrabalho: newUser.grupoTeletrabalho as 1 | 2
    };

    onUpdateUsers([...users, user]);
    setNewUser({ rf: '', nomeCompleto: '', unidadeId: '', cargo: 'ASO, AAG e Assessor' });
  };

  const handleRemoveUser = (id: string) => {
    onUpdateUsers(users.filter(u => u.id !== id));
  };

  const handleStartEdit = (u: User) => {
    setEditingId(u.id);
    setEditValues({ rf: u.rf, nomeCompleto: u.nomeCompleto });
  };

  const handleSaveEdit = (id: string) => {
    onUpdateUsers(users.map(u => u.id === id ? { ...u, ...editValues } : u));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const filteredUsers = users.filter(u =>
    u.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.rf.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Cadastro de Usuários
          </h2>
          <button
            onClick={() => {
              if (window.confirm('Isso irá substituir todos os usuários atuais pelos usuários padrão da ATECC. Deseja continuar?')) {
                onUpdateUsers(USUARIOS_PADRAO);
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-lg transition-all border border-amber-100"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Resetar para Padrão
          </button>
        </div>

        {/* Add User Form */}
        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Novo Usuário
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">RF</label>
              <input
                type="text"
                placeholder="Ex: 123.456-7"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={newUser.rf}
                onChange={e => setNewUser({ ...newUser, rf: applyRfMask(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
              <input
                type="text"
                placeholder="Nome sem abreviações"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={newUser.nomeCompleto}
                onChange={e => setNewUser({ ...newUser, nomeCompleto: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Unidade</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                value={newUser.unidadeId}
                onChange={e => setNewUser({ ...newUser, unidadeId: e.target.value })}
              >
                <option value="">Selecione...</option>
                {unidades.map(u => (
                  <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Cargo</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                value={newUser.cargo}
                onChange={e => setNewUser({ ...newUser, cargo: e.target.value as Cargo })}
              >
                {CARGOS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Grupo Teletrabalho</label>
              <div className="flex gap-2">
                <select
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  value={newUser.grupoTeletrabalho}
                  onChange={e => setNewUser({ ...newUser, grupoTeletrabalho: Number(e.target.value) as 1 | 2 })}
                >
                  <option value={1}>Grupo 1</option>
                  <option value={2}>Grupo 2</option>
                </select>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Usuários Cadastrados</h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou RF..."
                className="w-full pl-10 pr-4 py-1.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">RF</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nome Completo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Unidade</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Grupo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <tr key={u.id} className={cn("transition-colors", editingId === u.id ? "bg-blue-50/40" : "hover:bg-gray-50/50")}>
                      <td className="px-6 py-3 text-sm font-medium text-gray-900">
                        {editingId === u.id ? (
                          <input
                            type="text"
                            className="w-32 px-2 py-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            value={editValues.rf}
                            onChange={e => setEditValues({ ...editValues, rf: applyRfMask(e.target.value) })}
                          />
                        ) : u.rf}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {editingId === u.id ? (
                          <input
                            type="text"
                            className="w-48 px-2 py-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            value={editValues.nomeCompleto}
                            onChange={e => setEditValues({ ...editValues, nomeCompleto: e.target.value })}
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(u.id); if (e.key === 'Escape') handleCancelEdit(); }}
                            autoFocus
                          />
                        ) : u.nomeCompleto}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {unidades.find(unit => unit.id === u.unidadeId)?.nome || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold uppercase">
                          {u.cargo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                          u.grupoTeletrabalho === 1 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                        )}>
                          G{u.grupoTeletrabalho}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {editingId === u.id ? (
                            <>
                              <button onClick={() => handleSaveEdit(u.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <Check className="w-4 h-4" />
                              </button>
                              <button onClick={handleCancelEdit} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleStartEdit(u)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleRemoveUser(u.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                      Nenhum usuário cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
