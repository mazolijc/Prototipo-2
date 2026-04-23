import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ticket, Message, SupportRequest, Notification } from '../types';
import { toast } from 'sonner';

interface TicketContextType {
  tickets: Ticket[];
  supportRequests: SupportRequest[];
  notifications: Notification[];
  addTicket: (ticketData: Omit<Ticket, 'id' | 'date' | 'status'>) => Ticket;
  updateTicketStatus: (id: string, status: Ticket['status']) => void;
  updateTicketRating: (id: string, rating: number, comment?: string, agent?: string) => void;
  addMessage: (ticketId: string, message: Omit<Message, 'id' | 'time'>) => void;
  createSupportRequest: (customerId: string, customerName: string, initialMessage: string) => void;
  acceptSupportRequest: (requestId: string, agentName: string) => void;
  sendSupportMessage: (requestId: string, message: Omit<Message, 'id' | 'time'>) => void;
  markNotificationRead: (id: string) => void;
  aiMessages: {id: string, sender: 'user' | 'ai', text: string, time: string}[];
  addAiMessage: (message: {sender: 'user' | 'ai', text: string}) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const initialTickets: Ticket[] = [
  { 
    id: '4582', 
    customer: 'TechCorp Solutions', 
    subject: 'Erro de Login - Produção', 
    priority: 'Crítica', 
    status: 'Em Análise', 
    date: '25/03/2026 09:15', 
    description: 'Usuários não conseguem acessar o módulo de vendas.',
    aiSummary: 'O cliente está com dificuldades para acessar o módulo de vendas. Recomendo verificar logs de autenticação.',
    messages: [
      { id: '1', sender: 'TechCorp Solutions', text: 'Não consigo logar no sistema desde as 8h.', time: '09:15', isAgent: false },
      { id: '2', sender: 'Suporte', text: 'Olá! Estamos verificando os logs do servidor agora mesmo.', time: '09:30', isAgent: true },
      { id: '3', sender: 'TechCorp Solutions', text: 'Obrigado, aguardo retorno urgente.', time: '09:35', isAgent: false }
    ]
  },
  { 
    id: '4583', 
    customer: 'Indústrias Globo', 
    subject: 'Ajuste de Relatório Financeiro', 
    priority: 'Média', 
    status: 'Aberto', 
    date: '25/03/2026 09:42', 
    description: 'O relatório de DRE está vindo com valores duplicados.',
    aiSummary: 'Valores duplicados no relatório de DRE. Possível erro na query de agregação.',
    messages: [
      { id: '1', sender: 'Indústrias Globo', text: 'O relatório de DRE está vindo com valores duplicados em algumas linhas.', time: '09:42', isAgent: false }
    ]
  },
  { 
    id: '4584', 
    customer: 'Varejo Total', 
    subject: 'Dúvida sobre Integração API', 
    priority: 'Baixa', 
    status: 'Aguardando Cliente', 
    date: '25/03/2026 10:05', 
    description: 'Cliente solicitou documentação atualizada da API v2.',
    aiSummary: 'Solicitação de documentação da API v2.',
    messages: [
      { id: '1', sender: 'Varejo Total', text: 'Poderiam me enviar a documentação da API v2?', time: '10:05', isAgent: false },
      { id: '2', sender: 'Suporte', text: 'Claro! Segue o link da documentação: docs.saam.com/api/v2', time: '10:15', isAgent: true }
    ]
  },
  { id: '4585', customer: 'Logística Express', subject: 'Lentidão no Sistema', priority: 'Alta', status: 'Em Análise', date: '25/03/2026 10:20', description: 'O sistema apresenta lentidão excessiva no carregamento de rotas.', aiSummary: 'Lentidão no carregamento de rotas.', messages: [] },
  { id: '4586', customer: 'Banco Digital S.A.', subject: 'Atualização de Certificado', priority: 'Alta', status: 'Resolvido', date: '25/03/2026 08:30', description: 'Certificado SSL expirado no ambiente de homologação.', aiSummary: 'Certificado SSL expirado em homologação.', rating: 5, ratingComment: 'Atendimento rápido e eficiente!', messages: [
    { id: '1', sender: 'Banco Digital S.A.', text: 'O certificado SSL do ambiente de homologação expirou.', time: '08:30', isAgent: false },
    { id: '2', sender: 'Suporte', text: 'Olá! Já estamos providenciando a renovação.', time: '08:35', isAgent: true },
    { id: '3', sender: 'Suporte', text: 'Certificado renovado e aplicado com sucesso. Podem testar?', time: '08:50', isAgent: true },
    { id: '4', sender: 'Banco Digital S.A.', text: 'Testado e validado. Muito obrigado!', time: '09:00', isAgent: false }
  ] },
  { id: '4587', customer: 'Construtora Forte', subject: 'Novo Usuário Administrador', priority: 'Baixa', status: 'Aberto', date: '25/03/2026 11:10', description: 'Solicitação de criação de acesso para novo gestor.', aiSummary: 'Novo acesso para gestor.', messages: [] },
];

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [aiMessages, setAiMessages] = useState<{id: string, sender: 'user' | 'ai', text: string, time: string}[]>([
    { id: '1', sender: 'ai', text: 'Olá! Sou a SAAMia, sua assistente de inteligência artificial. Como posso ajudar com sua infraestrutura ou chamados hoje? Se precisar de um especialista humano, mude para o modo "Suporte em Tempo Real".', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);

  const addNotification = (userId: string, message: string, type: Notification['type']) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show a real-time toast for immediate feedback
    if (type === 'new_support_request') {
      toast.info(`Novo suporte: ${message}`, { duration: 5000 });
    } else if (type === 'status_change') {
      toast.success(`Status atualizado: ${message}`);
    } else if (type === 'new_ticket') {
      toast.info(`Movidesk: ${message}`, { duration: 5000 });
    }
  };

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'date' | 'status'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Math.floor(Math.random() * 10000).toString(),
      date: new Date().toLocaleString('pt-BR'),
      status: 'Aberto',
      messages: ticketData.messages || [],
      aiSummary: `Análise inicial da SAAMia: Recebemos sua solicitação sobre "${ticketData.subject}". Nossa equipe técnica já foi notificada e estamos analisando a descrição: "${ticketData.description.substring(0, 50)}...".`
    };
    setTickets(prev => [newTicket, ...prev]);
    
    // Notify employees about new ticket
    addNotification('employee', `Novo chamado de ${ticketData.customer}: ${ticketData.subject}`, 'new_ticket');
    
    return newTicket;
  };

  const updateTicketStatus = (id: string, status: Ticket['status']) => {
    setTickets(prev => {
      const updated = prev.map(t => {
        if (t.id === id) {
          // Notify customer about status change
          addNotification(t.customer, `O status do seu chamado #${t.id} foi alterado para ${status}`, 'status_change');
          return { ...t, status };
        }
        return t;
      });
      return updated;
    });
  };

  const updateTicketRating = (id: string, rating: number, comment?: string, agent?: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, rating, ratingComment: comment, agent } : t));
  };

  const addMessage = (ticketId: string, messageData: Omit<Message, 'id' | 'time'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        // If it's a customer message, notify employee
        if (!messageData.isAgent) {
          addNotification('employee', `Nova mensagem no chamado #${t.id} de ${t.customer}`, 'new_message');
        } else {
          // If it's an agent message, notify customer
          addNotification(t.customer, `Nova resposta no seu chamado #${t.id}`, 'new_message');
        }
        return {
          ...t,
          messages: [...(t.messages || []), newMessage]
        };
      }
      return t;
    }));
  };

  const createSupportRequest = (customerId: string, customerName: string, initialMessage: string) => {
    const newRequest: SupportRequest = {
      id: Math.random().toString(36).substr(2, 9),
      customerId,
      customerName,
      status: 'Pendente',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: '1',
          sender: customerName,
          text: initialMessage,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isAgent: false
        },
        {
          id: 'auto-1',
          sender: 'Sistema SAAM',
          text: `Protocolo: #${Math.floor(100000 + Math.random() * 900000)}\n\nOlá ${customerName}! Recebemos sua solicitação em tempo real. Nossa equipe de infraestrutura já foi alertada e está analisando seu pedido: "${initialMessage}". O tempo médio de resposta para este tipo de solicitação é de 5 a 10 minutos. Por favor, mantenha esta janela aberta para receber atualizações.`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isAgent: true
        }
      ]
    };
    setSupportRequests(prev => [newRequest, ...prev]);
    addNotification('employee', `${customerName} solicitou suporte em tempo real`, 'new_support_request');
  };

  const acceptSupportRequest = (requestId: string, agentName: string) => {
    setSupportRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedReq: SupportRequest = { 
          ...req, 
          status: 'Em Atendimento', 
          acceptedBy: agentName,
          messages: [...req.messages, {
            id: Math.random().toString(36).substr(2, 9),
            sender: agentName,
            text: `Olá! Sou o ${agentName}. Já estou com seu chamado aberto e analisando os detalhes do seu pedido. Como posso te ajudar especificamente com isso hoje?`,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            isAgent: true
          }]
        };
        // Notify customer that support was accepted
        addNotification(req.customerName, `Seu pedido de suporte foi aceito por ${agentName}. O atendimento está em andamento.`, 'new_message');
        return updatedReq;
      }
      return req;
    }));
  };

  const sendSupportMessage = (requestId: string, messageData: Omit<Message, 'id' | 'time'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setSupportRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        // Notify other party
        if (!messageData.isAgent) {
          addNotification('employee', `Nova mensagem de suporte de ${req.customerName}`, 'new_message');
        } else {
          addNotification(req.customerName, `Nova mensagem de suporte de ${req.acceptedBy}`, 'new_message');
        }
        return {
          ...req,
          messages: [...req.messages, newMessage]
        };
      }
      return req;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addAiMessage = (message: {sender: 'user' | 'ai', text: string}) => {
    const newMsg = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      sender: message.sender,
      text: message.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setAiMessages(prev => [...prev, newMsg]);
  };

  return (
    <TicketContext.Provider value={{ 
      tickets, 
      supportRequests, 
      notifications, 
      addTicket, 
      updateTicketStatus, 
      updateTicketRating,
      addMessage,
      createSupportRequest,
      acceptSupportRequest,
      sendSupportMessage,
      markNotificationRead,
      aiMessages,
      addAiMessage
    }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
