import React, { useState } from 'react';
import { 
  Ticket as TicketIcon, 
  Plus, 
  Bot, 
  MessageSquare, 
  DollarSign, 
  Bell,
  TrendingUp,
  CreditCard,
  X,
  Send,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  Zap,
  ArrowUpRight,
  Rocket,
  Paperclip,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useTickets } from '../context/TicketContext';
import { cn } from '../lib/utils';
import { SupportRequest, Message } from '../types';
import { GoogleGenAI } from '@google/genai';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const supportData = [
  { name: 'Seg', tickets: 12, resolved: 10 },
  { name: 'Ter', tickets: 19, resolved: 15 },
  { name: 'Qua', tickets: 15, resolved: 14 },
  { name: 'Qui', tickets: 22, resolved: 18 },
  { name: 'Sex', tickets: 18, resolved: 17 },
  { name: 'Sab', tickets: 8, resolved: 7 },
  { name: 'Dom', tickets: 5, resolved: 5 },
];

export default function CustomerPortalView() {
  const { 
    tickets, 
    addTicket, 
    supportRequests, 
    notifications, 
    createSupportRequest, 
    sendSupportMessage, 
    markNotificationRead,
    aiMessages,
    addAiMessage
  } = useTickets();
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState<'ai' | 'support'>('ai');
  const [trackingTicketId, setTrackingTicketId] = useState<string | null>(null);
  const [ticketFilter, setTicketFilter] = useState<'Todos' | 'Abertos' | 'Resolvidos'>('Todos');
  const [saamiaInput, setSaamiaInput] = useState('');
  const [ticketReply, setTicketReply] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const { addMessage, updateTicketRating } = useTickets();
  
  const handleSendTicketReply = () => {
    if (!ticketReply.trim() && selectedFiles.length === 0) return;
    if (!selectedTicket) return;
    
    addMessage(selectedTicket.id, {
      sender: 'Cliente',
      text: ticketReply || 'Enviou anexos',
      isAgent: false,
      attachments: selectedFiles.map(f => f.name)
    });
    setTicketReply('');
    setSelectedFiles([]);
  };

  const activeSupportRequest = supportRequests.find(req => req.customerId === 'techcorp-1' && req.status !== 'Resolvido');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const fileNames = selectedFiles.map(f => f.name);

    addTicket({
      customer: 'TechCorp Solutions',
      subject: formData.get('subject') as string,
      description: formData.get('description') as string,
      priority: 'Média',
      attachments: fileNames.length > 0 ? fileNames : undefined,
    });

    toast.success('Chamado aberto com sucesso!');
    form.reset();
    setSelectedFiles([]);
    setIsNewTicketModalOpen(false);
  };

  const handleSendChatMessage = async (e?: React.FormEvent, mode: 'ai' | 'support' = 'support') => {
    e?.preventDefault();
    if (!saamiaInput.trim()) return;

    const messageText = saamiaInput;
    setSaamiaInput('');
    setChatMode(mode);
    setIsAIChatOpen(true);

    if (mode === 'support') {
      if (activeSupportRequest) {
        // Send to existing support session
        sendSupportMessage(activeSupportRequest.id, {
          sender: 'TechCorp Solutions',
          text: messageText,
          isAgent: false
        });
      } else {
        // Create new support request
        createSupportRequest('techcorp-1', 'TechCorp Solutions', messageText);
        toast.info('Solicitação de suporte enviada aos nossos especialistas.');
      }
    } else {
      // AI Mode
      addAiMessage({ sender: 'user', text: messageText });
      setIsAiTyping(true);

      try {
        // @ts-ignore
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: messageText,
          config: {
            systemInstruction: "Você é a SAAMia, uma assistente de inteligência artificial especializada em infraestrutura de TI e suporte a chamados. Responda de forma clara, prestativa e técnica quando necessário, mas sempre amigável."
          }
        });
        
        addAiMessage({ sender: 'ai', text: response.text || "Desculpe, não consegui processar sua solicitação no momento." });
      } catch (error) {
        console.error("Erro ao chamar SAAMia:", error);
        toast.error("Erro ao conectar com a SAAMia.");
        addAiMessage({ sender: 'ai', text: "Desculpe, estou enfrentando problemas técnicos para responder agora. Por favor, tente novamente mais tarde ou mude para o Suporte Humano." });
      } finally {
        setIsAiTyping(false);
      }
    }
  };

  const customerNotifications = notifications.filter(n => n.userId === 'TechCorp Solutions' && !n.read);

  const customerTickets = tickets.filter(t => t.customer === 'TechCorp Solutions');
  const activeTickets = customerTickets.filter(t => t.status !== 'Resolvido');
  const filteredTickets = customerTickets.filter(t => {
    if (ticketFilter === 'Abertos') return t.status !== 'Resolvido';
    if (ticketFilter === 'Resolvidos') return t.status === 'Resolvido';
    return true;
  });
  const selectedTicket = customerTickets.find(t => t.id === trackingTicketId);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">TechCorp <span className="text-blue-600">Solutions</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal do Cliente</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsNewTicketModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus size={16} />
              <span className="text-[10px] uppercase tracking-widest">Novo Chamado</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Status do Atendimento Real-time */}
        {activeSupportRequest && (
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 p-6 rounded-[2rem] flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center animate-pulse">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-amber-900">Atendimento em Tempo Real</h3>
                <p className="text-xs text-amber-700 font-medium">
                  Status: <span className="font-bold uppercase">{activeSupportRequest.status}</span> 
                  {activeSupportRequest.acceptedBy && ` • Com ${activeSupportRequest.acceptedBy}`}
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                setChatMode('support');
                setIsAIChatOpen(true);
              }}
              className="bg-amber-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all flex items-center gap-2"
            >
              Abrir Chat
              <ArrowRight size={18} />
            </button>
          </motion.section>
        )}

        {/* Key Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => {
              setTicketFilter('Abertos');
              document.getElementById('ticket-history')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <TicketIcon size={20} />
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black">{activeTickets.length.toString().padStart(2, '0')}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Chamados Ativos</p>
            </div>
          </button>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black text-emerald-600">100%</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status do Sistema (Operacional)</p>
            </div>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Metrics & Tracking */}
          <div className="lg:col-span-8 space-y-8">
            {/* Mural de Avisos */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Mural de Avisos</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Importante</span>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Manutenção Programada', date: '28 Mar 2026', desc: 'Atualização do servidor principal às 02:00h.', type: 'warning' },
                  { title: 'Nova Funcionalidade', date: '25 Mar 2026', desc: 'Agora você pode anexar arquivos diretamente no chat.', type: 'info' },
                  { title: 'Estabilidade Restaurada', date: '20 Mar 2026', desc: 'O sistema ERP voltou a operar normalmente.', type: 'success' }
                ].map((aviso, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      aviso.type === 'warning' ? "bg-amber-100 text-amber-600" :
                      aviso.type === 'info' ? "bg-blue-100 text-blue-600" :
                      "bg-emerald-100 text-emerald-600"
                    )}>
                      {aviso.type === 'warning' ? <AlertCircle size={20} /> :
                       aviso.type === 'info' ? <Zap size={20} /> :
                       <CheckCircle2 size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{aviso.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{aviso.desc}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{aviso.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Tracking Section */}
            <AnimatePresence mode="wait">
              {selectedTicket ? (
                <motion.section 
                  key="tracking"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm space-y-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <button onClick={() => setTrackingTicketId(null)} className="p-2 text-slate-400 hover:text-slate-600">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-xl tracking-tight">Acompanhar Chamado</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">#{selectedTicket.id} • {selectedTicket.subject}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-100 -z-10 hidden md:block" />
                    {[
                      { 
                        label: 'Aberto', 
                        icon: Plus, 
                        active: true, 
                        date: selectedTicket.date 
                      },
                      { 
                        label: 'Em Análise', 
                        icon: Search, 
                        active: ['Em Análise', 'Liberado pra Produção', 'Concluído', 'Resolvido'].includes(selectedTicket.status), 
                        date: ['Em Análise', 'Liberado pra Produção', 'Concluído', 'Resolvido'].includes(selectedTicket.status) ? 'Em andamento' : '--' 
                      },
                      { 
                        label: 'Produção', 
                        icon: Rocket, 
                        active: ['Liberado pra Produção', 'Concluído', 'Resolvido'].includes(selectedTicket.status), 
                        date: ['Liberado pra Produção', 'Concluído', 'Resolvido'].includes(selectedTicket.status) ? 'Liberado' : '--' 
                      },
                      { 
                        label: 'Concluído', 
                        icon: CheckCircle2, 
                        active: ['Concluído', 'Resolvido'].includes(selectedTicket.status), 
                        date: ['Concluído', 'Resolvido'].includes(selectedTicket.status) ? 'Finalizado' : '--' 
                      },
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center text-center space-y-3">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all",
                          step.active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          <step.icon size={20} />
                        </div>
                        <div>
                          <p className={cn("text-xs font-bold uppercase tracking-wider", step.active ? "text-slate-900" : "text-slate-400")}>{step.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col h-[500px] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Ticket Description */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                            {selectedTicket.customer.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{selectedTicket.customer}</span>
                          <span className="text-[10px] text-slate-400">{selectedTicket.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{selectedTicket.description}</p>
                        {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedTicket.attachments.map((att, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                                <Paperclip size={12} />
                                <span className="truncate max-w-[150px]">{att}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Message History */}
                      {selectedTicket.messages?.map(msg => (
                        <div key={msg.id} className={cn("flex flex-col max-w-[85%]", !msg.isAgent ? "ml-auto items-end" : "items-start")}>
                          <div className={cn("p-3 rounded-2xl text-sm shadow-sm", !msg.isAgent ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none")}>
                            {msg.text}
                            {msg.attachments && msg.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {msg.attachments.map((att, idx) => (
                                  <div key={idx} className={cn("flex items-center gap-1.5 px-2 py-1 rounded text-xs", !msg.isAgent ? "bg-blue-700 text-blue-100" : "bg-slate-100 text-slate-600")}>
                                    <Paperclip size={12} />
                                    <span className="truncate max-w-[150px]">{att}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-400 mt-1">{msg.sender} • {msg.time}</span>
                        </div>
                      ))}
                      {(!selectedTicket.messages || selectedTicket.messages.length === 0) && (
                        <div className="py-4 flex items-center justify-center text-slate-400 text-sm">
                          Nenhuma mensagem adicional.
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-white border-t border-slate-100 flex flex-col gap-2">
                      {(selectedTicket.status === 'Resolvido' || selectedTicket.status === 'Concluído') ? (
                        <div className="p-4 bg-slate-50 rounded-xl text-center space-y-3">
                          <h4 className="font-bold text-slate-700 text-sm">Este chamado foi concluído.</h4>
                          {selectedTicket.rating ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-xs text-slate-500">Sua avaliação:</span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star key={star} size={20} className={cn(star <= selectedTicket.rating! ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
                                ))}
                              </div>
                              {selectedTicket.ratingComment && (
                                <p className="text-sm text-slate-600 italic mt-2">"{selectedTicket.ratingComment}"</p>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto">
                              <span className="text-xs text-slate-500">Como você avalia o atendimento?</span>
                              <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button
                                    key={star}
                                    onClick={() => setRatingValue(star)}
                                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                                  >
                                    <Star size={28} className={cn(
                                      "transition-colors",
                                      star <= ratingValue ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:fill-amber-200 hover:text-amber-200"
                                    )} />
                                  </button>
                                ))}
                              </div>
                              
                              {ratingValue > 0 && (
                                <div className="w-full space-y-3 mt-2 animate-in fade-in slide-in-from-top-2">
                                  <textarea
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    placeholder="Deixe um comentário sobre o atendimento (opcional)..."
                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    rows={3}
                                  />
                                  <button
                                    onClick={() => {
                                      // Find the agent from the last message if available, or default to 'Suporte'
                                      const lastAgentMsg = selectedTicket.messages?.slice().reverse().find(m => m.isAgent);
                                      const agentName = lastAgentMsg ? lastAgentMsg.sender : 'Suporte';
                                      
                                      updateTicketRating(selectedTicket.id, ratingValue, ratingComment, agentName);
                                      toast.success('Obrigado pela sua avaliação!');
                                      setRatingValue(0);
                                      setRatingComment('');
                                    }}
                                    className="w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                  >
                                    Enviar Avaliação
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {selectedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-2">
                              {selectedFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 border border-slate-200">
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
                          <div className="flex gap-2">
                            <label className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer flex items-center justify-center">
                              <Paperclip size={18} />
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
                            <input 
                              type="text" 
                              value={ticketReply} 
                              onChange={e => setTicketReply(e.target.value)} 
                              onKeyDown={e => e.key === 'Enter' && handleSendTicketReply()}
                              placeholder="Digite sua mensagem..." 
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                            <button 
                              onClick={handleSendTicketReply} 
                              className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
                            >
                              <Send size={18} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.section>
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm">
                    <TicketIcon size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-500">Nenhum chamado selecionado</h3>
                    <p className="text-xs text-slate-400 mt-1">Selecione um chamado no histórico para acompanhar o progresso em tempo real.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Detailed Ticket History */}
            <section id="ticket-history" className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Histórico de Chamados</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filtrar por:</span>
                  <select 
                    value={ticketFilter}
                    onChange={(e) => setTicketFilter(e.target.value as any)}
                    className="text-[10px] font-bold text-slate-600 bg-slate-50 border-none rounded-lg px-2 py-1 outline-none cursor-pointer"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Abertos">Abertos</option>
                    <option value="Resolvidos">Resolvidos</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chamado</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assunto</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTickets.map((ticket) => (
                      <tr 
                        key={ticket.id} 
                        onClick={() => setTrackingTicketId(ticket.id)}
                        className={cn(
                          "group hover:bg-slate-50/50 transition-colors cursor-pointer",
                          trackingTicketId === ticket.id && "bg-blue-50/50"
                        )}
                      >
                        <td className="py-4 text-xs font-bold text-slate-400">#{ticket.id}</td>
                        <td className="py-4">
                          <p className="text-sm font-bold text-slate-700">{ticket.subject}</p>
                        </td>
                        <td className="py-4">
                          <span className={cn(
                            "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                            ticket.status === 'Resolvido' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="py-4 text-[10px] font-bold text-slate-400">{ticket.date}</td>
                        <td className="py-4 text-right">
                          <button className="p-2 text-slate-300 group-hover:text-blue-600 transition-colors">
                            <ArrowRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column: AI & Support */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/10 text-white space-y-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 opacity-10 rotate-12">
                <Bot size={120} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <h3 className="font-bold">SAAMia AI</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Como posso ajudar com sua infraestrutura hoje? Posso resumir chamados ou tirar dúvidas técnicas.
                </p>
                <div className="relative">
                  <input 
                    type="text" 
                    value={saamiaInput}
                    onChange={(e) => setSaamiaInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage(undefined, 'ai')}
                    placeholder="Pergunte algo..." 
                    className="w-full bg-white/10 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs focus:bg-white/20 focus:outline-none transition-all placeholder:text-slate-500"
                  />
                  <button 
                    onClick={() => handleSendChatMessage(undefined, 'ai')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800">Suporte Rápido</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    setChatMode('support');
                    setIsAIChatOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors">
                      <Zap size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">Chat em Tempo Real</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </button>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Dica Pro</span>
                  </div>
                  <p className="text-[10px] text-blue-800 leading-relaxed">
                    Você pode anexar logs diretamente no chat da SAAMia para uma análise técnica instantânea.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* AI Chat Side Panel */}
      <AnimatePresence>
        {isAIChatOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAIChatOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 w-full h-full bg-white z-[101] flex flex-col"
            >
              <div className={cn(
                "p-6 border-b border-slate-100 flex items-center justify-between transition-colors",
                chatMode === 'ai' ? "bg-slate-900 text-white" : "bg-amber-600 text-white"
              )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      chatMode === 'ai' ? "bg-blue-600" : "bg-white text-amber-600"
                    )}>
                      {chatMode === 'ai' ? <Bot size={20} /> : <Zap size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold">
                        {chatMode === 'ai' ? 'SAAMia AI Support' : (activeSupportRequest?.acceptedBy ? `Suporte com ${activeSupportRequest.acceptedBy}` : 'Suporte em Tempo Real')}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          chatMode === 'ai' ? "bg-emerald-400" : (activeSupportRequest?.status === 'Em Atendimento' ? "bg-emerald-400" : "bg-amber-400 animate-pulse")
                        )} />
                        <p className={cn(
                          "text-[10px] uppercase tracking-widest font-bold",
                          chatMode === 'ai' ? "text-slate-400" : "text-amber-100"
                        )}>
                          {chatMode === 'ai' ? 'Online • Especialista em Infra' : (activeSupportRequest ? (activeSupportRequest.status === 'Pendente' ? 'Aguardando Especialista...' : 'Em Atendimento') : 'Equipe Técnica Online')}
                        </p>
                      </div>
                    </div>
                  </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setChatMode(chatMode === 'ai' ? 'support' : 'ai')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={chatMode === 'ai' ? 'Mudar para Suporte Humano' : 'Mudar para SAAMia AI'}
                  >
                    {chatMode === 'ai' ? <Zap size={20} /> : <Bot size={20} />}
                  </button>
                  <button onClick={() => setIsAIChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
                {chatMode === 'ai' ? (
                  <>
                    {aiMessages.map((msg) => (
                      <div key={msg.id} className={cn(
                        "flex flex-col max-w-[85%]",
                        msg.sender === 'user' ? "ml-auto items-end" : "items-start"
                      )}>
                        <div className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                          msg.sender === 'user' 
                            ? "bg-blue-600 text-white rounded-tr-none" 
                            : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                        )}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                          {msg.sender === 'ai' ? 'SAAMia' : 'Você'} • {msg.time}
                        </span>
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex flex-col items-start max-w-[85%]">
                        <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-slate-700 rounded-tl-none border border-slate-100 flex items-center gap-2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {!activeSupportRequest && (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                          <Zap size={32} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Suporte Humano</h4>
                          <p className="text-xs text-slate-500 mt-2 max-w-[250px]">
                            Envie uma mensagem abaixo para iniciar um atendimento com nossa equipe técnica em tempo real.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {activeSupportRequest?.messages.map((msg, i) => (
                      <div key={i} className={cn(
                        "flex flex-col max-w-[85%]",
                        !msg.isAgent ? "ml-auto items-end" : "items-start"
                      )}>
                        <div className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                          !msg.isAgent 
                            ? "bg-blue-600 text-white rounded-tr-none" 
                            : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                        )}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                          {msg.sender} • {msg.time}
                        </span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="p-6 bg-white border-t border-slate-100">
                <div className="relative">
                  <input 
                    type="text" 
                    value={saamiaInput}
                    onChange={(e) => setSaamiaInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage(undefined, chatMode)}
                    placeholder={chatMode === 'ai' ? "Pergunte algo para SAAMia..." : "Digite sua mensagem para o suporte..."}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-5 pr-14 py-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                  <button 
                    onClick={() => handleSendChatMessage(undefined, chatMode)}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg",
                      chatMode === 'ai' ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20" : "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                    )}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {isNewTicketModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Novo Chamado</h3>
                  <p className="text-sm text-slate-500 mt-1">Nossa equipe responderá em breve.</p>
                </div>
                <button 
                  onClick={() => setIsNewTicketModalOpen(false)} 
                  className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateTicket} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assunto</label>
                  <input 
                    name="subject" 
                    type="text" 
                    placeholder="Ex: Instabilidade no servidor de produção" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descrição</label>
                  <textarea 
                    name="description" 
                    rows={4} 
                    placeholder="Descreva o problema com detalhes..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anexos (Opcional)</label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-colors group">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Paperclip size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">Clique para anexar arquivos</span>
                        <span className="text-xs text-slate-400">Suporta links, fotos, vídeos, documentos, excel, txt e qualquer outro formato</span>
                      </div>
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
                    {selectedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">
                            <span className="truncate max-w-[150px]">{file.name}</span>
                            <button 
                              type="button" 
                              onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== idx))}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsNewTicketModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all text-xs uppercase tracking-widest"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-xs uppercase tracking-widest"
                  >
                    Abrir Chamado
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

