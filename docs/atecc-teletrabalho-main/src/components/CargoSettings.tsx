import React, { useState } from 'react';
import { Plus, Trash2, Award, Edit2, Check, X } from 'lucide-react';
import { CargoConfig, Atividade, Cargo } from '../types';
import { CARGOS } from '../constants';
import { cn, randomUUID } from '../lib/utils';

interface CargoSettingsProps {
  cargoConfigs: CargoConfig[];
  onUpdateCargoConfigs: (configs: CargoConfig[]) => void;
}

export default function CargoSettings({ cargoConfigs, onUpdateCargoConfigs }: CargoSettingsProps) {
  const [selectedCargoId, setSelectedCargoId] = useState<Cargo>(CARGOS[0]);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Atividade>>({
    categoria: '',
    descricao: '',
    pontuacao: 0
  });

  const selectedConfig = cargoConfigs.find(c => c.id === selectedCargoId);

  const handleAddActivity = () => {
    if (!selectedConfig || !newActivity.descricao || !newActivity.categoria) return;

    const activity: Atividade = {
      id: randomUUID(),
      categoria: newActivity.categoria,
      descricao: newActivity.descricao,
      pontuacao: newActivity.pontuacao || 0
    };

    const updatedConfigs = cargoConfigs.map(c => {
      if (c.id === selectedCargoId) {
        return { ...c, atividades: [...c.atividades, activity] };
      }
      return c;
    });

    onUpdateCargoConfigs(updatedConfigs);
    setNewActivity({ categoria: '', descricao: '', pontuacao: 0 });
  };

  const handleRemoveActivity = (id: string) => {
    const updatedConfigs = cargoConfigs.map(c => {
      if (c.id === selectedCargoId) {
        return { ...c, atividades: c.atividades.filter(a => a.id !== id) };
      }
      return c;
    });
    onUpdateCargoConfigs(updatedConfigs);
  };

  const handleUpdateActivity = (id: string, updates: Partial<Atividade>) => {
    const updatedConfigs = cargoConfigs.map(c => {
      if (c.id === selectedCargoId) {
        return {
          ...c,
          atividades: c.atividades.map(a => a.id === id ? { ...a, ...updates } : a)
        };
      }
      return c;
    });
    onUpdateCargoConfigs(updatedConfigs);
    setEditingActivityId(null);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" /> Configurações de Cargos
        </h2>

        <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-xl w-fit mb-8">
          {CARGOS.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCargoId(c)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                selectedCargoId === c ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {selectedConfig && (
          <div className="space-y-8">
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4">Adicionar Nova Atividade</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Categoria</label>
                  <input
                    type="text"
                    placeholder="Ex: Análise Técnica"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={newActivity.categoria}
                    onChange={e => setNewActivity({ ...newActivity, categoria: e.target.value })}
                  />
                </div>
                <div className="space-y-1 md:col-span-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Descrição</label>
                  <input
                    type="text"
                    placeholder="Descrição da atividade..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={newActivity.descricao}
                    onChange={e => setNewActivity({ ...newActivity, descricao: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Pontuação</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={newActivity.pontuacao}
                      onChange={e => setNewActivity({ ...newActivity, pontuacao: parseInt(e.target.value) || 0 })}
                    />
                    <button
                      onClick={handleAddActivity}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Atividades Cadastradas</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pontos</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedConfig.atividades.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {editingActivityId === a.id ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 rounded border border-blue-200 text-sm"
                              defaultValue={a.categoria}
                              onBlur={(e) => handleUpdateActivity(a.id, { categoria: e.target.value })}
                            />
                          ) : a.categoria}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {editingActivityId === a.id ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 rounded border border-blue-200 text-sm"
                              defaultValue={a.descricao}
                              onBlur={(e) => handleUpdateActivity(a.id, { descricao: e.target.value })}
                            />
                          ) : a.descricao}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-blue-600">
                          {editingActivityId === a.id ? (
                            <input
                              type="number"
                              className="w-20 px-2 py-1 rounded border border-blue-200 text-sm"
                              defaultValue={a.pontuacao}
                              onBlur={(e) => handleUpdateActivity(a.id, { pontuacao: parseInt(e.target.value) || 0 })}
                            />
                          ) : a.pontuacao}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingActivityId(editingActivityId === a.id ? null : a.id)}
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              {editingActivityId === a.id ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleRemoveActivity(a.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
