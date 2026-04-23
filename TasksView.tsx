import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  CheckSquare, 
  Clock,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  History,
  Zap,
  Link as LinkIcon,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { LogEntry } from '../types';

const mockLogs: LogEntry[] = [
  { 
    id: '1', 
    user: 'João Carlos', 
    date: '25/03/2026', 
    time: '09:15',
    whatDone: 'Finalizei a integração com o webhook do Bitrix24 e testei o fluxo de tickets.',
    whatNext: 'Iniciar o mapeamento dos campos personalizados do Movidesk.',
    blockers: 'Nenhum.',
    status: 'Concluído',
    links: ['https://jira.com/task-123']
  },
  { 
    id: '2', 
    user: 'Ana Costa', 
    date: '25/03/2026', 
    time: '10:30',
    whatDone: 'Revisão das métricas de SLA do dashboard executivo.',
    whatNext: 'Ajustar as cores dos gráficos conforme feedback da diretoria.',
    blockers: 'Aguardando acesso ao servidor de homologação.',
    status: 'Em andamento',
    links: []
  },
  { 
    id: '3', 
    user: 'Marcos Silva', 
    date: '24/03/2026', 
    time: '16:45',
    whatDone: 'Suporte técnico para o cliente TechCorp sobre instabilidade no portal.',
    whatNext: 'Documentar a solução aplicada no KB.',
    blockers: 'Log do servidor estava incompleto.',
    status: 'Pausado',
    links: ['https://movidesk.com/ticket/4582']
  },
];

export default function TasksView() {
  const [startDate, setStartDate] = useState('2026-03-26');
  const [endDate, setEndDate] = useState('2026-03-26');
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  const [checklist, setChecklist] = useState<{id: string, text: string, done: boolean}[]>([]);
  const [newTask, setNewTask] = useState('');
  const [whatDone, setWhatDone] = useState('');
  const [status, setStatus] = useState('Em andamento');
  const [blockers, setBlockers] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const handleUpdateSelectedLog = (field: keyof LogEntry, value: any) => {
    if (!selectedLog) return;
    const updated = { ...selectedLog, [field]: value };
    setSelectedLog(updated);
    setLogs(logs.map(l => l.id === updated.id ? updated : l));
  };

  const addLink = () => {
    if (newLink.trim()) {
      setLinks([...links, newLink]);
      setNewLink('');
    }
  };

  const removeLink = (indexToRemove: number) => {
    setLinks(links.filter((_, index) => index !== indexToRemove));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setChecklist([...checklist, { id: Date.now().toString(), text: newTask, done: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: string) => {
    setChecklist(checklist.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handlePublish = () => {
    if (!whatDone.trim()) {
      toast.error('Por favor, descreva o andamento das atividades.');
      return;
    }

    const now = new Date();
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      user: 'João Carlos', // Em um app real viria do contexto de auth
      date: now.toLocaleDateString('pt-BR'),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      whatDone: whatDone,
      whatNext: '', // Can be kept or removed based on needs
      blockers: blockers.trim() || 'Nenhum',
      status: status,
      links: [...links]
    };

    setLogs([newEntry, ...logs]);
    setWhatDone('');
    setBlockers('');
    setStatus('Em andamento');
    setLinks([]);
    setChecklist([]);
    toast.success('Registro publicado com sucesso!');
  };

  const filteredLogs = logs.filter(log => 
    log.whatDone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <History size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Diário de Bordo</h1>
            <p className="text-slate-500 font-medium mt-1">Meu Registro de Atividades</p>
          </div>
        </div>
      </div>

      {/* Date Selection & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 text-slate-600">
          <Calendar size={20} className="text-emerald-600" />
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">até</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button className="px-4 py-1.5 bg-white text-emerald-700 text-xs font-bold rounded-lg shadow-sm">
            Meu Registro
          </button>
          <button className="px-4 py-1.5 text-slate-500 text-xs font-bold rounded-lg hover:text-slate-700 transition-all">
            Equipe
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-600"></div>
            
            {/* Realizar no dia Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" />
                  Andamento das Atividades
                </label>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  <Calendar size={12} />
                  {new Date(startDate).toLocaleDateString('pt-BR')} - {new Date(endDate).toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                  >
                    <option value="A fazer">A fazer</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Pausado">Pausado</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
              </div>

              <textarea 
                value={whatDone}
                onChange={(e) => setWhatDone(e.target.value)}
                placeholder="Descreva detalhadamente suas atividades, PECs e entregas planejadas para este período..."
                className="w-full h-32 bg-slate-50/50 border border-slate-200 rounded-2xl p-6 text-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Blockers Section */}
            <div className="space-y-4">
              <label className="text-xs font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <AlertCircle size={14} />
                Empecilhos / Bloqueios
              </label>
              <textarea 
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="Existe algo bloqueando o andamento das tarefas? (Opcional)"
                className="w-full h-20 bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Links Section */}
            <div className="space-y-4">
              <label className="text-xs font-black text-emerald-800 uppercase tracking-[0.2em] flex items-center gap-2">
                <LinkIcon size={14} />
                Links e Referências
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addLink()}
                  placeholder="ID da tarefa (Jira, PEC) ou URL..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={addLink}
                  className="bg-slate-900 text-white px-4 rounded-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
              {links.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {links.map((link, i) => (
                    <div key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100 flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                      <span className="truncate max-w-[200px]">{link}</span>
                      <button 
                        onClick={() => removeLink(i)}
                        className="ml-1 text-emerald-400 hover:text-emerald-700 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-medium italic">
                * O registro será salvo automaticamente como rascunho.
              </p>
              <button 
                type="button"
                onClick={handlePublish}
                className="bg-orange-500 text-white px-10 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2"
              >
                <Plus size={18} />
                Publicar no Diário
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Checklist & History Summary */}
        <div className="space-y-6">
          {/* Checklist Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                  <CheckSquare size={18} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Checklist</h3>
              </div>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                {checklist.filter(t => t.done).length}/{checklist.length}
              </span>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Nova tarefa..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
              <button 
                type="button"
                onClick={addTask}
                className="bg-orange-500 text-white p-2 rounded-xl hover:bg-orange-600 transition-all active:scale-95"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {checklist.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                    <CheckSquare size={24} />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Nenhuma tarefa específica.</p>
                </div>
              ) : (
                checklist.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 group animate-in slide-in-from-left-2 duration-200">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all",
                        task.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-200 hover:border-emerald-500 bg-white"
                      )}
                    >
                      {task.done && <Plus size={14} className="rotate-45" />}
                    </button>
                    <span className={cn(
                      "text-sm font-medium transition-all", 
                      task.done ? "text-slate-400 line-through" : "text-slate-700"
                    )}>
                      {task.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats/Info */}
          <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-4 shadow-xl shadow-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold">Produtividade</h4>
                <p className="text-[10px] text-slate-400">Seu desempenho hoje</p>
              </div>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000" 
                style={{ width: checklist.length ? `${(checklist.filter(t => t.done).length / checklist.length) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="pt-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
              <History size={20} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Histórico de Registros</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Filtrar histórico..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map((log) => (
            <div 
              key={log.id} 
              onClick={() => setSelectedLog(log)}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-emerald-200 transition-all group overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="p-6 flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      {log.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{log.user}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{log.date}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                    {log.time}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className={cn(
                    "flex items-center gap-2",
                    log.status === 'Concluído' ? "text-emerald-600" : 
                    log.status === 'Em andamento' ? "text-blue-600" : 
                    log.status === 'Pausado' ? "text-amber-600" : "text-slate-600"
                  )}>
                    <CheckSquare size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{log.status}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                    {log.whatDone}
                  </p>
                  
                  {log.blockers && log.blockers !== 'Nenhum' && log.blockers !== 'Nenhum.' && (
                    <div className="mt-3 p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-2">
                      <AlertCircle size={14} className="text-rose-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-rose-700 font-medium line-clamp-2 group-hover:line-clamp-none transition-all">{log.blockers}</p>
                    </div>
                  )}

                  {log.links && log.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {log.links.map((link, i) => (
                        <a 
                          key={i}
                          href={link.startsWith('http') ? link : `https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors truncate max-w-full flex items-center gap-1.5"
                        >
                          <LinkIcon size={10} />
                          {link.replace(/^https?:\/\//, '')}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-emerald-50/50 transition-colors">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ver Detalhes</span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-sm font-black text-slate-600 shadow-sm">
                  {selectedLog.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedLog.user}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Calendar size={12} />
                    {selectedLog.date} às {selectedLog.time}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)} 
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedLog.status}
                    onChange={(e) => handleUpdateSelectedLog('status', e.target.value)}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider outline-none appearance-none cursor-pointer border-2",
                      selectedLog.status === 'Concluído' ? "bg-emerald-100 text-emerald-700 border-emerald-200" : 
                      selectedLog.status === 'Em andamento' ? "bg-blue-100 text-blue-700 border-blue-200" : 
                      selectedLog.status === 'Pausado' ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-700 border-slate-200"
                    )}
                  >
                    <option value="A fazer">A fazer</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Pausado">Pausado</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Andamento das Atividades</h4>
                  <textarea 
                    value={selectedLog.whatDone}
                    onChange={(e) => handleUpdateSelectedLog('whatDone', e.target.value)}
                    className="w-full text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none min-h-[100px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black text-rose-500 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle size={14} />
                  Empecilhos / Bloqueios
                </h4>
                <textarea 
                  value={selectedLog.blockers}
                  onChange={(e) => handleUpdateSelectedLog('blockers', e.target.value)}
                  placeholder="Nenhum empecilho relatado..."
                  className="w-full text-sm text-rose-700 leading-relaxed bg-rose-50 p-4 rounded-2xl border border-rose-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all resize-none min-h-[80px]"
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                  <LinkIcon size={14} />
                  Links e Referências
                </h4>
                
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    id="modal-new-link"
                    placeholder="Adicionar novo link..."
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget;
                        if (input.value.trim()) {
                          handleUpdateSelectedLog('links', [...(selectedLog.links || []), input.value.trim()]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('modal-new-link') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        handleUpdateSelectedLog('links', [...(selectedLog.links || []), input.value.trim()]);
                        input.value = '';
                      }
                    }}
                    className="bg-slate-900 text-white px-3 rounded-xl hover:bg-black transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {selectedLog.links && selectedLog.links.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {selectedLog.links.map((link, i) => (
                      <div key={i} className="flex items-center justify-between bg-emerald-50 p-3 rounded-xl border border-emerald-100 group">
                        <a 
                          href={link.startsWith('http') ? link : `https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-2 flex-1 truncate"
                        >
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          <span className="truncate">{link}</span>
                        </a>
                        <button 
                          onClick={() => {
                            const newLinks = [...(selectedLog.links || [])];
                            newLinks.splice(i, 1);
                            handleUpdateSelectedLog('links', newLinks);
                          }}
                          className="text-emerald-400 hover:text-emerald-700 p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
