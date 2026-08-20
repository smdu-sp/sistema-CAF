import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  User, 
  Calendar, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Save,
  FileText,
  Building2,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cargo, 
  Registro, 
  Atividade,
  Unidade,
  AtividadeRegistro,
  User as UserType,
  CargoConfig
} from '../types';
import { cn, randomUUID } from '../lib/utils';

interface FormProps {
  onSave: (registro: Registro) => void;
  unidades: Unidade[];
  users: UserType[];
  cargoConfigs: CargoConfig[];
  currentUser: UserType;
}

export default function Form({ onSave, unidades, users, cargoConfigs, currentUser }: FormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Registro>>({
    userId: currentUser.id,
    dataTeletrabalho: format(new Date(), 'yyyy-MM-dd'),
    cargo: currentUser.cargo,
    atividades: [],
    pontuacaoTotal: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const selectedUser = currentUser;
  const isArquiteto = formData.cargo === 'Arquitetos' || formData.cargo === 'Arquitetos com cargo de Assessor';
  
  const selectedCargoConfig = cargoConfigs.find(c => c.id === formData.cargo);
  const activities = selectedCargoConfig?.atividades || [];

  const techAnalysisActivitiesCount = (formData.atividades || [])
    .filter(ar => {
      const activity = activities.find(a => a.id === ar.id);
      return activity?.categoria === 'Análise Técnica';
    })
    .reduce((sum, ar) => sum + ar.quantidade, 0);

  const calculateTotalScore = (atividades: AtividadeRegistro[]) => {
    return atividades.reduce((total, ar) => {
      const activity = activities.find(a => a.id === ar.id);
      return total + (activity ? activity.pontuacao * ar.quantidade : 0);
    }, 0);
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.dataTeletrabalho) newErrors.dataTeletrabalho = 'Data é obrigatória';
      if (!formData.cargo) newErrors.cargo = 'Selecione seu cargo';
    }
    
    if (currentStep === 2) {
      if (!formData.atividades || formData.atividades.length === 0) {
        newErrors.atividades = 'Selecione pelo menos uma atividade';
      }
    }

    if (currentStep === 3) {
      if (isArquiteto && techAnalysisActivitiesCount > 0) {
        const processosCount = (formData.processosAnalisados || '').split(',').filter(p => p.trim()).length;
        if (processosCount !== techAnalysisActivitiesCount) {
          newErrors.processosAnalisados = `Você deve indicar exatamente ${techAnalysisActivitiesCount} processos (um para cada atividade de análise técnica realizada).`;
        }
      }
      
      const today = format(new Date(), 'yyyy-MM-dd');
      if (formData.dataTeletrabalho && formData.dataTeletrabalho < today && !formData.motivoAtraso) {
        newErrors.motivoAtraso = 'Justificativa obrigatória para preenchimento retroativo';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setConfirmed(false);
    setStep(step - 1);
  };

  const updateActivityQuantity = (id: string, delta: number) => {
    const current = formData.atividades || [];
    const existing = current.find(a => a.id === id);
    
    let newAtividades: AtividadeRegistro[] = [];
    
    if (existing) {
      const newQuantity = Math.max(0, existing.quantidade + delta);
      if (newQuantity === 0) {
        newAtividades = current.filter(a => a.id !== id);
      } else {
        newAtividades = current.map(a => a.id === id ? { ...a, quantidade: newQuantity } : a);
      }
    } else if (delta > 0) {
      newAtividades = [...current, { id, quantidade: delta }];
    } else {
      return;
    }
    
    setFormData({ 
      ...formData, 
      atividades: newAtividades, 
      pontuacaoTotal: calculateTotalScore(newAtividades)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    
    const user = currentUser;
    const unit = unidades.find(u => u.id === user?.unidadeId);

    const registro: Registro = {
      ...formData as any,
      id: randomUUID(),
      userId: user.id,
      rf: user?.rf || '',
      nomeCompleto: user?.nomeCompleto || '',
      unidadeId: user?.unidadeId || '',
      unidadeLotacao: unit?.nome || '',
      dataRealPreenchimento: format(new Date(), 'yyyy-MM-dd'),
      timestamp: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(registro);
    setIsSubmitting(false);
    setShowSuccess(true);
    setConfirmed(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setStep(1);
      setFormData({
        dataTeletrabalho: format(new Date(), 'yyyy-MM-dd'),
        atividades: [],
        periodo: undefined,
      });
    }, 3000);
  };

  const categories = Array.from(new Set(activities.map(a => a.categoria)));

  if (showSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl border border-green-100 text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registro Enviado!</h2>
        <p className="text-gray-600">Suas atividades foram registradas com sucesso no sistema SMUL/ATECC.</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                step >= s ? "text-blue-600" : "text-gray-400"
              )}
            >
              Passo {s}: {s === 1 ? 'Identificação' : s === 2 ? 'Atividades' : 'Finalização'}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Servidor Conectado</p>
                    <p className="text-sm font-bold text-blue-900">{currentUser.nomeCompleto}</p>
                    <p className="text-[10px] text-blue-600 font-medium">{currentUser.rf} • {unidades.find(u => u.id === currentUser.unidadeId)?.nome}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Data do Teletrabalho
                    </label>
                    <input
                      type="date"
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-sm",
                        errors.dataTeletrabalho ? "border-red-300 bg-red-50" : "border-gray-200"
                      )}
                      value={formData.dataTeletrabalho || ''}
                      onChange={e => setFormData({ ...formData, dataTeletrabalho: e.target.value })}
                    />
                    {errors.dataTeletrabalho && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.dataTeletrabalho}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Briefcase className="w-3 h-3" /> Cargo / Função
                    </label>
                    <select
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-sm",
                        errors.cargo ? "border-red-300 bg-red-50" : "border-gray-200"
                      )}
                      value={formData.cargo || ''}
                      onChange={e => setFormData({ ...formData, cargo: e.target.value as Cargo, atividades: [], pontuacaoTotal: 0 })}
                    >
                      <option value="ASO, AAG e Assessor">ASO, AAG e Assessor</option>
                      <option value="Arquitetos">Arquitetos</option>
                      <option value="Arquitetos com cargo de Assessor">Arquitetos com cargo de Assessor</option>
                    </select>
                    {errors.cargo && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.cargo}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Atividades Realizadas</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold px-2 py-1 bg-blue-600 text-white rounded-md shadow-sm">
                      Pontuação: {formData.pontuacaoTotal || 0}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                      {formData.unidadeLotacao}
                    </span>
                  </div>
                </div>

                {categories.map(cat => (
                  <div key={cat} className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">
                      {cat}
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {activities
                        .filter(a => a.categoria === cat)
                        .map(a => {
                          const ar = formData.atividades?.find(item => item.id === a.id);
                          const quantity = ar?.quantidade || 0;
                          
                          return (
                            <div 
                              key={a.id}
                              className={cn(
                                "flex items-center justify-between p-4 rounded-xl border transition-all",
                                quantity > 0 
                                  ? "border-blue-200 bg-blue-50/50" 
                                  : "border-gray-100 hover:bg-gray-50"
                              )}
                            >
                              <div className="flex-1 pr-4">
                                <p className="text-sm text-gray-900 font-medium leading-tight">{a.descricao}</p>
                                <p className="text-[10px] text-blue-600 font-bold uppercase mt-1">{a.pontuacao} pontos / un</p>
                              </div>
                              
                              <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                                <button
                                  type="button"
                                  onClick={() => updateActivityQuantity(a.id, -1)}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  disabled={quantity === 0}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateActivityQuantity(a.id, 1)}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}

                {isArquiteto && (
                  <div className="space-y-2 pt-4">
                    <label className="text-sm font-medium text-gray-700">
                      Número(s) do(s) processo(s) analisado(s) no dia
                    </label>
                    <textarea
                      placeholder="Insira os números dos processos separados por vírgula..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                      value={formData.processosAnalisados || ''}
                      onChange={e => setFormData({ ...formData, processosAnalisados: e.target.value })}
                    />
                  </div>
                )}

                {errors.atividades && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.atividades}
                  </div>
                )}
              </motion.div>
            )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Summary Section */}
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <FileText className="w-4 h-4" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Resumo do Registro</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Data</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formData.dataTeletrabalho ? format(parseISO(formData.dataTeletrabalho), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '-'}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Pontuação Total</p>
                        <p className="text-sm font-bold text-blue-600">{formData.pontuacaoTotal} pontos</p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Atividades Selecionadas</p>
                      <ul className="space-y-1">
                        {formData.atividades?.map(ar => {
                          const activity = activities.find(a => a.id === ar.id);
                          return activity ? (
                            <li key={ar.id} className="text-xs text-gray-700 flex justify-between gap-2">
                              <span>• {activity.descricao}</span>
                              <span className="font-bold text-blue-600 whitespace-nowrap">{ar.quantidade}x</span>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  </div>

                  {isArquiteto && techAnalysisActivitiesCount > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 flex items-center justify-between">
                        <span>Número(s) do(s) processo(s) analisado(s)</span>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                          Obrigatório: {techAnalysisActivitiesCount} processos
                        </span>
                      </label>
                      <textarea
                        placeholder="Insira os números dos processos separados por vírgula..."
                        className={cn(
                          "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]",
                          errors.processosAnalisados ? "border-red-300 bg-red-50" : "border-gray-200"
                        )}
                        value={formData.processosAnalisados || ''}
                        onChange={e => setFormData({ ...formData, processosAnalisados: e.target.value })}
                      />
                      {errors.processosAnalisados && <p className="text-xs text-red-500">{errors.processosAnalisados}</p>}
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-900">
                      Dificuldades ou impedimentos excepcionais (Opcional)
                    </label>
                    <textarea
                      placeholder="Descreva aqui qualquer dificuldade técnica ou impedimento..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                      value={formData.dificuldades || ''}
                      onChange={e => setFormData({ ...formData, dificuldades: e.target.value })}
                    />
                  </div>

                  {formData.dataTeletrabalho && formData.dataTeletrabalho < format(new Date(), 'yyyy-MM-dd') && (
                    <div className="space-y-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                        <AlertCircle className="w-4 h-4" /> Registro Retroativo Detectado
                      </div>
                      <label className="text-sm font-medium text-amber-900">
                        Motivo do preenchimento fora da data correta
                      </label>
                      <textarea
                        placeholder="Justifique o preenchimento em data posterior..."
                        className={cn(
                          "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-amber-500 outline-none min-h-[80px]",
                          errors.motivoAtraso ? "border-red-300" : "border-amber-200"
                        )}
                        value={formData.motivoAtraso || ''}
                        onChange={e => setFormData({ ...formData, motivoAtraso: e.target.value })}
                      />
                      {errors.motivoAtraso && <p className="text-xs text-red-500">{errors.motivoAtraso}</p>}
                    </div>
                  )}

                  {/* Confirmation Checkbox */}
                  <div className="pt-6 border-t border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={cn(
                        "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                        confirmed ? "bg-green-600 border-green-600" : "border-gray-300 group-hover:border-blue-500"
                      )}>
                        {confirmed && <Check className="w-4 h-4 text-white" />}
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={confirmed}
                          onChange={() => setConfirmed(!confirmed)}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Confirmo que as informações acima estão corretas e completas.</span>
                    </label>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !confirmed}
              className={cn(
                "flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded-lg font-bold transition-all shadow-sm hover:shadow-md",
                (isSubmitting || !confirmed) ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              )}
            >
              {isSubmitting ? (
                <>Enviando...</>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Finalizar Registro
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
