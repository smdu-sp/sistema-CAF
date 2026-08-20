import React, { useState } from 'react';
import { User, Lock, LogIn, Building2 } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  users: UserType[];
  onLogin: (user: UserType) => void;
}

export default function Login({ users, onLogin }: LoginProps) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const selectedUser = users.find(u => u.id === selectedUserId);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedUserId) {
      setError('Por favor, selecione seu nome.');
      return;
    }

    if (selectedUser?.role === 'admin') {
      if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
        onLogin(selectedUser);
      } else {
        setError('Senha incorreta para o Administrador.');
      }
    } else if (selectedUser) {
      onLogin(selectedUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-200 mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ATECC</h1>
          <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-2">Sistema de Teletrabalho</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3 h-3" /> Selecione seu Nome
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white transition-all"
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  setError('');
                }}
              >
                <option value="">Selecione...</option>
                {users.sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto)).map(u => (
                  <option key={u.id} value={u.id}>{u.nomeCompleto}</option>
                ))}
              </select>
            </div>

            {selectedUser?.role === 'admin' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Senha de Acesso
                </label>
                <input
                  type="password"
                  placeholder="Digite a senha..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {error && (
              <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> Entrar no Sistema
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          Secretaria Municipal de Urbanismo e Licenciamento © 2026
        </p>
      </div>
    </div>
  );
}
