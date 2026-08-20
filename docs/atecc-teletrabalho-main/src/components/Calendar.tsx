import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Building2, 
  Monitor, 
  Calendar as CalendarIcon,
  Info,
  Plus,
  Trash2,
  Clock,
  Tag,
  X
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  getWeek,
  parseISO,
  isAfter,
  startOfDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, CalendarActivity, DutyStaff } from '../types';
import { cn, randomUUID } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarProps {
  users: User[];
  activities: CalendarActivity[];
  onUpdateActivities: (activities: CalendarActivity[]) => void;
  dutyStaff: DutyStaff[];
  onUpdateDutyStaff: (duty: DutyStaff[]) => void;
  currentUser: User;
}

export default function Calendar({ 
  users, 
  activities, 
  onUpdateActivities, 
  dutyStaff,
  onUpdateDutyStaff,
  currentUser 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState<1 | 2 | 'all'>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDutyModalOpen, setIsDutyModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newActivity, setNewActivity] = useState({
    time: '',
    subject: ''
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getTeleworkStatus = (date: Date, group: 1 | 2) => {
    const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'Folga';

    const month = date.getMonth() + 1; // 1-12
    const weekNumber = getWeek(date, { weekStartsOn: 1 });
    const weekParity = weekNumber % 2 === 1 ? 'odd' : 'even';

    // ALL Day Rule
    let allDay = 1; // Default Monday
    if ([5, 8, 11].includes(month)) allDay = 3; // May, Aug, Nov -> Wed
    if ([6, 9, 12].includes(month)) allDay = 5; // Jun, Sep, Dec -> Fri

    if (dayOfWeek === allDay) return 'Presencial';

    // Pattern Rule
    // Month Type 1: Apr, Jul, Oct (ALL=Mon)
    if ([4, 7, 10].includes(month)) {
      if (weekParity === 'odd') {
        // ALL, G2, G1, G2, G1
        if (dayOfWeek === 2 || dayOfWeek === 4) return group === 2 ? 'Presencial' : 'Teletrabalho';
        if (dayOfWeek === 3 || dayOfWeek === 5) return group === 1 ? 'Presencial' : 'Teletrabalho';
      } else {
        // ALL, G1, G2, G1, G2
        if (dayOfWeek === 2 || dayOfWeek === 4) return group === 1 ? 'Presencial' : 'Teletrabalho';
        if (dayOfWeek === 3 || dayOfWeek === 5) return group === 2 ? 'Presencial' : 'Teletrabalho';
      }
    }

    // Month Type 2: May, Aug, Nov (ALL=Wed)
    if ([5, 8, 11].includes(month)) {
      if (weekParity === 'odd') {
        // G1, G2, ALL, G2, G1
        if (dayOfWeek === 1 || dayOfWeek === 5) return group === 1 ? 'Presencial' : 'Teletrabalho';
        if (dayOfWeek === 2 || dayOfWeek === 4) return group === 2 ? 'Presencial' : 'Teletrabalho';
      } else {
        // G2, G1, ALL, G1, G2
        if (dayOfWeek === 1 || dayOfWeek === 5) return group === 2 ? 'Presencial' : 'Teletrabalho';
        if (dayOfWeek === 2 || dayOfWeek === 4) return group === 1 ? 'Presencial' : 'Teletrabalho';
      }
    }

    // Month Type 0: Jun, Sep, Dec (ALL=Fri)
    if ([6, 9, 12].includes(month)) {
      if (weekParity === 'odd') {
        // G1, G2, G1, G2, ALL
        if (dayOfWeek === 1 || dayOfWeek === 3) return group === 1 ? 'Presencial' : 'Teletrabalho';
        if (dayOfWeek === 2 || dayOfWeek === 4) return group === 2 ? 'Presencial' : 'Teletrabalho';
      } else {
        // G2, G1, G2, G1, ALL
        if (dayOfWeek === 1 || dayOfWeek === 3) return group === 2 ? 'Presencial' : 'Teletrabalho';
        if (dayOfWeek === 2 || dayOfWeek === 4) return group === 1 ? 'Presencial' : 'Teletrabalho';
      }
    }

    return 'Teletrabalho';
  };

  const handleAddActivity = () => {
    if (!selectedDate || !newActivity.time || !newActivity.subject) return;

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const userActivitiesToday = activities.filter(a => a.date === dateStr && a.userId === currentUser.id);

    if (userActivitiesToday.length >= 5) {
      alert('Limite de 5 atividades por dia atingido.');
      return;
    }

    const activity: CalendarActivity = {
      id: randomUUID(),
      userId: currentUser.id,
      date: dateStr,
      time: newActivity.time,
      subject: newActivity.subject
    };

    onUpdateActivities([...activities, activity]);
    setIsModalOpen(false);
    setNewActivity({ time: '', subject: '' });
  };

  const handleRemoveActivity = (id: string) => {
    onUpdateActivities(activities.filter(a => a.id !== id));
  };

  const handleToggleDuty = (date: Date, type: 'admin' | 'tech') => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingDuty = dutyStaff.find(d => d.date === dateStr && (
      type === 'admin' ? d.userCargo === 'ASO, AAG e Assessor' : d.userCargo !== 'ASO, AAG e Assessor'
    ));

    if (existingDuty) {
      if (existingDuty.userId === currentUser.id || currentUser.role === 'admin') {
        onUpdateDutyStaff(dutyStaff.filter(d => d.id !== existingDuty.id));
      } else {
        alert('Apenas o próprio servidor ou um administrador pode remover este plantão.');
      }
      return;
    }

    // Check if user is eligible for the slot
    const isUserAdminCargo = currentUser.cargo === 'ASO, AAG e Assessor';
    if (type === 'admin' && !isUserAdminCargo) {
      alert('Este plantão é exclusivo para cargos Administrativos (ASO, AAG e Assessor).');
      return;
    }
    if (type === 'tech' && isUserAdminCargo) {
      alert('Este plantão é exclusivo para cargos Técnicos (Arquitetos).');
      return;
    }

    // Check if it's an in-person day for the user
    const userStatus = getTeleworkStatus(date, currentUser.grupoTeletrabalho || 1);
    if (userStatus !== 'Presencial') {
      alert('Você só pode se candidatar ao plantão em dias de trabalho presencial do seu grupo.');
      return;
    }

    const newDuty: DutyStaff = {
      id: randomUUID(),
      userId: currentUser.id,
      userName: currentUser.nomeCompleto,
      userCargo: currentUser.cargo,
      date: dateStr
    };

    onUpdateDutyStaff([...dutyStaff, newDuty]);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Escala de Teletrabalho</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDutyModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors border border-amber-200 mr-2"
          >
            <Clock className="w-4 h-4" /> Escala de Plantão
          </button>
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {calendarDays.map((day, i) => {          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());
          const dateStr = format(day, 'yyyy-MM-dd');
          
          // Filter activities: Admin sees all, User sees only theirs
          const dayActivities = activities.filter(a => 
            a.date === dateStr && (currentUser.role === 'admin' || a.userId === currentUser.id)
          );
          
          let status1 = getTeleworkStatus(day, 1);
          let status2 = getTeleworkStatus(day, 2);

          const dayDuty = dutyStaff.filter(d => d.date === dateStr);
          const adminDuty = dayDuty.find(d => d.userCargo === 'ASO, AAG e Assessor');
          const techDuty = dayDuty.find(d => d.userCargo !== 'ASO, AAG e Assessor');

          return (
            <div
              key={i}
              onClick={() => {
                if (isCurrentMonth) {
                  setSelectedDate(day);
                  setIsModalOpen(true);
                }
              }}
              className={cn(
                "min-h-[160px] p-2 bg-white transition-all relative cursor-pointer hover:bg-gray-50 group",
                !isCurrentMonth && "bg-gray-50/50 opacity-40 pointer-events-none"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  "text-xs font-bold",
                  isToday ? "w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center" : "text-gray-400"
                )}>
                  {format(day, 'd')}
                </span>
                <Plus className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-1">
                {(selectedGroup === 1 || selectedGroup === 'all') && status1 !== 'Folga' && (
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase flex flex-col gap-0.5 shadow-sm",
                    status1 === 'Presencial' ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 border border-blue-100"
                  )}>
                    <div className="flex items-center gap-1">
                      <div className={cn("w-1 h-1 rounded-full", status1 === 'Presencial' ? "bg-white" : "bg-blue-500")} />
                      G1: {status1}
                    </div>
                  </div>
                )}
                {(selectedGroup === 2 || selectedGroup === 'all') && status2 !== 'Folga' && (
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-bold uppercase flex flex-col gap-0.5 shadow-sm",
                    status2 === 'Presencial' ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  )}>
                    <div className="flex items-center gap-1">
                      <div className={cn("w-1 h-1 rounded-full", status2 === 'Presencial' ? "bg-white" : "bg-emerald-500")} />
                      G2: {status2}
                    </div>
                  </div>
                )}
              </div>

              {/* Duty Staff (Plantonistas) */}
              {(status1 === 'Presencial' || status2 === 'Presencial') && (
                <div className="mt-2 space-y-1">
                  <div 
                    onClick={(e) => { e.stopPropagation(); handleToggleDuty(day, 'admin'); }}
                    className={cn(
                      "px-1.5 py-1 rounded text-[7px] font-bold uppercase flex items-center gap-1 transition-all border",
                      adminDuty 
                        ? "bg-amber-100 text-amber-800 border-amber-200 shadow-sm" 
                        : "bg-gray-50 text-gray-400 border-dashed border-gray-200 hover:border-amber-300 hover:text-amber-500"
                    )}
                  >
                    <div className={cn("w-1 h-1 rounded-full", adminDuty ? "bg-amber-500" : "bg-gray-300")} />
                    ADM: {adminDuty ? adminDuty.userName.split(' ')[0] : 'Vago'}
                  </div>
                  <div 
                    onClick={(e) => { e.stopPropagation(); handleToggleDuty(day, 'tech'); }}
                    className={cn(
                      "px-1.5 py-1 rounded text-[7px] font-bold uppercase flex items-center gap-1 transition-all border",
                      techDuty 
                        ? "bg-purple-100 text-purple-800 border-purple-200 shadow-sm" 
                        : "bg-gray-50 text-gray-400 border-dashed border-gray-200 hover:border-purple-300 hover:text-purple-500"
                    )}
                  >
                    <div className={cn("w-1 h-1 rounded-full", techDuty ? "bg-purple-500" : "bg-gray-300")} />
                    TÉC: {techDuty ? techDuty.userName.split(' ')[0] : 'Vago'}
                  </div>
                </div>
              )}

              {/* Activities */}
              <div className="mt-2 space-y-1">
                {dayActivities.map(activity => {
                  const user = users.find(u => u.id === activity.userId);
                  return (
                    <div 
                      key={activity.id}
                      className="p-1 bg-gray-100 rounded text-[8px] text-gray-700 flex flex-col gap-0.5 border border-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold truncate">{activity.time} - {user?.nomeCompleto.split(' ')[0]}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveActivity(activity.id);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                      <span className="truncate opacity-70 italic">{activity.subject}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div className="space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                Calendário ATECC
              </h2>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Escala de Teletrabalho 2026</p>
            </div>
          </div>

          <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
            <button
              onClick={() => setSelectedGroup(1)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                selectedGroup === 1 ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Grupo 1
            </button>
            <button
              onClick={() => setSelectedGroup(2)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                selectedGroup === 2 ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Grupo 2
            </button>
            <button
              onClick={() => setSelectedGroup('all')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                selectedGroup === 'all' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              Ambos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> Composição dos Grupos
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">Grupo 1</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Administrativos</p>
                      <div className="flex flex-wrap gap-1.5">
                        {users.filter(u => u.grupoTeletrabalho === 1 && u.cargo === 'ASO, AAG e Assessor').map(u => (
                          <span key={u.id} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-medium text-gray-600">
                            {u.nomeCompleto}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Técnicos</p>
                      <div className="flex flex-wrap gap-1.5">
                        {users.filter(u => u.grupoTeletrabalho === 1 && u.cargo !== 'ASO, AAG e Assessor').map(u => (
                          <span key={u.id} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-medium text-gray-600">
                            {u.nomeCompleto}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Grupo 2</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Administrativos</p>
                      <div className="flex flex-wrap gap-1.5">
                        {users.filter(u => u.grupoTeletrabalho === 2 && u.cargo === 'ASO, AAG e Assessor').map(u => (
                          <span key={u.id} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-medium text-gray-600">
                            {u.nomeCompleto}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Técnicos</p>
                      <div className="flex flex-wrap gap-1.5">
                        {users.filter(u => u.grupoTeletrabalho === 2 && u.cargo !== 'ASO, AAG e Assessor').map(u => (
                          <span key={u.id} className="px-2 py-1 bg-white border border-gray-200 rounded-md text-[10px] font-medium text-gray-600">
                            {u.nomeCompleto}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" /> Plantonistas de Hoje
              </h3>
              <div className="space-y-3">
                {(() => {
                  const todayStr = format(new Date(), 'yyyy-MM-dd');
                  const todayDuty = dutyStaff.filter(d => d.date === todayStr);
                  const admin = todayDuty.find(d => d.userCargo === 'ASO, AAG e Assessor');
                  const tech = todayDuty.find(d => d.userCargo !== 'ASO, AAG e Assessor');

                  return (
                    <>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-[9px] font-bold text-amber-600 uppercase mb-1">Administrativo</p>
                        <p className="text-sm font-bold text-gray-900">{admin ? admin.userName : 'Nenhum escalado'}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                        <p className="text-[9px] font-bold text-purple-600 uppercase mb-1">Técnico</p>
                        <p className="text-sm font-bold text-gray-900">{tech ? tech.userName : 'Nenhum escalado'}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Plantonistas do Mês
              </h3>
              <div className="space-y-4">
                <p className="text-[10px] text-amber-700 font-medium italic">
                  Contagem de plantões realizados no mês de {format(currentMonth, 'MMMM', { locale: ptBR })}.
                </p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {users
                    .map(u => ({
                      ...u,
                      count: dutyStaff.filter(d => 
                        d.userId === u.id && 
                        isSameMonth(parseISO(d.date), currentMonth)
                      ).length
                    }))
                    .sort((a, b) => b.count - a.count)
                    .filter(u => u.count > 0 || u.role !== 'admin')
                    .map(u => (
                      <div key={u.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-900">{u.nomeCompleto}</span>
                          <span className="text-[9px] text-gray-400 uppercase">{u.cargo}</span>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
                          u.count > 0 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-400"
                        )}>
                          {u.count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> Regras da Escala
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 text-[10px] font-bold">1</div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Dia de Todos:</strong> Um dia fixo na semana onde toda a equipe comparece presencialmente.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 text-[10px] font-bold">2</div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Rodízio:</strong> Nos demais dias, os grupos alternam entre presencial e teletrabalho.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 text-[10px] font-bold">3</div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>Frequência:</strong> O regime padrão é de 3 dias presenciais e 2 dias em teletrabalho por semana.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-600 text-white">
                <div>
                  <h3 className="text-lg font-bold">Agendar Atividade</h3>
                  <p className="text-xs opacity-80 font-medium">
                    {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Horário
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={newActivity.time}
                      onChange={e => setNewActivity({ ...newActivity, time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Tag className="w-3 h-3" /> Assunto
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Reunião ATECC"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={newActivity.subject}
                      onChange={e => setNewActivity({ ...newActivity, subject: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddActivity}
                  disabled={!newActivity.time || !newActivity.subject}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:shadow-none mt-4"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Duty Schedule Modal */}
      <AnimatePresence>
        {isDutyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-amber-600 text-white">
                <div>
                  <h3 className="text-lg font-bold">Escala de Plantão</h3>
                  <p className="text-xs opacity-80 font-medium">
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                  </p>
                </div>
                <button 
                  onClick={() => setIsDutyModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase">{d}</div>
                  ))}
                </div>

                <div className="space-y-2">
                  {eachDayOfInterval({
                    start: startOfMonth(currentMonth),
                    end: endOfMonth(currentMonth)
                  }).filter(d => d.getDay() !== 0 && d.getDay() !== 6).map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayDuty = dutyStaff.filter(d => d.date === dateStr);
                    const admin = dayDuty.find(d => d.userCargo === 'ASO, AAG e Assessor');
                    const tech = dayDuty.find(d => d.userCargo !== 'ASO, AAG e Assessor');
                    
                    const status1 = getTeleworkStatus(day, 1);
                    const status2 = getTeleworkStatus(day, 2);

                    return (
                      <div key={dateStr} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-12 flex flex-col items-center justify-center border-r border-gray-200 pr-4">
                          <span className="text-lg font-bold text-gray-900">{format(day, 'dd')}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-bold">{format(day, 'EEE', { locale: ptBR })}</span>
                        </div>
                        
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div 
                            onClick={() => handleToggleDuty(day, 'admin')}
                            className={cn(
                              "p-2 rounded-lg border transition-all cursor-pointer",
                              admin ? "bg-amber-100 border-amber-200 shadow-sm" : "bg-white border-dashed border-gray-200 hover:border-amber-300"
                            )}
                          >
                            <p className="text-[8px] font-bold text-amber-600 uppercase mb-1">Administrativo</p>
                            <p className="text-xs font-bold text-gray-900 truncate">{admin ? admin.userName : 'Vago'}</p>
                          </div>
                          <div 
                            onClick={() => handleToggleDuty(day, 'tech')}
                            className={cn(
                              "p-2 rounded-lg border transition-all cursor-pointer",
                              tech ? "bg-purple-100 border-purple-200 shadow-sm" : "bg-white border-dashed border-gray-200 hover:border-purple-300"
                            )}
                          >
                            <p className="text-[8px] font-bold text-purple-600 uppercase mb-1">Técnico</p>
                            <p className="text-xs font-bold text-gray-900 truncate">{tech ? tech.userName : 'Vago'}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          {status1 === 'Presencial' && <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[8px] font-bold">G1</span>}
                          {status2 === 'Presencial' && <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[8px] font-bold">G2</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center italic">
                  Clique nos espaços vago ou nos nomes para se candidatar ou remover seu plantão.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
