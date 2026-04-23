import React, { useState } from 'react';
import { 
  Ticket, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Bot,
  X,
  Share2,
  ChevronRight,
  CheckCircle,
  User,
  Users,
  Calendar,
  HelpCircle,
  Pin,
  Inbox,
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  History,
  Eye,
  TrendingUp,
  BarChart3 as BarChartIcon,
  Phone,
  Mail,
  MapPin,
  Send,
  Paperclip,
  Smile,
  MessageCircle,
  Bell,
  Settings,
  Zap,
  ArrowRightLeft,
  FileText,
  Download,
  Shield,
  Sparkles,
  Layers,
  Rocket,
  Loader2,
  Star
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie
} from 'recharts';
import { toast } from 'sonner';
import { useTickets } from '../context/TicketContext';
import { cn } from '../lib/utils';

type Tab = 'inicio' | 'pessoas' | 'indicadores' | 'relatorios' | 'configuracoes';

interface MovideskViewProps {
  initialTab?: Tab;
}

export default function MovideskView({ initialTab = 'inicio' }: MovideskViewProps) {
  const { 
    tickets, 
    addTicket, 
    updateTicketStatus, 
    addMessage, 
    notifications, 
    supportRequests, 
    markNotificationRead, 
    acceptSupportRequest,
    sendSupportMessage 
  } = useTickets();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [showOpenTicketsCheck, setShowOpenTicketsCheck] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [agentStatus, setAgentStatus] = useState<'online' | 'offline' | 'pausa'>('online');
  const [showNotifications, setShowNotifications] = useState(false);
  const [macros] = useState([
    { id: '1', name: 'Saudação Inicial', text: 'Olá! Como posso ajudar você hoje?' },
    { id: '2', name: 'Agradecimento', text: 'Obrigado pelo contato! Estamos à disposição.' },
    { id: '3', name: 'Pedido de Informação', text: 'Poderia nos informar o número do seu pedido para agilizar o atendimento?' },
    { id: '4', name: 'Encerramento', text: 'Seu atendimento foi concluído. Tenha um ótimo dia!' },
  ]);
  const [showMacros, setShowMacros] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isCSTAModalOpen, setIsCSTAModalOpen] = useState(false);
  const [isNewPersonModalOpen, setIsNewPersonModalOpen] = useState(false);

  const employeeNotifications = notifications.filter(n => n.userId === 'employee');
  const unreadNotifications = employeeNotifications.filter(n => !n.read);
  const [queue, setQueue] = useState([
    { 
      id: 'Q1', 
      customer: 'João Silva', 
      subject: 'Dúvida sobre fatura', 
      description: 'Gostaria de entender melhor os lançamentos da minha última fatura, pois há um valor que não reconheço.',
      aiSummary: 'Dúvida sobre lançamentos na fatura. Cliente não reconhece um valor específico.',
      time: '05:20', 
      priority: 'Média' 
    },
    { 
      id: 'Q2', 
      customer: 'Maria Oliveira', 
      subject: 'Acesso bloqueado', 
      description: 'Meu acesso ao sistema foi bloqueado após três tentativas de senha incorretas. Preciso de ajuda para resetar.',
      aiSummary: 'Acesso bloqueado por excesso de tentativas. Necessário reset de senha.',
      time: '02:15', 
      priority: 'Alta' 
    },
    { 
      id: 'Q3', 
      customer: 'Carlos Santos', 
      subject: 'Problema no app', 
      description: 'O aplicativo está fechando sozinho sempre que tento abrir a aba de relatórios.',
      aiSummary: 'Crash no aplicativo ao acessar aba de relatórios.',
      time: '01:45', 
      priority: 'Baixa' 
    },
  ]);

  const handlePullFromQueue = (item: any) => {
    const newTicket = addTicket({
      customer: item.customer,
      subject: item.subject,
      description: item.description,
      priority: item.priority,
      aiSummary: item.aiSummary,
      messages: [
        { id: '1', sender: item.customer, text: item.description, time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), isAgent: false }
      ]
    });
    setQueue(prev => prev.filter(q => q.id !== item.id));
    setSelectedTicketId(newTicket.id);
    toast.success(`Chamado de ${item.customer} puxado com sucesso!`);
  };

  const handleTransfer = (target: string) => {
    toast.success(`Chamado transferido para ${target}`);
    setIsTransferModalOpen(false);
  };

  // Update active tab if initialTab changes (e.g. when navigating from sidebar)
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;

  const handleAction = (action: string) => {
    toast.success(`${action} realizado com sucesso!`);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    addTicket({
      customer: formData.get('customer') as string,
      subject: formData.get('subject') as string,
      description: formData.get('description') as string,
      priority: 'Média',
    });

    toast.success('Chamado criado com sucesso no Movidesk!');
    setIsNewTicketModalOpen(false);
  };

  const handleCloseTicket = () => {
    if (!selectedTicketId) return;
    updateTicketStatus(selectedTicketId, 'Resolvido');
    toast.success(`Chamado #${selectedTicketId} concluído com sucesso!`);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Ticket size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Central Movidesk</h1>
            <p className="text-slate-500 font-medium mt-1">Gestão unificada de chamados e integração em tempo real.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm relative"
            >
              <Bell size={20} />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Notificações</h3>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {unreadNotifications.length} novas
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {employeeNotifications.length > 0 ? (
                    employeeNotifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => markNotificationRead(notif.id)}
                        className={cn(
                          "p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors",
                          !notif.read && "bg-blue-50/30"
                        )}
                      >
                        <div className="flex gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            notif.type === 'new_support_request' ? "bg-orange-100 text-orange-600" : 
                            notif.type === 'new_ticket' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                          )}>
                            {notif.type === 'new_support_request' ? <Zap size={16} /> : 
                             notif.type === 'new_ticket' ? <Ticket size={16} /> : <Bell size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {new Date(notif.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {!notif.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>}
                        </div>
                        {notif.type === 'new_support_request' && (
                          <div className="mt-3">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab('indicadores');
                                setShowNotifications(false);
                              }}
                              className="w-full py-1.5 bg-orange-500 text-white text-[10px] font-bold rounded uppercase tracking-wider hover:bg-orange-600 transition-all"
                            >
                              Atender Agora
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-xs text-slate-400">Nenhuma notificação</p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-slate-100 text-center">
                  <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider">Ver todas</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full ml-2",
              agentStatus === 'online' ? "bg-emerald-500" : agentStatus === 'pausa' ? "bg-amber-500" : "bg-slate-300"
            )}></div>
            <select 
              value={agentStatus}
              onChange={(e) => setAgentStatus(e.target.value as any)}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none pr-2"
            >
              <option value="online">Online</option>
              <option value="pausa">Pausa</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Servidores Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Hoje', value: tickets.length, color: 'blue', icon: Ticket },
          { label: 'Em Aberto', value: tickets.filter(t => t.status === 'Aberto').length, color: 'amber', icon: Clock },
          { label: 'SLA Crítico', value: tickets.filter(t => t.priority === 'Crítica').length, color: 'rose', icon: AlertCircle },
          { label: 'Resolvidos', value: tickets.filter(t => t.status === 'Resolvido').length, color: 'emerald', icon: CheckCircle2 },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                stat.color === 'blue' && "bg-blue-50 text-blue-600",
                stat.color === 'amber' && "bg-amber-50 text-amber-600",
                stat.color === 'rose' && "bg-rose-50 text-rose-600",
                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
              )}>
                <stat.icon size={16} />
              </div>
            </div>
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('inicio')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'inicio' ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <LayoutDashboard size={16} />
          Início
        </button>
        <button
          onClick={() => setActiveTab('pessoas')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'pessoas' ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Users size={16} />
          Pessoas / Clientes
        </button>
        <button
          onClick={() => setActiveTab('indicadores')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'indicadores' ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <BarChart3 size={16} />
          Chat & Indicadores
        </button>
        <button
          onClick={() => setActiveTab('relatorios')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'relatorios' ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <BarChartIcon size={16} />
          Relatórios
        </button>
        <button
          onClick={() => setActiveTab('configuracoes')}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'configuracoes' ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Settings size={16} />
          Configurações
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {activeTab === 'inicio' && (
          <InicioTab 
            tickets={tickets} 
            selectedTicketId={selectedTicketId} 
            setSelectedTicketId={setSelectedTicketId}
            updateTicketStatus={updateTicketStatus}
            addMessage={addMessage}
            setActiveTab={setActiveTab}
            queue={queue}
            handlePullFromQueue={handlePullFromQueue}
            setIsTransferModalOpen={setIsTransferModalOpen}
            supportRequests={supportRequests}
          />
        )}
        {activeTab === 'pessoas' && (
          <PessoasTab 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            setIsNewPersonModalOpen={setIsNewPersonModalOpen}
          />
        )}
        {activeTab === 'indicadores' && (
          <IndicadoresTab 
            macros={macros} 
            showMacros={showMacros} 
            setShowMacros={setShowMacros}
            setIsCSTAModalOpen={setIsCSTAModalOpen}
            supportRequests={supportRequests}
            acceptSupportRequest={acceptSupportRequest}
            sendSupportMessage={sendSupportMessage}
          />
        )}
        {activeTab === 'relatorios' && <RelatoriosTab tickets={tickets} />}
        {activeTab === 'configuracoes' && <ConfiguracoesTab />}
      </div>

      {/* New Person Modal */}
      {isNewPersonModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Cadastrar Nova Pessoa/Empresa</h3>
              <button onClick={() => setIsNewPersonModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Cadastro realizado com sucesso!'); setIsNewPersonModalOpen(false); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tipo</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none">
                    <option>Pessoa Física</option>
                    <option>Pessoa Jurídica</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Perfil</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none">
                    <option>Cliente</option>
                    <option>Agente</option>
                    <option>Administrador</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nome / Razão Social</label>
                <input type="text" placeholder="Nome completo" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">E-mail</label>
                <input type="email" placeholder="email@exemplo.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Telefone</label>
                  <input type="text" placeholder="(00) 00000-0000" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Documento (CPF/CNPJ)</label>
                  <input type="text" placeholder="000.000.000-00" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsNewPersonModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">Salvar Cadastro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Ticket Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Transferir Chamado</h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Departamento Destino</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Suporte N2</option>
                  <option>Desenvolvimento</option>
                  <option>Financeiro</option>
                  <option>Comercial</option>
                  <option>Sucesso do Cliente</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Agente (Opcional)</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Qualquer Agente</option>
                  <option>Ricardo Silva</option>
                  <option>Amanda Costa</option>
                  <option>Bruno Oliveira</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Motivo da Transferência</label>
                <textarea rows={3} placeholder="Explique o motivo da transferência..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsTransferModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancelar</button>
                <button 
                  onClick={() => { toast.success('Chamado transferido com sucesso!'); setIsTransferModalOpen(false); }} 
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InicioTab({ 
  tickets, 
  selectedTicketId, 
  setSelectedTicketId,
  updateTicketStatus,
  addMessage,
  setActiveTab,
  queue,
  handlePullFromQueue,
  setIsTransferModalOpen,
  supportRequests
}: { 
  tickets: any[], 
  selectedTicketId: string | null, 
  setSelectedTicketId: (id: string) => void,
  updateTicketStatus: any,
  addMessage: any,
  setActiveTab: (tab: Tab) => void,
  queue: any[],
  handlePullFromQueue: (item: any) => void,
  setIsTransferModalOpen: (open: boolean) => void,
  supportRequests: any[]
}) {
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [service, setService] = useState('Suporte Técnico');
  const [category, setCategory] = useState('Dúvida');
  const [justification, setJustification] = useState('');

  // Reset fields when ticket changes and auto-analyze
  React.useEffect(() => {
    if (selectedTicket) {
      setService('Suporte Técnico');
      setCategory('Dúvida');
      setJustification('');
      setSelectedFiles([]);
      setReplyText('');
      setIsReplying(false);
      
      // Auto trigger analysis
      setIsAnalyzing(true);
      
      const timer = setTimeout(() => {
        const subject = selectedTicket.subject.toLowerCase();
        const desc = selectedTicket.description.toLowerCase();
        let newCategory = 'Dúvida';
        let newService = 'Suporte Técnico';
        
        if (subject.includes('erro') || subject.includes('falha') || subject.includes('bug') || desc.includes('erro')) {
          newCategory = 'Problema';
          newService = 'Manutenção Corretiva';
        } else if (subject.includes('novo') || subject.includes('criar') || subject.includes('adicionar') || desc.includes('novo')) {
          newCategory = 'Solicitação';
          newService = 'Melhoria';
        }
        
        setService(newService);
        setCategory(newCategory);
        setJustification(selectedTicket.aiSummary || `Análise automática: Identificado como ${newCategory.toLowerCase()} referente a ${newService.toLowerCase()} com base na descrição do cliente.`);
        setIsAnalyzing(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedTicket?.id]);

  const handleAnalyzeWithAI = () => {
    setIsAnalyzing(true);
    toast.info('Analisando chamado com IA...', { duration: 2000 });
    
    setTimeout(() => {
      const subject = selectedTicket?.subject.toLowerCase() || '';
      const desc = selectedTicket?.description.toLowerCase() || '';
      let newCategory = 'Dúvida';
      let newService = 'Suporte Técnico';
      
      if (subject.includes('erro') || subject.includes('falha') || subject.includes('bug') || desc.includes('erro')) {
        newCategory = 'Problema';
        newService = 'Manutenção Corretiva';
      } else if (subject.includes('novo') || subject.includes('criar') || subject.includes('adicionar') || desc.includes('novo')) {
        newCategory = 'Solicitação';
        newService = 'Melhoria';
      }
      
      setService(newService);
      setCategory(newCategory);
      setJustification(selectedTicket?.aiSummary || `Análise da IA: Identificado como ${newCategory.toLowerCase()} referente a ${newService.toLowerCase()} com base na descrição do cliente.`);
      setIsAnalyzing(false);
      toast.success('Análise concluída!');
    }, 1500);
  };

  const pendingSupport = supportRequests.filter(r => r.status === 'Pendente');

  const handleSendReply = () => {
    if (!replyText.trim() && selectedFiles.length === 0) return;
    if (!selectedTicketId) return;
    
    addMessage(selectedTicketId, {
      sender: 'Suporte Movidesk',
      text: replyText || 'Enviou anexos',
      isAgent: true,
      attachments: selectedFiles.map(f => f.name)
    });

    toast.success('Resposta enviada com sucesso!');
    setReplyText('');
    setSelectedFiles([]);
    setIsReplying(false);
    updateTicketStatus(selectedTicketId, 'Em Análise');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900">Olá, <span className="text-blue-600">João.</span></h2>
        <p className="text-slate-500 text-sm">Que bom te ver por aqui! :)</p>
        <p className="text-slate-400 text-xs mt-1">Para acessar os contadores de tickets é só expandir os indicadores que deseja visualizar e utilizar normalmente</p>
      </div>

      {/* Expandable Counters and Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Meus tickets', icon: User, color: 'blue', count: tickets.length },
            { label: 'Tickets da minha equipe', icon: Users, color: 'blue', count: 12 },
            { label: 'Clientes Ativos', icon: Users, color: 'emerald', count: 1240 },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all shadow-sm group">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  item.color === 'blue' && "bg-blue-50 text-blue-600",
                  item.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                )}>
                  <item.icon size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-700">{item.label}</span>
                  <span className="text-lg font-black text-slate-900 leading-none mt-1">{item.count}</span>
                </div>
              </div>
              <ChevronDown size={18} className="text-slate-400" />
            </div>
          ))}
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Layers size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-orange-800">Fila de Espera</span>
              <span className="text-lg font-black text-orange-900 leading-none mt-1">{queue.length}</span>
            </div>
          </div>
          <button 
            onClick={() => queue.length > 0 && handlePullFromQueue(queue[0])}
            className="text-[10px] font-black bg-orange-600 text-white px-2 py-1 rounded uppercase tracking-wider hover:bg-orange-700 disabled:opacity-50"
            disabled={queue.length === 0}
          >
            Puxar
          </button>
        </div>
      </div>

      {/* Tickets and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Meus Tickets</h3>
            <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400">
              <Filter size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {tickets.filter(t => t.status !== 'Concluído' && t.status !== 'Resolvido').map((ticket) => (
              <div 
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={cn(
                  "p-4 cursor-pointer transition-all hover:bg-slate-50",
                  selectedTicketId === ticket.id ? "bg-blue-50/50 border-l-4 border-blue-500" : "border-l-4 border-transparent"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400">#{ticket.id}</span>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold",
                    ticket.status === 'Aberto' && "bg-amber-100 text-amber-600",
                    ticket.status === 'Em Análise' && "bg-blue-100 text-blue-600",
                    ticket.status === 'Resolvido' && "bg-emerald-100 text-emerald-600",
                    ticket.status === 'Aguardando Cliente' && "bg-slate-100 text-slate-600",
                  )}>
                    {ticket.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate">{ticket.subject}</h4>
                <p className="text-xs text-slate-500 mt-1 truncate">{ticket.customer}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400">{ticket.date.split(' ')[0]}</span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold",
                    ticket.priority === 'Crítica' ? "text-rose-500" : "text-slate-400"
                  )}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          {selectedTicket ? (
            <>
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <Ticket size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">#{selectedTicket.id} - {selectedTicket.subject}</h3>
                    <p className="text-[10px] text-slate-500">{selectedTicket.customer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Ticket Metadata Fields */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Serviço</label>
                    <select value={service} onChange={e => setService(e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Suporte Técnico</option>
                      <option>Financeiro</option>
                      <option>Comercial</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Categoria</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Dúvida</option>
                      <option>Problema</option>
                      <option>Sugestão</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Prazo (SLA)</label>
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                      <Clock size={12} />
                      2h 15min
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tags</label>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[9px] font-bold">#urgente</span>
                      <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold">+</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Justificativa</label>
                    <input type="text" value={justification} onChange={e => setJustification(e.target.value)} placeholder="Opcional..." className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Ações Rápidas</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsTransferModalOpen(true)}
                        className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-500" 
                        title="Transferir"
                      >
                        <ArrowRightLeft size={14} />
                      </button>
                      <button 
                        onClick={handleAnalyzeWithAI}
                        disabled={isAnalyzing}
                        className={cn("p-1.5 border rounded flex items-center gap-1 text-[10px] font-bold transition-all", isAnalyzing ? "bg-blue-50 border-blue-200 text-blue-400" : "bg-white border-blue-200 hover:bg-blue-50 text-blue-600")}
                        title="Analisar com IA"
                      >
                        {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {isAnalyzing ? 'Analisando...' : 'IA'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Descrição</h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                      <Bot size={10} /> Triagem SAAMia
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{selectedTicket.description}</p>
                </div>

                {/* AI Summary (Internal Only) */}
                {selectedTicket.aiSummary && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Sparkles size={40} className="text-blue-600" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-blue-600" />
                      <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Resumo IA (Interno)</h4>
                    </div>
                    <p className="text-xs text-blue-600 leading-relaxed italic">
                      "{selectedTicket.aiSummary}"
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Histórico de Mensagens</h4>
                  {selectedTicket.messages?.map((msg: any) => (
                    <div key={msg.id} className={cn(
                      "flex flex-col max-w-[80%]",
                      msg.isAgent ? "ml-auto items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm shadow-sm",
                        msg.isAgent ? "bg-blue-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-700 rounded-tl-none"
                      )}>
                        {msg.text}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {msg.attachments.map((att: string, idx: number) => (
                              <div key={idx} className={cn("flex items-center gap-1.5 px-2 py-1 rounded text-xs", msg.isAgent ? "bg-blue-700 text-blue-100" : "bg-slate-200 text-slate-600")}>
                                <Paperclip size={12} />
                                <span className="truncate max-w-[150px]">{att}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">{msg.sender} • {msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50">
                {isReplying ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
                        <Zap size={10} /> Macros
                      </button>
                      <button className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">
                        Assinatura
                      </button>
                      <label className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 flex items-center gap-1 cursor-pointer">
                        <Paperclip size={10} /> Anexar
                        <input 
                          type="file" 
                          multiple 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files) {
                              setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-white px-2 py-1 rounded text-[10px] font-bold text-slate-600 border border-slate-200">
                            <span className="truncate max-w-[100px]">{file.name}</span>
                            <button 
                              onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== idx))}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Digite sua resposta..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setIsReplying(false); setSelectedFiles([]); }} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-all">Cancelar</button>
                      <button onClick={handleSendReply} className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md">Enviar Resposta</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsReplying(true)}
                      className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} /> Responder
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateTicketStatus(selectedTicket.id, 'Em Análise')}
                        className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                      >
                        <Search size={16} /> Análise
                      </button>
                      <button 
                        onClick={() => updateTicketStatus(selectedTicket.id, 'Liberado pra Produção')}
                        className="px-4 py-3 bg-purple-50 text-purple-600 rounded-xl text-sm font-bold hover:bg-purple-100 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                      >
                        <Rocket size={16} /> Produção
                      </button>
                      <button 
                        onClick={() => updateTicketStatus(selectedTicket.id, 'Concluído')}
                        className="px-4 py-3 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Concluído
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <Ticket size={40} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium">Selecione um chamado para visualizar os detalhes</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mural de Avisos */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col min-h-[400px]">
          <div className="p-4 border-b border-orange-500 flex items-center gap-2">
            <Pin size={18} className="text-slate-400 rotate-45" />
            <h3 className="text-sm font-bold text-slate-700">Mural de avisos</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
              <Pin size={48} className="text-slate-200 rotate-45" />
            </div>
            <p className="text-slate-400 font-medium">Nenhum aviso para ser exibido</p>
          </div>
          <div className="p-4 border-t border-slate-100 text-right">
            <button className="text-xs font-bold text-orange-600 hover:underline uppercase tracking-wider">Ver Avisos</button>
          </div>
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          {/* Mensagens */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-4 border-b border-orange-500 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox size={18} className="text-slate-400" />
                <h3 className="text-sm font-bold text-slate-700">Mensagens</h3>
              </div>
              <ChevronDown size={18} className="text-slate-400" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Você tem <span className="font-bold">{pendingSupport.length}</span> solicitações de suporte pendentes</p>
                {pendingSupport.length > 0 && (
                  <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </div>
              <div className="mt-4 text-right">
                <button 
                  onClick={() => setActiveTab('indicadores')}
                  className="text-xs font-bold text-orange-600 hover:underline uppercase tracking-wider"
                >
                  Ver Suporte Rápido
                </button>
              </div>
            </div>
          </div>

          {/* Agenda */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-4 border-b border-rose-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-slate-400" />
                <h3 className="text-sm font-bold text-slate-700">Agenda</h3>
              </div>
              <ChevronDown size={18} className="text-slate-400" />
            </div>
            <div className="p-6 space-y-2">
              <p className="text-sm text-slate-600 font-bold">0 eventos hoje</p>
              <p className="text-sm text-slate-600 font-bold">0 eventos esta semana</p>
              <div className="mt-4 text-right">
                <button className="text-xs font-bold text-rose-800 hover:underline uppercase tracking-wider">Ver Agenda</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Chat */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-4 border-b border-emerald-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-slate-400" />
                <h3 className="text-sm font-bold text-slate-700">Chat</h3>
              </div>
              <ChevronDown size={18} className="text-slate-400" />
            </div>
            <div className="p-6 space-y-2">
              <p className="text-sm text-slate-600 font-medium"><span className="font-bold">{supportRequests.filter(r => r.status === 'Pendente').length}</span> chats aguardando atendimento</p>
              <p className="text-sm text-slate-600 font-medium"><span className="font-bold">{supportRequests.filter(r => r.status === 'Em Atendimento').length}</span> chats em atendimento</p>
              <div className="mt-4 text-right">
                <button 
                  onClick={() => setActiveTab('indicadores')}
                  className="text-xs font-bold text-emerald-600 hover:underline uppercase tracking-wider"
                >
                  Ver Conversas
                </button>
              </div>
            </div>
          </div>

          {/* Central de Ajuda */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-slate-400" />
                <h3 className="text-sm font-bold text-slate-700">Central de ajuda</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs text-slate-500 leading-relaxed">
                Aqui você terá acesso às atualizações da base de conhecimento do Suporte SAAM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PessoasTab({ searchQuery, setSearchQuery, setIsNewPersonModalOpen }: { searchQuery: string, setSearchQuery: (q: string) => void, setIsNewPersonModalOpen: (open: boolean) => void }) {
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  const people = [
    { id: 1, tipo: 'Pessoa', perfil: 'Cliente', nome: 'HELOS CONTABILIDADE (JOSÉ N...', razao: 'HELOS CONTABILIDADE LTDA', classificacao: 'VIP', email: 'contato@helos.com.br', org: 'HELOS CONTABILIDADE (JOSÉ N...', equipe: '', documento: '12.345.678/0001-90', cidade: 'São Paulo', estado: 'SP', perfilAcesso: 'Cliente Web 1', habilitado: true, status: 'online', telefone: '(11) 98888-7777' },
    { id: 2, tipo: 'Pessoa', perfil: 'Cliente', nome: 'M&M ORGANIZACAO CONTABIL ...', razao: 'M&M ORGANIZACAO CONTABIL S/S', classificacao: 'Standard', email: 'suporte@mmcontabil.com.br', org: 'M&M ORGANIZACAO CONTABIL ...', equipe: '', documento: '98.765.432/0001-10', cidade: 'Curitiba', estado: 'PR', perfilAcesso: 'Cliente Web 1', habilitado: true, status: 'offline', telefone: '(41) 3333-2222' },
    { id: 3, tipo: 'Pessoa', perfil: 'Cliente', nome: 'JS DISTRIBUIDORA DE PECAS | ...', razao: 'JS DISTRIBUIDORA DE PECAS EIRELI', classificacao: 'Premium', email: 'vendas@jspecas.com.br', org: 'JS DISTRIBUIDORA DE PECAS | ...', equipe: '', documento: '45.678.901/0001-22', cidade: 'Belo Horizonte', estado: 'MG', perfilAcesso: 'Cliente Web 1', habilitado: true, status: 'online', telefone: '(31) 97777-6666' },
    { id: 4, tipo: 'Pessoa', perfil: 'Cliente', nome: 'PLATINAO RESTAURANTE (OHL...', razao: 'PLATINAO RESTAURANTE LTDA', classificacao: 'Standard', email: 'financeiro@platinao.com.br', org: 'PLATINAO RESTAURANTE (OHL...', equipe: '', documento: '33.222.111/0001-00', cidade: 'Rio de Janeiro', estado: 'RJ', perfilAcesso: 'Cliente Web 1', habilitado: true, status: 'offline', telefone: '(21) 2222-1111' },
    { id: 5, tipo: 'Pessoa', perfil: 'Cliente', nome: 'NÃO CLIENTES', razao: 'NÃO CLIENTES', classificacao: 'Prospect', email: 'contato@naoclientes.com', org: 'NÃO CLIENTES', equipe: '', documento: '', cidade: 'São Paulo', estado: 'SP', perfilAcesso: 'Cliente Web 1', habilitado: true, status: 'offline', telefone: '' },
    { id: 6, tipo: 'Pessoa', perfil: 'Cliente', nome: 'CICAL CENTRAL DE SERVICOS L..', razao: 'CICAL CENTRAL DE SERVICOS LTDA', classificacao: 'VIP', email: 'cical@cical.com.br', org: 'CICAL CENTRAL DE SERVICOS L..', equipe: '', documento: '11.222.333/0001-44', cidade: 'Goiânia', estado: 'GO', perfilAcesso: 'Cliente Web 1', habilitado: true, status: 'online', telefone: '(62) 3333-4444' },
    { id: 7, tipo: 'Pessoa', perfil: 'Cliente', nome: 'Luciano Melo', razao: 'Luciano Melo ME', classificacao: 'Standard', email: 'luciano@planning.com.br', org: 'PLANNING | WEB 1/000491 E 00...', equipe: '', documento: '123.456.789-00', cidade: 'Florianópolis', estado: 'SC', perfilAcesso: 'Cliente Web 1', habilitado: true, status: 'online', telefone: '(48) 99999-8888' },
    { id: 8, tipo: 'Pessoa', perfil: 'Agente', nome: 'Aline Silva', razao: '', classificacao: 'Interno', email: 'aline.silva@saam.com.br', org: 'SAAM Suporte', equipe: 'Suporte N1', documento: '222.333.444-55', cidade: 'São Paulo', estado: 'SP', perfilAcesso: 'Agente Full', habilitado: true, status: 'online', telefone: '(11) 91111-2222' },
    { id: 9, tipo: 'Pessoa', perfil: 'Agente', nome: 'Rafaela Farias', razao: '', classificacao: 'Interno', email: 'rafaela.farias@saam.com.br', org: 'SAAM Suporte', equipe: 'Suporte N1', documento: '333.444.555-66', cidade: 'São Paulo', estado: 'SP', perfilAcesso: 'Agente Full', habilitado: true, status: 'online', telefone: '(11) 92222-3333' },
    { id: 10, tipo: 'Pessoa', perfil: 'Cliente', nome: 'Varejo Total S.A.', razao: 'Varejo Total S.A.', classificacao: 'VIP', email: 'atendimento@varejototal.com', org: 'Varejo Total', equipe: '', documento: '55.666.777/0001-88', cidade: 'Porto Alegre', estado: 'RS', perfilAcesso: 'Cliente Web 1', habilitado: true, status: 'offline', telefone: '(51) 3222-4444' },
    { id: 11, tipo: 'Pessoa', perfil: 'Agente', nome: 'Genésio Barros', razao: '', classificacao: 'Interno', email: 'genesio.barros@saam.com.br', org: 'SAAM Suporte', equipe: 'Suporte N2', documento: '444.555.666-77', cidade: 'São Paulo', estado: 'SP', perfilAcesso: 'Agente Full', habilitado: true, status: 'online', telefone: '(11) 93333-4444' },
    { id: 12, tipo: 'Pessoa', perfil: 'Agente', nome: 'Leticia Silva', razao: '', classificacao: 'Interno', email: 'leticia.silva@saam.com.br', org: 'SAAM Suporte', equipe: 'Suporte N1', documento: '555.666.777-88', cidade: 'São Paulo', estado: 'SP', perfilAcesso: 'Agente Full', habilitado: true, status: 'offline', telefone: '(11) 94444-5555' },
    { id: 13, tipo: 'Pessoa', perfil: 'Cliente', nome: 'CONSTRUTORA ALFA', razao: 'ALFA CONSTRUTORA E INCORPORADORA', classificacao: 'VIP', email: 'obras@alfa.com.br', org: 'CONSTRUTORA ALFA', equipe: '', documento: '22.333.444/0001-55', cidade: 'Curitiba', estado: 'PR', perfilAcesso: 'Cliente Web 1', habilitado: true, status: 'online', telefone: '(41) 98877-6655' },
    { id: 14, tipo: 'Pessoa', perfil: 'Cliente', nome: 'SUPERMERCADO BETA', razao: 'BETA COMERCIO DE ALIMENTOS', classificacao: 'Standard', email: 'compras@beta.com.br', org: 'SUPERMERCADO BETA', equipe: '', documento: '33.444.555/0001-66', cidade: 'Joinville', estado: 'SC', perfilAcesso: 'Cliente Web 1', habilitado: true, status: 'offline', telefone: '(47) 3444-5555' },
    { id: 15, tipo: 'Pessoa', perfil: 'Agente', nome: 'Roberto Carlos', razao: '', classificacao: 'Interno', email: 'roberto.carlos@saam.com.br', org: 'SAAM Suporte', equipe: 'Suporte N2', documento: '666.777.888-99', cidade: 'São Paulo', estado: 'SP', perfilAcesso: 'Agente Full', habilitado: true, status: 'online', telefone: '(11) 95555-6666' },
  ];

  const filteredPeople = people.filter(p => 
    p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.documento.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPerson = people.find(p => p.id === selectedPersonId);

  return (
    <div className="flex gap-6 h-full animate-in fade-in duration-500">
      <div className={cn(
        "bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full transition-all duration-300",
        selectedPersonId ? "w-2/3" : "w-full"
      )}>
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-slate-900">Pessoas</h3>
            <p className="text-[10px] text-slate-400 font-medium">Exibindo de 1 até {filteredPeople.length} de um total de 6832 registro(s)</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsNewPersonModalOpen(true)}
              className="px-3 py-1.5 text-[10px] font-bold bg-orange-500 text-white rounded hover:bg-orange-600 uppercase tracking-wider shadow-sm"
            >
              Novo Cadastro
            </button>
            <div className="flex items-center gap-2 mr-2">
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-all" title="Exportar Excel">
                <Download size={16} />
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-all" title="Exportar PDF">
                <FileText size={16} />
              </button>
            </div>
            <button className="px-3 py-1.5 text-[10px] font-bold text-slate-600 border border-slate-200 rounded hover:bg-slate-50 uppercase tracking-wider">Opções</button>
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Pesquisar" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-3 py-1.5 bg-slate-50 border-b border-slate-300 focus:border-orange-500 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Filter size={18} className="cursor-pointer hover:text-slate-600" />
              <Share2 size={18} className="cursor-pointer hover:text-slate-600" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr>
                <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded" /></th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Perfil</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome fantasia</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Classificação</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">E-mail</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cidade/UF</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Habilitado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPeople.map((person) => (
                <tr 
                  key={person.id} 
                  onClick={() => setSelectedPersonId(person.id)}
                  className={cn(
                    "hover:bg-slate-50 transition-colors group cursor-pointer",
                    selectedPersonId === person.id && "bg-blue-50/50"
                  )}
                >
                  <td className="px-4 py-3"><input type="checkbox" className="rounded" /></td>
                  <td className="px-4 py-3">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      person.status === 'online' ? "bg-emerald-500" : "bg-slate-300"
                    )}></div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full font-bold",
                      person.perfil === 'Agente' ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"
                    )}>
                      {person.perfil}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-900">{person.nome}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{person.classificacao}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{person.email}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{person.cidade}/{person.estado}</td>
                  <td className="px-4 py-3">
                    <CheckCircle size={16} className="text-emerald-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPersonId && selectedPerson && (
        <div className="w-1/3 bg-white rounded-2xl border border-slate-200 shadow-lg flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Detalhes da Pessoa</h3>
            <button onClick={() => setSelectedPersonId(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400">
              <X size={18} />
            </button>
          </div>
          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                {selectedPerson.nome[0]}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{selectedPerson.nome}</h4>
                <p className="text-sm text-slate-500">{selectedPerson.perfil} • {selectedPerson.classificacao}</p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2",
                selectedPerson.status === 'online' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
              )}>
                <div className={cn("w-1.5 h-1.5 rounded-full", selectedPerson.status === 'online' ? "bg-emerald-500" : "bg-slate-400")}></div>
                {selectedPerson.status === 'online' ? 'Online' : 'Offline'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">E-mail</p>
                  <p className="text-xs text-slate-700 break-all">{selectedPerson.email || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Telefone</p>
                  <p className="text-xs text-slate-700">{selectedPerson.telefone || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Documento</p>
                  <p className="text-xs text-slate-700">{selectedPerson.documento || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Cidade/UF</p>
                  <p className="text-xs text-slate-700">{selectedPerson.cidade}/{selectedPerson.estado}</p>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Organização</p>
                <p className="text-xs text-slate-700">{selectedPerson.org}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Perfil de Acesso</p>
                <p className="text-xs text-slate-700">{selectedPerson.perfilAcesso}</p>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all">Editar</button>
              <button className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">Ver Tickets</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IndicadoresTab({ 
  macros, 
  showMacros, 
  setShowMacros,
  setIsCSTAModalOpen,
  supportRequests,
  acceptSupportRequest,
  sendSupportMessage
}: { 
  macros: any[], 
  showMacros: boolean, 
  setShowMacros: (show: boolean) => void,
  setIsCSTAModalOpen: (open: boolean) => void,
  supportRequests: any[],
  acceptSupportRequest: any,
  sendSupportMessage: any
}) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<'month' | 'day'>('month');

  const agentPerformanceData = [
    { name: 'Aline Silva', resolved: 145 },
    { name: 'Rafaela Farias', resolved: 132 },
    { name: 'Roberta Souza', resolved: 156 },
    { name: 'Leticia Silva', resolved: 112 },
    { name: 'Genésio Barros', resolved: 98 },
  ];

  const ratingDataMonth = [
    { name: 'Jan', rating: 4.2 },
    { name: 'Fev', rating: 4.5 },
    { name: 'Mar', rating: 4.8 },
    { name: 'Abr', rating: 4.6 },
    { name: 'Mai', rating: 4.9 },
    { name: 'Jun', rating: 4.7 },
  ];

  const ratingDataDay = [
    { name: 'Seg', rating: 4.8 },
    { name: 'Ter', rating: 4.5 },
    { name: 'Qua', rating: 4.9 },
    { name: 'Qui', rating: 4.7 },
    { name: 'Sex', rating: 4.6 },
    { name: 'Sáb', rating: 4.2 },
    { name: 'Dom', rating: 4.4 },
  ];

  const agentRatingData = [
    { name: 'Aline Silva', rating: 4.9 },
    { name: 'Rafaela Farias', rating: 4.8 },
    { name: 'Roberta Souza', rating: 4.7 },
    { name: 'Leticia Silva', rating: 4.5 },
    { name: 'Genésio Barros', rating: 4.2 },
  ];

  const currentRatingData = ratingFilter === 'month' ? ratingDataMonth : ratingDataDay;

  const indicators = [
    { label: 'Tempo médio de espera', value: '00:02:15', color: 'text-emerald-600', desc: 'Média de tempo que o cliente aguarda para ser atendido' },
    { label: 'Tempo médio de atendimento', value: '00:12:45', color: 'text-blue-600', desc: 'Duração média das conversas finalizadas' },
    { label: 'Conversas em aberto', value: supportRequests.length.toString(), color: 'text-orange-600', desc: 'Total de chats aguardando ou em atendimento agora' },
    { label: 'Taxa de abandono', value: '4.2%', color: 'text-red-600', desc: 'Percentual de clientes que desistiram antes do atendimento' },
  ];

  const agents = [
    { name: 'Aline Silva', status: 'Em atendimento', time: '00:05:12', avatar: 'AS', chat: 'online' },
    { name: 'Rafaela Farias', status: 'Disponível', time: '00:02:45', avatar: 'RF', chat: 'online' },
    { name: 'Genésio Barros', status: 'Pausa', time: '00:15:00', avatar: 'GB', chat: 'offline' },
    { name: 'Leticia Silva', status: 'Em atendimento', time: '00:08:30', avatar: 'LS', chat: 'online' },
    { name: 'Roberta Souza', status: 'Offline', time: '00:00:00', avatar: 'RS', chat: 'offline' },
  ];

  const ticketsByClient = [
    { client: 'TechCorp Solutions', count: 45, resolved: 42, perc: '93%' },
    { client: 'Indústrias Globo', count: 38, resolved: 35, perc: '92%' },
    { client: 'Varejo Total', count: 32, resolved: 30, perc: '94%' },
    { client: 'Logística Express', count: 28, resolved: 25, perc: '89%' },
    { client: 'Banco Digital S.A.', count: 25, resolved: 24, perc: '96%' },
  ];

  const selectedChat = supportRequests.find(c => c.id === activeChatId);

  const handleSendSupportMessage = () => {
    if (!chatMessage.trim() || !activeChatId) return;

    sendSupportMessage(activeChatId, {
      sender: 'João (Suporte)',
      text: chatMessage,
      isAgent: true
    });

    setChatMessage('');
    toast.success(isInternalNote ? 'Nota interna salva!' : 'Mensagem enviada!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-3">
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2">
          <MessageCircle size={16} /> Iniciar Chat Interno
        </button>
      </div>

      {/* Top Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((ind, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-all">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{ind.label}</p>
              <p className={cn("text-2xl font-bold", ind.color)}>{ind.value}</p>
              <p className="text-[9px] text-slate-400 mt-2 line-clamp-1 group-hover:line-clamp-none transition-all">{ind.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Acompanhamento de Agentes */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Acompanhamento de agentes</h3>
            <Users size={16} className="text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100 flex-1 overflow-auto max-h-[400px]">
            {agents.map((agent, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                      {agent.avatar}
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full",
                      agent.chat === 'online' ? "bg-emerald-500" : "bg-slate-300"
                    )}></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{agent.name}</p>
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "text-[10px] font-bold uppercase tracking-tight",
                        agent.status === 'Disponível' ? "text-emerald-500" : 
                        agent.status === 'Em atendimento' ? "text-blue-500" : "text-orange-500"
                      )}>{agent.status}</p>
                      <span className="text-[10px] text-slate-300">•</span>
                      <div className="flex items-center gap-1">
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: agent.status === 'Em atendimento' ? '60%' : '0%' }}></div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold">{agent.status === 'Em atendimento' ? '3/5' : '0/5'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{agent.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets por Clientes */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Tickets por clientes (pessoa)</h3>
            <User size={16} className="text-slate-400" />
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-center">Total</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">% Sol.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ticketsByClient.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-700 font-bold truncate max-w-[150px]">{item.client}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 text-center">{item.count}</td>
                    <td className="px-4 py-3 text-xs text-right">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded font-bold">{item.perc}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Tickets resolvidos por agente</h3>
            <TrendingUp size={16} className="text-slate-400" />
          </div>
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} width={100} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="resolved" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={24}>
                  {agentPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Avaliação de ticket Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-700">Avaliação de ticket</h3>
              <Star size={16} className="text-amber-400 fill-amber-400" />
            </div>
            <div className="flex bg-slate-200/50 p-1 rounded-lg">
              <button
                onClick={() => setRatingFilter('month')}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  ratingFilter === 'month' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Por Mês
              </button>
              <button
                onClick={() => setRatingFilter('day')}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  ratingFilter === 'day' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Por Dia
              </button>
            </div>
          </div>
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentRatingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value} Estrelas`, 'Avaliação Média']}
                />
                <Bar dataKey="rating" fill="#fbbf24" radius={[6, 6, 0, 0]} barSize={40}>
                  {currentRatingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rating >= 4.5 ? '#fbbf24' : entry.rating >= 4.0 ? '#fcd34d' : '#fde68a'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avaliação por agente Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-700">Avaliação por agente</h3>
              <User size={16} className="text-blue-500" />
            </div>
          </div>
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentRatingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 5]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} width={100} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value} Estrelas`, 'Avaliação Média']}
                />
                <Bar dataKey="rating" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={24}>
                  {agentRatingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rating >= 4.5 ? '#3b82f6' : entry.rating >= 4.0 ? '#60a5fa' : '#93c5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-700">Chats atendidos</h3>
            <p className="text-xs text-slate-500 mt-1">Quantidade de chats atendidos no período</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-black text-slate-900">{ratingFilter === 'month' ? '1.322' : '45'}</span>
            <span className="text-xs font-bold text-emerald-500">+28,47%</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-700">Chats resolvidos em primeiro atendimento</h3>
            <p className="text-xs text-slate-500 mt-1">Quantidade de atendimentos via chat que foram resolvidos durante a conversa</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-black text-slate-900">{ratingFilter === 'month' ? '1.093' : '38'}</span>
            <span className="text-xs font-bold text-emerald-500">+23,64%</span>
          </div>
        </div>
      </div>

      {/* Conversas em atendimento e Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={cn(
          "transition-all duration-500",
          activeChatId ? "lg:col-span-4" : "lg:col-span-12"
        )}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700">Conversas em atendimento</h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full">{supportRequests.length} Ativas</span>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Ticket</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Cliente</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Atendente</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {supportRequests.map((chat, i) => (
                      <tr 
                        key={chat.id} 
                        className={cn(
                          "hover:bg-slate-50 transition-colors cursor-pointer group",
                          activeChatId === chat.id && "bg-blue-50/50"
                        )}
                        onClick={() => setActiveChatId(chat.id)}
                      >
                        <td className="px-4 py-3 text-xs text-slate-500 font-mono">#{chat.id.substring(0, 5)}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-900">{chat.customerName}</td>
                        <td className="px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
                          {chat.acceptedBy ? (
                            <>
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              {chat.acceptedBy}
                            </>
                          ) : (
                            <span className="text-slate-400 italic">Aguardando...</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold",
                            chat.status === 'Pendente' ? "bg-rose-100 text-rose-600 animate-pulse" : "bg-emerald-100 text-emerald-600"
                          )}>
                            {chat.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {chat.status === 'Pendente' ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                acceptSupportRequest(chat.id, 'João (Suporte)');
                                setActiveChatId(chat.id);
                              }}
                              className="px-3 py-1 bg-orange-500 text-white text-[10px] font-bold rounded uppercase tracking-wider hover:bg-orange-600 transition-all"
                            >
                              Aceitar
                            </button>
                          ) : (
                            <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors">
                              <Eye size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {supportRequests.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs">
                          Nenhuma conversa em atendimento no momento.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {activeChatId && selectedChat && (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col h-[600px] animate-in slide-in-from-right duration-500 overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-lg">
                    {selectedChat.customerName[0]}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedChat.customerName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Online
                    </span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {selectedChat.acceptedBy ? `Atendente: ${selectedChat.acceptedBy}` : 'Aguardando atendente'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                  <Phone size={20} />
                </button>
                <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
                <div className="w-px h-8 bg-slate-100 mx-1"></div>
                <button onClick={() => setActiveChatId(null)} className="p-2.5 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              <div className="flex justify-center">
                <span className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">Hoje</span>
              </div>

              {selectedChat.messages.map((msg: any) => (
                <div key={msg.id} className={cn(
                  "flex flex-col space-y-1 max-w-[80%]",
                  msg.isAgent ? "ml-auto items-end" : "items-start"
                )}>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm shadow-sm leading-relaxed",
                    msg.isAgent 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mx-1">
                    <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                    {msg.isAgent && <CheckCircle size={12} className="text-blue-500" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-5 bg-white border-t border-slate-100">
              {selectedChat.status === 'Pendente' ? (
                <div className="flex flex-col items-center justify-center p-4 bg-orange-50 border border-orange-100 rounded-2xl space-y-3">
                  <AlertCircle className="text-orange-500" size={32} />
                  <div className="text-center">
                    <p className="text-sm font-bold text-orange-900">Esta conversa ainda não foi aceita</p>
                    <p className="text-xs text-orange-700">Aceite o chamado para começar a responder o cliente.</p>
                  </div>
                  <button 
                    onClick={() => acceptSupportRequest(selectedChat.id, 'João (Suporte)')}
                    className="px-8 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                  >
                    Aceitar Chamado
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <button 
                      onClick={() => setIsInternalNote(false)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                        !isInternalNote ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      )}
                    >
                      Resposta Pública
                    </button>
                    <button 
                      onClick={() => setIsInternalNote(true)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                        isInternalNote ? "bg-amber-500 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      )}
                    >
                      Nota Interna
                    </button>
                    <div className="flex-1"></div>
                    <button 
                      onClick={() => setShowMacros(!showMacros)}
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 flex items-center gap-1 relative"
                    >
                      <Zap size={10} /> Macros
                      {showMacros && (
                        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
                          <div className="p-3 border-b border-slate-100 bg-slate-50">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase">Mensagens Rápidas</h4>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {macros.map(macro => (
                              <button 
                                key={macro.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setChatMessage(prev => prev + macro.text);
                                  setShowMacros(false);
                                }}
                                className="w-full text-left p-3 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0"
                              >
                                <p className="text-xs font-bold text-slate-700">{macro.name}</p>
                                <p className="text-[10px] text-slate-500 truncate">{macro.text}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        toast.success('Pesquisa de satisfação enviada!');
                      }}
                      className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-200 flex items-center gap-1"
                    >
                      <Smile size={10} /> Enviar Pesquisa
                    </button>
                  </div>

                  <div className={cn(
                    "flex items-end gap-3 border rounded-2xl p-2.5 transition-all",
                    isInternalNote ? "bg-amber-50 border-amber-200 focus-within:ring-amber-500/10 focus-within:border-amber-500" : "bg-slate-50 border-slate-200 focus-within:ring-blue-500/10 focus-within:border-blue-500"
                  )}>
                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Paperclip size={22} />
                    </button>
                    <textarea 
                      rows={1}
                      placeholder={isInternalNote ? "Digite uma nota interna (invisível para o cliente)..." : "Digite sua mensagem..."}
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 bg-transparent border-none px-2 py-2.5 text-sm outline-none resize-none max-h-32 font-medium text-slate-700"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendSupportMessage();
                        }
                      }}
                    />
                    <button 
                      onClick={handleSendSupportMessage}
                      className={cn(
                        "p-3 rounded-xl transition-all shadow-lg flex items-center justify-center",
                        chatMessage.trim() 
                          ? (isInternalNote ? "bg-amber-500 text-white hover:bg-amber-600" : "bg-blue-600 text-white hover:bg-blue-700") 
                          : "bg-slate-200 text-slate-400"
                      )}
                    >
                      <Send size={22} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <p className="text-[10px] text-slate-400 font-medium">Enter para enviar</p>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <p className="text-[10px] text-slate-400 font-medium">Shift + Enter para nova linha</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RelatoriosTab({ tickets }: { tickets: any[] }) {
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState(false);
  const [selectedHistoryTicket, setSelectedHistoryTicket] = useState<any>(null);
  const reportData = [
    { month: 'Jan', tickets: 450, resolved: 400 },
    { month: 'Fev', tickets: 520, resolved: 480 },
    { month: 'Mar', tickets: 480, resolved: 460 },
    { month: 'Abr', tickets: 610, resolved: 580 },
    { month: 'Mai', tickets: 550, resolved: 530 },
    { month: 'Jun', tickets: 670, resolved: 640 },
  ];

  const resolvedTickets = tickets.filter(t => t.status === 'Resolvido' || t.status === 'Concluído');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Relatórios de Desempenho</h2>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Exportar PDF
          </button>
          <button 
            onClick={() => setIsNewReportModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md"
          >
            Novo Relatório
          </button>
        </div>
      </div>

      {/* Histórico de Tickets Resolvidos */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History size={20} className="text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700">Histórico de Tickets (Concluídos/Resolvidos)</h3>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            {resolvedTickets.length} tickets
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assunto</th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data</th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avaliação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resolvedTickets.length > 0 ? (
                resolvedTickets.map(ticket => (
                  <tr 
                    key={ticket.id} 
                    onClick={() => setSelectedHistoryTicket(ticket)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-xs font-bold text-slate-500">#{ticket.id}</td>
                    <td className="py-3 px-4 text-sm font-bold text-slate-900">{ticket.subject}</td>
                    <td className="py-3 px-4 text-xs text-slate-600">{ticket.customer}</td>
                    <td className="py-3 px-4 text-xs text-slate-500">{ticket.date}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold",
                        ticket.status === 'Resolvido' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {ticket.rating ? (
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-slate-700">{ticket.rating}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    Nenhum ticket concluído ou resolvido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Volume Total', value: '1,284', change: '+12%', icon: BarChartIcon, color: 'blue' },
          { label: 'Resolvidos', value: '1,150', change: '+8%', icon: CheckCircle2, color: 'emerald' },
          { label: 'TMA (Média)', value: '14m 20s', change: '-2m', icon: Clock, color: 'amber' },
          { label: 'TME (Fila)', value: '02m 45s', change: '-30s', icon: Layers, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-xl", 
                stat.color === 'blue' && "bg-blue-50 text-blue-600",
                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                stat.color === 'amber' && "bg-amber-50 text-amber-600",
                stat.color === 'rose' && "bg-rose-50 text-rose-600",
              )}>
                <stat.icon size={20} />
              </div>
              <span className={cn("text-xs font-bold px-2 py-1 rounded-full", 
                stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-6">Volume de Chamados vs Resolvidos</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="tickets" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Chamados" />
                <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolvidos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-6">Distribuição por Categoria</h3>
          <div className="space-y-4">
            {[
              { label: 'Suporte Técnico', value: 45, color: 'bg-blue-500' },
              { label: 'Financeiro', value: 25, color: 'bg-emerald-500' },
              { label: 'Dúvidas Gerais', value: 20, color: 'bg-amber-500' },
              { label: 'Elogios/Sugestões', value: 10, color: 'bg-rose-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="text-slate-900">{item.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Report Modal */}
      {isNewReportModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Criar Relatório Personalizado</h3>
              <button onClick={() => setIsNewReportModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nome do Relatório</label>
                <input type="text" placeholder="Ex: Performance por Agente" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tipo de Visualização</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Barras', 'Linhas', 'Pizza'].map((type) => (
                    <button key={type} className="py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-all">
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Métricas</label>
                <div className="flex flex-wrap gap-2">
                  {['Volume', 'TMA', 'TME', 'CSAT', 'SLA'].map((metric) => (
                    <label key={metric} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-100">
                      <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500" />
                      {metric}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsNewReportModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancelar</button>
                <button 
                  onClick={() => { toast.success('Relatório criado com sucesso!'); setIsNewReportModalOpen(false); }} 
                  className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
                >
                  Gerar Relatório
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket History Detail Modal */}
      {selectedHistoryTicket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-slate-900">Ticket #{selectedHistoryTicket.id}</h3>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                    selectedHistoryTicket.status === 'Resolvido' ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  )}>
                    {selectedHistoryTicket.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium">{selectedHistoryTicket.subject}</p>
              </div>
              <button onClick={() => setSelectedHistoryTicket(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Customer Info & Rating */}
              <div className="flex flex-wrap gap-4 items-start justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                    {selectedHistoryTicket.customer[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedHistoryTicket.customer}</p>
                    <p className="text-xs text-slate-500">{selectedHistoryTicket.date}</p>
                  </div>
                </div>
                
                {selectedHistoryTicket.rating && (
                  <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex flex-col items-end">
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={14} 
                          className={cn(
                            star <= selectedHistoryTicket.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"
                          )} 
                        />
                      ))}
                      <span className="text-xs font-bold text-amber-700 ml-1">{selectedHistoryTicket.rating}/5</span>
                    </div>
                    {selectedHistoryTicket.feedback && (
                      <p className="text-xs text-amber-600 italic">"{selectedHistoryTicket.feedback}"</p>
                    )}
                  </div>
                )}
              </div>

              {/* Conversation History */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MessageCircle size={16} className="text-slate-400" />
                  Histórico da Conversa
                </h4>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                  {selectedHistoryTicket.messages && selectedHistoryTicket.messages.length > 0 ? (
                    selectedHistoryTicket.messages.map((msg: any) => (
                      <div key={msg.id} className={cn(
                        "flex flex-col space-y-1 max-w-[85%]",
                        msg.isAgent ? "ml-auto items-end" : "items-start"
                      )}>
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-[10px] font-bold text-slate-500">{msg.sender}</span>
                          <span className="text-[10px] text-slate-400">{msg.time}</span>
                        </div>
                        <div className={cn(
                          "p-3 rounded-2xl text-sm shadow-sm leading-relaxed",
                          msg.isAgent 
                            ? "bg-blue-600 text-white rounded-tr-none" 
                            : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                        )}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-sm">
                      Nenhuma mensagem registrada neste ticket.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfiguracoesTab() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const triggers = [
    { id: '1', name: 'Alerta de SLA Crítico', event: 'SLA < 1h', action: 'Notificar Supervisor', active: true },
    { id: '2', name: 'Auto-atribuição VIP', event: 'Novo Chamado (VIP)', action: 'Atribuir ao N2', active: true },
    { id: '3', name: 'Pesquisa Pós-Encerramento', event: 'Chamado Resolvido', action: 'Enviar CSAT', active: false },
  ];

  const sections = [
    {
      id: 'automacao',
      title: 'Automação',
      icon: Zap,
      description: 'Configure gatilhos e ações automáticas baseadas em eventos.',
      items: ['Gatilhos de Chamados', 'Macros de Resposta', 'Distribuição Automática']
    },
    {
      id: 'integracoes',
      title: 'Integrações',
      icon: ExternalLink,
      description: 'Conecte o Movidesk com outras ferramentas via API e Webhooks.',
      items: ['Configurações de API', 'Webhooks', 'Marketplace']
    },
    {
      id: 'seguranca',
      title: 'Segurança e Perfis',
      icon: Shield,
      description: 'Gerencie permissões de acesso e perfis de usuários.',
      items: ['Perfis de Acesso', 'Políticas de Senha', 'Logs de Auditoria']
    },
    {
      id: 'personalizacao',
      title: 'Personalização',
      icon: Settings,
      description: 'Ajuste a aparência e campos personalizados do sistema.',
      items: ['Campos Personalizados', 'Branding', 'Modelos de E-mail']
    }
  ];

  if (activeSection === 'Gatilhos de Chamados') {
    return (
      <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-right duration-500">
        <button 
          onClick={() => setActiveSection(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-6 transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" />
          Voltar para Configurações
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Gatilhos de Chamados</h2>
            <p className="text-slate-500 text-sm">Defina regras que executam ações automaticamente quando eventos específicos ocorrem.</p>
          </div>
          <button 
            onClick={() => toast.success('Novo gatilho criado!')}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            Criar Gatilho
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome do Gatilho</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Evento Gatilho</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ação Executada</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {triggers.map((trigger) => (
                <tr key={trigger.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{trigger.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{trigger.event}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{trigger.action}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      trigger.active ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {trigger.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeSection === 'Webhooks' || activeSection === 'Configurações de API') {
    return (
      <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-right duration-500">
        <button 
          onClick={() => setActiveSection(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-6 transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" />
          Voltar para Configurações
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Webhooks e API</h2>
            <p className="text-slate-500 text-sm">Configure integrações externas e criação automática de PECs.</p>
          </div>
          <button 
            onClick={() => toast.success('Novo Webhook configurado!')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            Configurar Webhook
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">API Key</h3>
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <code className="text-xs text-slate-600 flex-1 truncate">mv_live_823749823749823749823749</code>
              <button onClick={() => { navigator.clipboard.writeText('mv_live_823749823749823749823749'); toast.success('Copiado!'); }} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                <ExternalLink size={14} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Use esta chave para autenticar suas requisições na API do Movidesk.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Criação de PECs Automática</h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-600">Status da Integração</span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Ativo</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium italic">PECs são criados automaticamente via Webhook quando novos chamados são abertos.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900">Configurações do Sistema</h2>
        <p className="text-slate-500 text-sm">Gerencie todas as funcionalidades e integrações da sua central de atendimento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                <section.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{section.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{section.description}</p>
                <div className="space-y-2">
                  {section.items.map((item, j) => (
                    <button 
                      key={j} 
                      onClick={() => setActiveSection(item)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-all flex items-center justify-between group/item"
                    >
                      {item}
                      <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
