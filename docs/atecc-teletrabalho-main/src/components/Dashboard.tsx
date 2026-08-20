import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Download, 
  Search, 
  Filter, 
  Users, 
  ClipboardList, 
  Calendar,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  Printer,
  X,
  Settings,
  Award,
  LayoutDashboard
} from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { Registro, Cargo, Unidade, User, CargoConfig } from '../types';
import { CARGOS } from '../constants';
import { cn } from '../lib/utils';
import UnitSettings from './UnitSettings';
import UserSettings from './UserSettings';
import CargoSettings from './CargoSettings';

interface DashboardProps {
  registros: Registro[];
  unidades: Unidade[];
  users: User[];
  cargoConfigs: CargoConfig[];
  onUpdateUnidades: (unidades: Unidade[]) => void;
  onUpdateUsers: (users: User[]) => void;
  onUpdateCargoConfigs: (configs: CargoConfig[]) => void;
  currentUser: User;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard({ 
  registros, 
  unidades, 
  users, 
  cargoConfigs, 
  onUpdateUnidades, 
  onUpdateUsers, 
  onUpdateCargoConfigs,
  currentUser
}: DashboardProps) {
  const [activeView, setActiveView] = useState<'stats' | 'servidores' | 'settings' | 'users' | 'cargos'>(
    currentUser.role === 'admin' ? 'stats' : 'servidores'
  );
  const [filterRF, setFilterRF] = useState('');
  const [filterCargo, setFilterCargo] = useState<string>('');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');
  const [sortField, setSortField] = useState<keyof Registro>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedServidor, setSelectedServidor] = useState<string | null>(null);
  const [reportMonth, setReportMonth] = useState(format(new Date(), 'yyyy-MM'));

  const filteredRegistros = useMemo(() => {
    return registros.filter(r => {
      const matchRF = r.rf.toLowerCase().includes(filterRF.toLowerCase()) || 
                      r.nomeCompleto.toLowerCase().includes(filterRF.toLowerCase());
      const matchCargo = !filterCargo || r.cargo === filterCargo;
      const matchDateStart = !filterDateStart || r.dataTeletrabalho >= filterDateStart;
      const matchDateEnd = !filterDateEnd || r.dataTeletrabalho <= filterDateEnd;
      return matchRF && matchCargo && matchDateStart && matchDateEnd;
    }).sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [registros, filterRF, filterCargo, filterDateStart, filterDateEnd, sortField, sortOrder]);

  const servidoresSummary = useMemo(() => {
    const summary: Record<string, { 
      rf: string, 
      nomeCompleto: string, 
      cargo: Cargo, 
      unidadeLotacao: string,
      totalDias: number, 
      registros: Registro[] 
    }> = {};
    
    registros.forEach(r => {
      if (!summary[r.rf]) {
        summary[r.rf] = { 
          rf: r.rf, 
          nomeCompleto: r.nomeCompleto || (r as any).sigla || 'N/A', 
          cargo: r.cargo, 
          unidadeLotacao: r.unidadeLotacao || 'N/A',
          totalDias: 0, 
          registros: [] 
        };
      }
      summary[r.rf].totalDias++;
      summary[r.rf].registros.push(r);
    });
    
    const list = Object.values(summary).sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
    
    if (!filterRF) return list;
    
    return list.filter(s => 
      s.rf.toLowerCase().includes(filterRF.toLowerCase()) || 
      s.nomeCompleto.toLowerCase().includes(filterRF.toLowerCase())
    );
  }, [registros, filterRF]);

  const stats = useMemo(() => {
    const total = filteredRegistros.length;
    const uniqueRFs = new Set(filteredRegistros.map(r => r.rf)).size;
    
    const cargoData = CARGOS.map(c => ({
      name: c,
      value: filteredRegistros.filter(r => r.cargo === c).length
    })).filter(d => d.value > 0);

    // Calculate activity category distribution
    const allAtividades = cargoConfigs.flatMap(c => c.atividades);
    const categoryCounts: Record<string, number> = {};
    filteredRegistros.forEach(r => {
      r.atividades.forEach(ar => {
        const activity = allAtividades.find(a => a.id === ar.id);
        if (activity) {
          categoryCounts[activity.categoria] = (categoryCounts[activity.categoria] || 0) + ar.quantidade;
        }
      });
    });

    const categoryData = Object.entries(categoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories

    return { total, uniqueRFs, cargoData, categoryData };
  }, [filteredRegistros, cargoConfigs]);

  const exportToExcel = () => {
    const allAtividades = cargoConfigs.flatMap(c => c.atividades);
    
    const dataToExport = filteredRegistros.map(r => {
      const row: any = {
        'RF': r.rf,
        'Nome Completo': r.nomeCompleto,
        'Unidade': r.unidadeLotacao,
        'Data Teletrabalho': r.dataTeletrabalho,
        'Cargo': r.cargo,
        'Pontuação Total': r.pontuacaoTotal || 0,
      };

      // Add activities and their quantities
      r.atividades.forEach(ar => {
        const activity = allAtividades.find(a => a.id === ar.id);
        if (activity) {
          row[activity.descricao] = ar.quantidade;
        }
      });

      row['Processos Analisados'] = r.processosAnalisados || '';
      row['Dificuldades'] = r.dificuldades || '';
      row['Motivo Atraso'] = r.motivoAtraso || '';
      row['Data Preenchimento'] = format(parseISO(r.timestamp), 'dd/MM/yyyy HH:mm:ss');

      return row;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registros');
    XLSX.writeFile(wb, `ATECC_Teletrabalho_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToCSV = () => {
    const allAtividades = cargoConfigs.flatMap(c => c.atividades);
    const activityDescriptions = Array.from(new Set(allAtividades.map(a => a.descricao)));
    
    const headers = ['RF', 'Nome Completo', 'Unidade', 'Data Teletrabalho', 'Cargo', 'PontuacaoTotal', ...activityDescriptions, 'Processos', 'Dificuldades', 'MotivoAtraso', 'Timestamp'];
    
    const rows = filteredRegistros.map(r => {
      const activityQuantities = activityDescriptions.map(desc => {
        const ar = r.atividades.find(a => allAtividades.find(all => all.id === a.id)?.descricao === desc);
        return ar ? ar.quantidade : 0;
      });

      return [
        r.rf,
        r.nomeCompleto,
        r.unidadeLotacao,
        r.dataTeletrabalho,
        r.cargo,
        r.pontuacaoTotal || 0,
        ...activityQuantities,
        r.processosAnalisados || '',
        r.dificuldades || '',
        r.motivoAtraso || '',
        r.timestamp
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `ATECC_Teletrabalho_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = (rf: string) => {
    const servidor = servidoresSummary.find(s => s.rf === rf);
    if (!servidor) return;

    const [year, month] = reportMonth.split('-').map(Number);
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    const registrosMes = servidor.registros.filter(r => {
      const date = parseISO(r.dataTeletrabalho);
      return isWithinInterval(date, { start: startDate, end: endDate });
    }).sort((a, b) => a.dataTeletrabalho.localeCompare(b.dataTeletrabalho));

    if (registrosMes.length === 0) {
      alert('Nenhum registro encontrado para este servidor no mês selecionado.');
      return;
    }

    const allAtividades = cargoConfigs.flatMap(c => c.atividades);
    
    const atividadesDesc = Array.from(new Set(registrosMes.flatMap(r => 
      r.atividades.map(ar => {
        const activity = allAtividades.find(a => a.id === ar.id);
        return activity ? `${activity.descricao} (${ar.quantidade}x)` : null;
      }).filter(Boolean)
    ))).join('; ');

    const processos = Array.from(new Set(registrosMes.map(r => r.processosAnalisados).filter(Boolean))).join('; ');
    const dificuldades = Array.from(new Set(registrosMes.map(r => r.dificuldades).filter(Boolean))).join('; ');
    const diasTrabalhados = registrosMes.map(r => format(parseISO(r.dataTeletrabalho), 'dd/MM')).join(', ');

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório de Teletrabalho - ${servidor.nomeCompleto}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            h1 { text-align: center; font-size: 18px; margin-bottom: 30px; text-transform: uppercase; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; display: block; margin-bottom: 5px; }
            .content { border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px; }
            .footer { margin-top: 60px; display: flex; justify-content: space-between; }
            .signature { border-top: 1px solid #000; width: 250px; text-align: center; padding-top: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1>Relatório Individual Periódico de Atividades (Teletrabalho)</h1>
          
          <div class="section">
            <span class="label">I – Identificação do Servidor e Unidade de Lotação:</span>
            <div class="content">
              Nome: ${servidor.nomeCompleto}<br>
              RF: ${servidor.rf}<br>
              Cargo: ${servidor.cargo}<br>
              Unidade: ${servidor.unidadeLotacao}
            </div>
          </div>

          <div class="section">
            <span class="label">II – Período de Referência:</span>
            <div class="content">
              Mês/Ano: ${format(startDate, 'MMMM/yyyy', { locale: ptBR })}<br>
              Dias de Teletrabalho Realizados: ${diasTrabalhados}
            </div>
          </div>

          <div class="section">
            <span class="label">III – Descrição das Atividades Realizadas no Período:</span>
            <div class="content">
              ${atividadesDesc || 'Nenhuma atividade registrada.'}
            </div>
          </div>

          <div class="section">
            <span class="label">IV – Indicação de Processos Analisados e Entregas Produzidas:</span>
            <div class="content">
              ${processos || 'Nenhum processo ou entrega específica registrada.'}
            </div>
          </div>

          <div class="section">
            <span class="label">V – Vinculação às Metas do Plano de Trabalho Institucional:</span>
            <div class="content">
              As atividades acima descritas contribuem diretamente para o cumprimento das metas de análise processual, suporte administrativo e atendimento institucional estabelecidas no Plano de Trabalho da ATECC.
            </div>
          </div>

          <div class="section">
            <span class="label">VI – Registro de Dificuldades ou Impedimentos:</span>
            <div class="content">
              ${dificuldades || 'Sem intercorrências ou dificuldades excepcionais registradas no período.'}
            </div>
          </div>

          <div class="footer">
            <div class="signature">
              Assinatura do Servidor<br>
              Data: ____/____/____
            </div>
            <div class="signature">
              Assinatura da Chefia Imediata<br>
              Data: ____/____/____
            </div>
          </div>

          <div class="no-print" style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer;">Imprimir Relatório</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintSectorReport = () => {
    const [year, month] = reportMonth.split('-').map(Number);
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    const registrosSetor = registros.filter(r => {
      const date = parseISO(r.dataTeletrabalho);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });

    if (registrosSetor.length === 0) {
      alert('Nenhum registro encontrado para o setor no mês selecionado.');
      return;
    }

    const allAtividades = cargoConfigs.flatMap(c => c.atividades);
    const categoryCounts: Record<string, number> = {};
    const activityCounts: Record<string, number> = {};

    registrosSetor.forEach(r => {
      r.atividades.forEach(ar => {
        const activity = allAtividades.find(a => a.id === ar.id);
        if (activity) {
          categoryCounts[activity.categoria] = (categoryCounts[activity.categoria] || 0) + ar.quantidade;
          activityCounts[activity.descricao] = (activityCounts[activity.descricao] || 0) + ar.quantidade;
        }
      });
    });

    const topActivities = Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório Mensal do Setor - ATECC</title>
          <style>
            body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            h1 { text-align: center; font-size: 20px; margin-bottom: 10px; text-transform: uppercase; }
            h2 { text-align: center; font-size: 14px; color: #666; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .label { font-weight: bold; display: block; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; }
            .card { background: #f8fafc; padding: 15px; rounded: 10px; border: 1px solid #e2e8f0; }
            .card-title { font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase; }
            .card-value { font-size: 24px; font-weight: bold; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }
            th { background: #f1f5f9; font-weight: bold; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1>Relatório Consolidado de Atividades (Teletrabalho)</h1>
          <h2>Unidade: ATECC • Período: ${format(startDate, 'MMMM/yyyy', { locale: ptBR })}</h2>
          
          <div class="section">
            <span class="label">I – Resumo Operacional do Setor:</span>
            <div class="grid">
              <div class="card">
                <div class="card-title">Total de Registros</div>
                <div class="card-value">${registrosSetor.length}</div>
              </div>
              <div class="card">
                <div class="card-title">Servidores em Teletrabalho</div>
                <div class="card-value">${new Set(registrosSetor.map(r => r.userId)).size}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <span class="label">II – Distribuição de Atividades por Categoria:</span>
            <table>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Total de Ações Realizadas</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).map(([cat, count]) => `
                  <tr>
                    <td>${cat}</td>
                    <td>${count}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <span class="label">III – Principais Atividades Desenvolvidas:</span>
            <table>
              <thead>
                <tr>
                  <th>Descrição da Atividade</th>
                  <th>Volume Total</th>
                </tr>
              </thead>
              <tbody>
                ${topActivities.map(([desc, count]) => `
                  <tr>
                    <td>${desc}</td>
                    <td>${count}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <span class="label">IV – Conclusão e Impacto Institucional:</span>
            <p style="font-size: 13px; text-align: justify;">
              O regime de teletrabalho na unidade ATECC demonstrou alta produtividade no período de ${format(startDate, 'MMMM/yyyy', { locale: ptBR })}. 
              As atividades realizadas focaram primordialmente em ${topActivities[0]?.[0] || 'análise técnica'} e ${topActivities[1]?.[0] || 'suporte administrativo'}, 
              garantindo a continuidade dos serviços públicos e o cumprimento das metas estabelecidas. A consolidação dos dados indica uma gestão eficiente do tempo e dos recursos humanos, 
              com entregas consistentes e alinhadas às diretrizes da Secretaria.
            </p>
          </div>

          <div class="no-print" style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer; background: #3b82f6; color: white; border: none; border-radius: 5px; font-weight: bold;">Imprimir Relatório do Setor</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const toggleSort = (field: keyof Registro) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* View Switcher */}
      <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setActiveView('stats')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
              activeView === 'stats' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            <LayoutDashboard className="w-4 h-4" /> Visão Geral
          </button>
        )}
        <button
          onClick={() => setActiveView('servidores')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
            activeView === 'servidores' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Users className="w-4 h-4" /> Dados por Servidor
        </button>
        {currentUser.role === 'admin' && (
          <>
            <button
              onClick={() => setActiveView('settings')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                activeView === 'settings' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Settings className="w-4 h-4" /> Unidades
            </button>
            <button
              onClick={() => setActiveView('users')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                activeView === 'users' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Users className="w-4 h-4" /> Usuários
            </button>
            <button
              onClick={() => setActiveView('cargos')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
                activeView === 'cargos' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Award className="w-4 h-4" /> Cargos
            </button>
          </>
        )}
      </div>

      {activeView === 'settings' && (
        <UnitSettings unidades={unidades} onUpdateUnidades={onUpdateUnidades} />
      )}
      {activeView === 'users' && (
        <UserSettings 
          users={users} 
          unidades={unidades} 
          onUpdateUsers={onUpdateUsers} 
        />
      )}
      {activeView === 'cargos' && (
        <CargoSettings 
          cargoConfigs={cargoConfigs} 
          onUpdateCargoConfigs={onUpdateCargoConfigs} 
        />
      )}
      {activeView === 'stats' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Registros</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Servidores Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueRFs}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Período Selecionado</p>
                <p className="text-sm font-bold text-gray-900">
                  {filterDateStart ? format(parseISO(filterDateStart), 'dd/MM/yy') : 'Início'} - {filterDateEnd ? format(parseISO(filterDateEnd), 'dd/MM/yy') : 'Fim'}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Distribuição por Cargo</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.cargoData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fill: '#6b7280' }}
                      interval={0}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <Tooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Principais Categorias</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 8, fill: '#6b7280' }}
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f9fafb' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Filters & Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900">Registros Detalhados</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Excel
                  </button>
                  <button 
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="w-4 h-4" /> CSV
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Filtrar por RF ou Nome..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={filterRF}
                    onChange={e => setFilterRF(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm appearance-none bg-white"
                    value={filterCargo}
                    onChange={e => setFilterCargo(e.target.value)}
                  >
                    <option value="">Todos os Cargos</option>
                    {CARGOS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={filterDateStart}
                    onChange={e => setFilterDateStart(e.target.value)}
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={filterDateEnd}
                    onChange={e => setFilterDateEnd(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600" onClick={() => toggleSort('rf')}>
                      <div className="flex items-center gap-1">RF <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600" onClick={() => toggleSort('nomeCompleto')}>
                      <div className="flex items-center gap-1">Nome Completo <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600" onClick={() => toggleSort('dataTeletrabalho')}>
                      <div className="flex items-center gap-1">Data <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cargo</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pontos</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Atividades</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRegistros.length > 0 ? (
                    filteredRegistros.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{r.rf}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{r.nomeCompleto}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{format(parseISO(r.dataTeletrabalho), 'dd/MM/yyyy')}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold uppercase">
                            {r.cargo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-blue-600">{r.pontuacaoTotal || 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className="text-xs">
                            {r.atividades.reduce((acc, curr) => acc + curr.quantidade, 0)} {r.atividades.length === 1 ? 'atividade' : 'atividades'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                        Nenhum registro encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {activeView === 'servidores' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar servidor por RF ou Nome..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={filterRF}
                onChange={e => setFilterRF(e.target.value)}
              />
            </div>
            {currentUser.role === 'admin' && (
              <div className="flex items-center gap-2">
                <input 
                  type="month" 
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={reportMonth}
                  onChange={e => setReportMonth(e.target.value)}
                />
                <button 
                  onClick={handlePrintSectorReport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Relatório do Setor
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servidoresSummary.map(s => (
            <div key={s.rf} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">{s.nomeCompleto}</h4>
                  <p className="text-xs text-gray-500">RF: {s.rf} • {s.unidadeLotacao}</p>
                </div>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase">
                  {s.cargo}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm border-y border-gray-50 py-3">
                <span className="text-gray-500">Dias Registrados</span>
                <span className="font-bold text-gray-900">{s.totalDias}</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input 
                    type="month" 
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={reportMonth}
                    onChange={e => setReportMonth(e.target.value)}
                  />
                  <button 
                    onClick={() => handlePrintReport(s.rf)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    title="Gerar Relatório Mensal"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center italic">
                  Selecione o mês para gerar o relatório individual.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}
