import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Zap, 
  Lightbulb, 
  Search,
  ArrowRight,
  History,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export default function SAAMiaView() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou a SAAMia, sua assistente de inteligência operacional. Como posso ajudar você hoje? Posso resumir chamados, analisar produtividade ou dar insights sobre clientes.',
      timestamp: '10:30',
      suggestions: [
        'Resumo do cliente TechCorp',
        'Gargalos na operação hoje',
        'Status do chamado #4582',
        'Previsão de demanda para amanhã'
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    toast.info('SAAMia está processando sua solicitação...');

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Analisando os dados do sistema... Identifiquei que o cliente TechCorp teve um aumento de 20% no volume de chamados críticos nos últimos 3 dias. A maioria está relacionada ao módulo de autenticação. Recomendo agendar uma reunião técnica preventiva.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Ver logs de autenticação', 'Notificar gerente de conta', 'Criar relatório detalhado']
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      toast.success('Nova resposta da SAAMia');
    }, 1500);
  };

  return (
    <div className="h-full flex gap-6">
      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">SAAMia AI</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-slate-500 font-medium">Online e pronta para ajudar</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <History size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <Maximize2 size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                msg.role === 'assistant' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
              )}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="space-y-2">
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'assistant' 
                    ? "bg-slate-50 text-slate-800 border border-slate-100" 
                    : "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                )}>
                  {msg.content}
                </div>
                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.suggestions.map((s, i) => (
                      <button 
                        key={i}
                        onClick={() => { setInput(s); }}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-xs font-semibold text-slate-600 rounded-full transition-all shadow-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                <p className={cn("text-[10px] font-medium text-slate-400", msg.role === 'user' ? "text-right" : "")}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:bg-white focus-within:border-blue-400 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pergunte sobre processos, clientes ou status da operação..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md shadow-blue-600/20"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <Sparkles size={12} className="text-blue-500" />
              IA Treinada com seus dados
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <Zap size={12} className="text-amber-500" />
              Respostas em tempo real
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Insights */}
      <div className="w-80 space-y-6 hidden xl:block">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-amber-500" />
            Sugestões Rápidas
          </h3>
          <div className="space-y-3">
            {[
              'Resumir chamados críticos de hoje',
              'Analisar produtividade da equipe técnica',
              'Quais clientes estão com SLA em risco?',
              'Gerar relatório de satisfação mensal'
            ].map((s, i) => (
              <button 
                key={i}
                onClick={() => {
                  setInput(s);
                  toast.info('Sugestão selecionada');
                }}
                className="w-full text-left p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl border border-transparent hover:border-slate-100 transition-all flex items-center justify-between group"
              >
                {s}
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-lg shadow-blue-600/20 text-white">
          <h3 className="font-bold text-lg mb-2">Resumo de Contexto</h3>
          <p className="text-sm text-blue-100 leading-relaxed mb-4">
            Você está visualizando a operação da unidade São Paulo. O volume de chamados está 12% acima da média para uma quarta-feira.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-200">Chamados Ativos</span>
              <span className="font-bold">42</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-white h-full w-[75%]"></div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-200">SLA Médio</span>
              <span className="font-bold">98.4%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[98%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
