export type View = 
  | 'login' 
  | 'dashboard' 
  | 'customer-portal' 
  | 'tickets' 
  | 'saamia' 
  | 'tasks' 
  | 'executive' 
  | 'whatsapp' 
  | 'movidesk' 
  | 'jira-bitrix' 
  | 'conta-azul' 
  | 'settings';

export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isAgent: boolean;
  attachments?: string[];
}

export interface Ticket {
  id: string;
  customer: string;
  subject: string;
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  status: 'Aberto' | 'Em Análise' | 'Aguardando Cliente' | 'Resolvido' | 'Liberado pra Produção' | 'Concluído';
  date: string;
  description: string;
  messages?: Message[];
  aiSummary?: string;
  attachments?: string[];
  rating?: number;
  ratingComment?: string;
  agent?: string;
}

export interface Task {
  id: string;
  title: string;
  responsible: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  deadline: string;
  status: 'A fazer' | 'Em progresso' | 'Concluído';
}

export interface LogEntry {
  id: string;
  user: string;
  date: string;
  time: string;
  whatDone: string;
  whatNext: string;
  blockers: string;
  status: string;
  links?: string[];
}

export interface SupportRequest {
  id: string;
  customerId: string;
  customerName: string;
  status: 'Pendente' | 'Em Atendimento' | 'Finalizado';
  createdAt: string;
  acceptedBy?: string;
  messages: Message[];
}

export interface Notification {
  id: string;
  userId: string; // Can be customer name or employee name for simplicity in this mock
  message: string;
  type: 'status_change' | 'new_support_request' | 'new_message' | 'new_ticket';
  read: boolean;
  createdAt: string;
}
