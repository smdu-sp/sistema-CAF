/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  LayoutDashboard,
  Building2,
  LogOut,
  Menu,
  X,
  Info,
  Calendar as CalendarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Login from './components/Login';
import { Registro, Unidade, User, CargoConfig, CalendarActivity, DutyStaff } from './types';
import { cn } from './lib/utils';
import { api } from './lib/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'form' | 'dashboard' | 'calendar'>('form');
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cargoConfigs, setCargoConfigs] = useState<CargoConfig[]>([]);
  const [calendarActivities, setCalendarActivities] = useState<CalendarActivity[]>([]);
  const [dutyStaff, setDutyStaff] = useState<DutyStaff[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [r, u, us, cc, ca, ds] = await Promise.all([
          api.getRegistros(),
          api.getUnidades(),
          api.getUsers(),
          api.getCargoConfigs(),
          api.getCalendarActivities(),
          api.getDutyStaff(),
        ]);
        setRegistros(r);
        setUnidades(u);
        setUsers(us);
        setCargoConfigs(cc);
        setCalendarActivities(ca);
        setDutyStaff(ds);
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const savedUser = localStorage.getItem('smul_teletrabalho_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Erro ao carregar sessão:', e);
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('smul_teletrabalho_current_user', JSON.stringify(user));
    setActiveTab('form');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smul_teletrabalho_current_user');
  };

  const handleSaveRegistro = async (novoRegistro: Registro) => {
    const saved = await api.createRegistro(novoRegistro);
    setRegistros(prev => [saved, ...prev]);
  };

  const handleUpdateUnidades = async (novasUnidades: Unidade[]) => {
    const updated = await api.putUnidades(novasUnidades);
    setUnidades(updated);
  };

  const handleUpdateUsers = async (novosUsuarios: User[]) => {
    const updated = await api.putUsers(novosUsuarios);
    setUsers(updated);
  };

  const handleUpdateCargoConfigs = async (novasConfigs: CargoConfig[]) => {
    const updated = await api.putCargoConfigs(novasConfigs);
    setCargoConfigs(updated);
  };

  const handleUpdateCalendarActivities = async (novasAtividades: CalendarActivity[]) => {
    const updated = await api.putCalendarActivities(novasAtividades);
    setCalendarActivities(updated);
  };

  const handleUpdateDutyStaff = async (novoPlantonista: DutyStaff[]) => {
    const updated = await api.putDutyStaff(novoPlantonista);
    setDutyStaff(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  // Filter data based on permissions
  const filteredRegistros = currentUser.role === 'admin' 
    ? registros 
    : registros.filter(r => r.userId === currentUser.id);

  const filteredActivities = calendarActivities.filter(a => a.userId === currentUser.id);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none text-gray-900">ATECC</h1>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Teletrabalho</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('form')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === 'form' 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <ClipboardList className="w-4 h-4" /> Registro Diário
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === 'calendar' 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <CalendarIcon className="w-4 h-4" /> Calendário
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  activeTab === 'dashboard' 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <LayoutDashboard className="w-4 h-4" /> Painel Administrativo
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-gray-900">{currentUser.nomeCompleto}</span>
                <span className="text-[10px] text-gray-400 capitalize">{currentUser.role === 'admin' ? 'Administrador' : 'Servidor'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button 
                className="md:hidden p-2 text-gray-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                <button
                  onClick={() => { setActiveTab('form'); setIsMenuOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === 'form' ? "bg-blue-50 text-blue-700" : "text-gray-600"
                  )}
                >
                  <ClipboardList className="w-5 h-5" /> Registro Diário
                </button>
                <button
                  onClick={() => { setActiveTab('calendar'); setIsMenuOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === 'calendar' ? "bg-blue-50 text-blue-700" : "text-gray-600"
                  )}
                >
                  <CalendarIcon className="w-5 h-5" /> Calendário
                </button>
                <button
                  onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === 'dashboard' ? "bg-blue-50 text-blue-700" : "text-gray-600"
                  )}
                >
                  <LayoutDashboard className="w-5 h-5" /> Painel Administrativo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {activeTab === 'form' ? 'Registro de Atividades' : activeTab === 'calendar' ? 'Escala de Teletrabalho' : 'Controle Administrativo'}
              </h2>
              <p className="text-blue-100 text-sm md:text-base max-w-2xl">
                {activeTab === 'form' 
                  ? 'Preencha diariamente suas atividades realizadas em regime de teletrabalho conforme as diretrizes do Decreto nº 59.755/2020, da Portaria SEGES nº 63/2023, da Portaria SMUL nº 164/2023 e Ordem Interna SMUL nº 01/2026 .'
                  : activeTab === 'calendar'
                  ? 'Consulte os dias de trabalho presencial e teletrabalho para cada grupo da equipe ATECC.'
                  : 'Visualize estatísticas, filtre registros e exporte dados para controle institucional.'}
              </p>
            </div>
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'form' ? (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Form 
                onSave={handleSaveRegistro} 
                unidades={unidades} 
                users={users} 
                cargoConfigs={cargoConfigs}
                currentUser={currentUser}
              />
            </motion.div>
          ) : activeTab === 'calendar' ? (
            <motion.div
              key="calendar-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Calendar 
                users={users} 
                activities={calendarActivities}
                onUpdateActivities={handleUpdateCalendarActivities}
                dutyStaff={dutyStaff}
                onUpdateDutyStaff={handleUpdateDutyStaff}
                currentUser={currentUser}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Dashboard 
                registros={filteredRegistros} 
                unidades={unidades} 
                users={users}
                cargoConfigs={cargoConfigs}
                onUpdateUnidades={handleUpdateUnidades} 
                onUpdateUsers={handleUpdateUsers}
                onUpdateCargoConfigs={handleUpdateCargoConfigs}
                currentUser={currentUser}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-medium uppercase tracking-widest mb-4">
            <Info className="w-3 h-3" /> Informações Importantes
          </div>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
            Este sistema é de uso exclusivo dos servidores da ATECC. O registro diário é obrigatório para a validação do regime de teletrabalho. Em caso de dúvidas, entre em contato pelo e-mail atecc@prefeitura.sp.gov.br ou converse conosco nos dias de trabalho presencial.
          </p>
          <p className="mt-8 text-gray-300 text-[10px] font-bold uppercase tracking-tighter">
            Secretaria Municipal de Urbanismo e Licenciamento © 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
