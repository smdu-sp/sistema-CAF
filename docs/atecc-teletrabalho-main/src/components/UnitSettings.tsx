import React, { useState } from 'react';
import { Plus, Trash2, Building2, Edit2, Check } from 'lucide-react';
import { Unidade } from '../types';
import { randomUUID } from '../lib/utils';

interface UnitSettingsProps {
  unidades: Unidade[];
  onUpdateUnidades: (unidades: Unidade[]) => void;
}

export default function UnitSettings({ unidades, onUpdateUnidades }: UnitSettingsProps) {
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [newUnitName, setNewUnitName] = useState('');

  const handleAddUnit = () => {
    if (!newUnitName) return;
    const unit: Unidade = {
      id: randomUUID(),
      nome: newUnitName
    };
    onUpdateUnidades([...unidades, unit]);
    setNewUnitName('');
  };

  const handleRemoveUnit = (id: string) => {
    onUpdateUnidades(unidades.filter(u => u.id !== id));
  };

  const handleUpdateUnit = (id: string, nome: string) => {
    onUpdateUnidades(unidades.map(u => u.id === id ? { ...u, nome } : u));
    setEditingUnitId(null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" /> Gestão de Unidades
        </h2>

        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8">
          <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4">Nova Unidade</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Nome da unidade (ex: SMUL/ATECC)"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={newUnitName}
              onChange={e => setNewUnitName(e.target.value)}
            />
            <button
              onClick={handleAddUnit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 font-bold"
            >
              <Plus className="w-5 h-5" /> Adicionar
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Unidades Cadastradas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unidades.map(u => (
              <div key={u.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all">
                {editingUnitId === u.id ? (
                  <input
                    type="text"
                    className="flex-1 px-2 py-1 rounded border border-blue-200 text-sm mr-4"
                    defaultValue={u.nome}
                    autoFocus
                    onBlur={(e) => handleUpdateUnit(u.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateUnit(u.id, (e.target as HTMLInputElement).value)}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-700">{u.nome}</span>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingUnitId(editingUnitId === u.id ? null : u.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {editingUnitId === u.id ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleRemoveUnit(u.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
