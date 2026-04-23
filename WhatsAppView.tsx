import { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip, 
  Smile, 
  Send, 
  CheckCheck,
  Bot,
  User,
  Zap,
  Ticket as TicketIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const mockChats = [
  { id: '1', name: 'Ricardo (TechCorp)', lastMsg: 'O erro persiste no servidor...', time: '10:45', unread: 2, online: true },
  { id: '2', name: 'Ana (Varejo Total)', lastMsg: 'Obrigada pelo retorno!', time: '09:30', unread: 0, online: false },
  { id: '3', name: 'Marcos (Indústrias Globo)', lastMsg: 'Pode verificar a fatura?', time: 'Ontem', unread: 0, online: true },
  { id: '4', name: 'Suporte SAAMia', lastMsg: 'Análise concluída com sucesso.', time: 'Ontem', unread: 0, online: true, isAi: true },
];

export default function WhatsAppView() {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar - Chats List */}
      <div className="w-80 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden shrink-0">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Mensagens</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={cn(
                "w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-all border-l-4",
                selectedChat.id === chat.id ? "bg-blue-50/50 border-blue-600" : "border-transparent"
              )}
            >
              <div className="relative shrink-0">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold",
                  chat.isAi ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                )}>
                  {chat.isAi ? <Bot size={24} /> : chat.name.split(' ').map(n => n[0]).join('')}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-900 truncate">{chat.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{chat.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
              {selectedChat.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{selectedChat.name}</h3>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <Phone size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
              <Video size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          <div className="flex justify-center">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoje</span>
          </div>

          <div className="flex gap-3 max-w-[70%]">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0">R</div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
              <p className="text-sm text-slate-700 leading-relaxed">Olá João, tudo bem? O erro de login persiste no servidor principal da TechCorp. Pode verificar?</p>
              <p className="text-[10px] text-slate-400 mt-2 text-right">10:42</p>
            </div>
          </div>

          <div className="flex flex-row-reverse gap-3 max-w-[70%] ml-auto">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">JC</div>
            <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-white shadow-md shadow-blue-600/10">
              <p className="text-sm leading-relaxed">Olá Ricardo! Já estou ciente. A SAAMia identificou uma falha no token de autenticação. Estou escalando para o N2 agora mesmo.</p>
              <div className="flex items-center justify-end gap-1 mt-2">
                <p className="text-[10px] text-blue-200">10:45</p>
                <CheckCheck size={14} className="text-blue-200" />
              </div>
            </div>
          </div>

          {/* AI Suggestion Bubble */}
          <div className="flex justify-center">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl max-w-md shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={16} className="text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Sugestão da SAAMia</span>
              </div>
              <p className="text-xs text-indigo-800 leading-relaxed">
                Detectei que este problema está vinculado ao chamado <span className="font-bold">#4582</span>. Deseja que eu gere um resumo técnico para o operador do N2?
              </p>
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => toast.success('Resumo gerado e enviado para o N2!')}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-all"
                >
                  Sim, gerar resumo
                </button>
                <button 
                  onClick={() => toast.info('Ação cancelada.')}
                  className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 text-[10px] font-bold rounded-lg hover:bg-indigo-50 transition-all"
                >
                  Agora não
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <Paperclip size={20} />
            </button>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl text-sm transition-all outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-all">
                <Smile size={20} />
              </button>
            </div>
            <button 
              onClick={() => {
                if (message.trim()) {
                  toast.success('Mensagem enviada!');
                  setMessage('');
                } else {
                  toast.error('Digite uma mensagem primeiro.');
                }
              }}
              className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Context Panel */}
      <div className="w-80 space-y-6 hidden 2xl:block">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-600 mb-4">
              TC
            </div>
            <h3 className="font-bold text-slate-900 text-lg">TechCorp Solutions</h3>
            <p className="text-xs text-slate-500 font-medium">Cliente Premium • Desde 2024</p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Chamado Ativo</span>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Crítico</span>
              </div>
              <p className="text-sm font-bold text-slate-900">#4582 - Erro de Login</p>
              <button className="mt-3 w-full py-2 bg-white border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                <TicketIcon size={14} />
                Ver Detalhes
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Informações Rápidas</h4>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">SLA Restante</span>
                <span className="font-bold text-slate-900">01:45:00</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Operador</span>
                <span className="font-bold text-slate-900">João Carlos</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Satisfação Média</span>
                <span className="font-bold text-emerald-600">4.9/5.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0F172A] p-6 rounded-3xl shadow-xl text-white">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-blue-400" />
            <h4 className="font-bold text-sm">Sugestão de Resposta</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">
            "Olá Ricardo, nossa equipe técnica já está atuando na falha de autenticação. Previsão de normalização em 30 minutos."
          </p>
          <button 
            onClick={() => {
              setMessage("Olá Ricardo, nossa equipe técnica já está atuando na falha de autenticação. Previsão de normalização em 30 minutos.");
              toast.info('Sugestão aplicada ao campo de texto.');
            }}
            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all"
          >
            Usar esta resposta
          </button>
        </div>
      </div>
    </div>
  );
}
