import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  X,
  Settings,
  Bot,
  MessageSquare,
  Bell,
  Send,
  UserCheck,
  Book,
  FileText,
  Building,
  AlertTriangle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toast } from 'sonner';
import { useTickets } from '../context/TicketContext';
import { cn } from '../lib/utils';
import { Ticket, SupportRequest, Notification } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const accessData = [
  { name: '30/03', acessos: 30000 },
  { name: '31/03', acessos: 28000 },
  { name: '01/04', acessos: 32000 },
  { name: '02/04', acessos: 35000 },
  { name: '03/04', acessos: 3000 },
  { name: '04/04', acessos: 4000 },
  { name: '05/04', acessos: 2000 },
  { name: '06/04', acessos: 500 },
];

const trafficData = [
  { name: 'Seg', atendimentos: 45, resolvidos: 38 },
  { name: 'Ter', atendimentos: 52, resolvidos: 48 },
  { name: 'Qua', atendimentos: 48, resolvidos: 42 },
  { name: 'Qui', atendimentos: 61, resolvidos: 55 },
  { name: 'Sex', atendimentos: 55, resolvidos: 50 },
  { name: 'Sáb', atendimentos: 32, resolvidos: 28 },
  { name: 'Dom', atendimentos: 18, resolvidos: 15 },
];

const healthScoreData = [
  { name: 'Frios', value: 22, color: '#EF4444' },
  { name: 'Mornos', value: 9, color: '#F59E0B' },
  { name: 'Quentes', value: 423, color: '#10B981' },
];

const productivityData = [
  { name: 'Suporte', value: 85 },
  { name: 'Financeiro', value: 92 },
  { name: 'Vendas', value: 78 },
  { name: 'Operação', value: 95 },
];

export default function DashboardView({ onNavigate }: { onNavigate?: (view: any, tab?: string) => void }) {
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const { 
    tickets, 
    addTicket, 
    updateTicketStatus, 
    supportRequests, 
    acceptSupportRequest, 
    sendSupportMessage,
    notifications,
    markNotificationRead
  } = useTickets();
  
  const [activeSupportId, setActiveSupportId] = useState<string | null>(null);
  const [agentMessage, setAgentMessage] = useState('');

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const employeeNotifications = notifications.filter(n => n.userId === 'employee');
  const unreadNotifications = employeeNotifications.filter(n => !n.read);
  const pendingSupport = supportRequests.filter(req => req.status === 'Pendente');
  const activeSupport = supportRequests.find(req => req.id === activeSupportId);

  const handleAction = (label: string, view?: string) => {
    if (view && onNavigate) {
      onNavigate(view);
      toast.success(`Navegando para ${label}`);
    } else {
      toast.info(`Funcionalidade de ${label} em desenvolvimento`);
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    addTicket({
      customer: formData.get('customer') as string,
      subject: formData.get('subject') as string,
      description: formData.get('description') as string,
      priority: 'Média', // Default
    });

    toast.success('Chamado criado com sucesso!');
    setIsNewTicketModalOpen(false);
  };

  const handleSendAgentMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentMessage.trim() || !activeSupportId) return;
    
    sendSupportMessage(activeSupportId, {
      sender: 'João (Suporte)',
      text: agentMessage,
      isAgent: true
    });
    setAgentMessage('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Controle</h1>
          <p className="text-slate-500 font-medium mt-1">Bem-vindo de volta, João. Aqui está o panorama da sua operação.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 shadow-sm">
            <Clock size={14} />
            Sincronizado há 2 min
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {[
          { id: 'saamia', label: 'IA', icon: Bot, color: 'rose' },
          { id: 'settings', label: 'Configurações', icon: Settings, color: 'slate' },
          { id: 'movidesk', label: 'Suporte', icon: Zap, color: 'amber' },
        ].map((action, i) => (
          <button 
            key={i} 
            onClick={() => handleAction(action.label, action.id)}
            className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group relative"
          >
            {action.id === 'movidesk' && pendingSupport.length > 0 && (
              <span className="absolute top-2 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
            <div className={cn(
              "p-2 rounded-lg mb-2 transition-colors",
              action.color === 'blue' && "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
              action.color === 'indigo' && "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
              action.color === 'emerald' && "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
              action.color === 'rose' && "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
              action.color === 'slate' && "bg-slate-50 text-slate-600 group-hover:bg-slate-600 group-hover:text-white",
              action.color === 'amber' && "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
            )}>
              <action.icon size={20} />
            </div>
            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'DIÁRIO DE BORDO', value: '0', change: '+0% vs ontem', icon: Book, color: 'blue', changeColor: 'emerald' },
          { label: 'PENDÊNCIAS', value: '7', change: 'Clique para avaliar →', icon: FileText, color: 'amber', changeColor: 'amber' },
          { label: 'BASE ATIVA', value: '454', change: 'Clientes monitorados', icon: Building, color: 'emerald', changeColor: 'slate' },
          { label: 'RISCO DE CHURN', value: '26', change: 'Verifique imediatamente', icon: AlertTriangle, color: 'rose', changeColor: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className={cn(
                  "text-3xl font-black mt-1",
                  stat.color === 'blue' && "text-blue-600",
                  stat.color === 'amber' && "text-slate-900",
                  stat.color === 'emerald' && "text-slate-900",
                  stat.color === 'rose' && "text-rose-600"
                )}>{stat.value}</h3>
              </div>
              <div className={cn(
                "p-3 rounded-xl",
                stat.color === 'blue' && "bg-blue-50 text-blue-600",
                stat.color === 'amber' && "bg-amber-50 text-amber-600",
                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                stat.color === 'rose' && "bg-rose-50 text-rose-600",
              )}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4">
              <div className={cn(
                "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md",
                stat.changeColor === 'emerald' && "bg-emerald-50 text-emerald-600",
                stat.changeColor === 'amber' && "text-amber-600",
                stat.changeColor === 'slate' && "text-slate-400",
                stat.changeColor === 'rose' && "text-rose-600"
              )}>
                {stat.changeColor === 'emerald' && <TrendingUp size={12} />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Support Queue & Active Chat - Moved to a collapsible section or similar */}
      {(pendingSupport.length > 0 || activeSupportId) && (
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-blue-900 flex items-center gap-2">
                <MessageSquare size={24} />
                Centro de Suporte em Tempo Real
              </h2>
              {pendingSupport.length > 0 && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                  className="flex items-center gap-1.5 bg-rose-500 text-white px-3 py-1 rounded-full shadow-lg shadow-rose-500/30"
                >
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Novo Chamado!</span>
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Sistema Ativo</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Support Queue */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Users size={20} className="text-blue-500" />
                  Fila de Espera
                </h3>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase">
                  {pendingSupport.length} Pendentes
                </span>
              </div>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {pendingSupport.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-400 font-medium">Nenhum pedido aguardando</p>
                  </div>
                )}
                
                {pendingSupport.map(req => (
                  <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{req.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 italic">"{req.messages[0].text}"</p>
                    <button 
                      onClick={() => {
                        acceptSupportRequest(req.id, 'João (Suporte)');
                        setActiveSupportId(req.id);
                      }}
                      className="w-full py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 transition-all uppercase tracking-widest"
                    >
                      Aceitar
                    </button>
                  </div>
                ))}
                
                {supportRequests.filter(r => r.status === 'Em Atendimento').map(req => (
                  <button 
                    key={req.id}
                    onClick={() => setActiveSupportId(req.id)}
                    className={cn(
                      "w-full p-4 rounded-2xl border transition-all text-left space-y-1",
                      activeSupportId === req.id ? "bg-blue-50 border-blue-200" : "bg-white border-slate-100 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{req.customerName}</span>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <p className="text-[10px] text-slate-400">Atendido por {req.acceptedBy}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-[350px]">
              {activeSupport ? (
                <>
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Bot size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{activeSupport.customerName}</h4>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Atendimento Ativo</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveSupportId(null)} className="p-2 text-slate-400 hover:text-slate-600">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[250px]">
                    {activeSupport.messages.map((msg, i) => (
                      <div key={i} className={cn(
                        "flex flex-col max-w-[80%]",
                        msg.isAgent ? "ml-auto items-end" : "items-start"
                      )}>
                        <div className={cn(
                          "p-3 rounded-2xl text-xs leading-relaxed",
                          msg.isAgent ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-700 rounded-tl-none"
                        )}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 font-bold uppercase tracking-widest">
                          {msg.sender} • {msg.time}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <form onSubmit={handleSendAgentMessage} className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={agentMessage}
                        onChange={(e) => setAgentMessage(e.target.value)}
                        placeholder="Digite sua resposta..." 
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-12 py-3 text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                      />
                      <button 
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                    <MessageSquare size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-400 text-sm">Selecione um atendimento</h4>
                    <p className="text-[11px] text-slate-300 mt-1">Aguardando interação na fila de suporte.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">
              Tendência de Acessos
            </h3>
            <div className="flex items-center gap-2">
              <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-3 py-1.5 focus:ring-0 outline-none">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
              </select>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accessData}>
                <defs>
                  <linearGradient id="colorAcessos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(label) => `Dia: ${label}`}
                  formatter={(value: any) => [`${value}`, 'Acessos']}
                />
                <Area type="monotone" dataKey="acessos" name="Acessos" stroke="#1E3A8A" strokeWidth={3} fillOpacity={1} fill="url(#colorAcessos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Score */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900">Health Score da Base</h3>
          <p className="text-xs text-slate-500 mt-1">Distribuição de saúde dos clientes ativos.</p>
          
          <div className="flex-1 flex flex-col items-center justify-center relative mt-8 mb-4">
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthScoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {healthScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">454</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            {healthScoreData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              Tráfego e Performance do Sistema
            </h3>
            <div className="flex items-center gap-2">
              <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-3 py-1.5 focus:ring-0 outline-none">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
              </select>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorAtend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(label) => `Dia: ${label}`}
                  formatter={(value: any) => [`${value} req/s`, 'Tráfego']}
                />
                <Area type="monotone" dataKey="atendimentos" name="Tráfego" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorAtend)" />
                <Area type="monotone" dataKey="resolvidos" name="Sucesso" stroke="#10B981" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Productivity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Produtividade por Equipe</h3>
          <div className="space-y-4">
            {productivityData.map((team, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">{team.name}</span>
                  <span className="text-slate-900">{team.value}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500",
                      i === 0 ? "bg-blue-500" : i === 1 ? "bg-emerald-500" : i === 2 ? "bg-amber-500" : "bg-indigo-500"
                    )} 
                    style={{ width: `${team.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div className="lg:col-span-2 bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-sm text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap size={80} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Zap size={18} />
              </div>
              <h3 className="font-bold text-lg">Insights da SAAMia</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-1">Carga do Sistema</p>
                <p className="text-sm text-slate-300 leading-relaxed">Pico de acessos detectado às 10h. Recursos escalados automaticamente para manter a performance.</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">Segurança</p>
                <p className="text-sm text-slate-300 leading-relaxed">Nenhuma tentativa de invasão detectada nas últimas 24h. Firewall ativo e monitorando tráfego.</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Zap size={20} className="text-amber-500" />
            Status do Sistema
          </h3>
          <div className="space-y-4">
            {[
              { label: 'API Gateway', status: 'Operacional', color: 'emerald' },
              { label: 'Banco de Dados', status: 'Operacional', color: 'emerald' },
              { label: 'IA Engine', status: 'Latência Alta', color: 'amber' },
              { label: 'WhatsApp API', status: 'Operacional', color: 'emerald' },
              { label: 'Integração Movidesk', status: 'Operacional', color: 'emerald' },
            ].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-600">{service.label}</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    service.color === 'emerald' ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {service.status}
                  </span>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    service.color === 'emerald' ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  )} />
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            Ver Logs do Sistema
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
