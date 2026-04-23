import React, { useState } from 'react';
import { 
  LayoutGrid, 
  CheckSquare, 
  Users, 
  ExternalLink, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

const mockJiraIssues = [
  { id: 'SAAM-101', title: 'Implementar OAuth2 para Integração Jira', status: 'Em Progresso', priority: 'Alta', assignee: 'João Carlos' },
  { id: 'SAAM-102', title: 'Corrigir Bug no Dashboard Executivo', status: 'A Fazer', priority: 'Média', assignee: 'Maria Silva' },
  { id: 'SAAM-103', title: 'Atualizar Documentação da API', status: 'Concluído', priority: 'Baixa', assignee: 'Pedro Santos' },
];

const mockBitrixTasks = [
  { id: 'BX-501', title: 'Reunião de Alinhamento Comercial', status: 'Agendado', date: '26/03/2026', time: '10:00' },
  { id: 'BX-502', title: 'Follow-up TechCorp Solutions', status: 'Pendente', date: '25/03/2026', time: '16:30' },
  { id: 'BX-503', title: 'Elaboração de Proposta Varejo Total', status: 'Em Progresso', date: '25/03/2026', time: '17:00' },
];

export default function JiraBitrixView() {
  const [activeSubTab, setActiveSubTab] = useState<'jira' | 'bitrix'>('jira');

  return (
    <div className="h-full flex flex-col space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Jira & Bitrix24</h1>
            <p className="text-slate-500 font-medium mt-1">Gestão de projetos e CRM unificados em uma única visão.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <ExternalLink size={18} /> Jira
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <ExternalLink size={18} /> Bitrix24
          </button>
        </div>
      </div>

      <div className="flex items-center gap-8 border-b border-slate-200 px-2 shrink-0">
        <button
          onClick={() => setActiveSubTab('jira')}
          className={cn(
            "flex items-center gap-2 py-4 font-bold text-sm transition-all border-b-2 relative",
            activeSubTab === 'jira' 
              ? "text-blue-600 border-blue-600" 
              : "text-slate-400 border-transparent hover:text-slate-600"
          )}
        >
          <CheckSquare size={18} /> Jira Software
        </button>
        <button
          onClick={() => setActiveSubTab('bitrix')}
          className={cn(
            "flex items-center gap-2 py-4 font-bold text-sm transition-all border-b-2 relative",
            activeSubTab === 'bitrix' 
              ? "text-blue-600 border-blue-600" 
              : "text-slate-400 border-transparent hover:text-slate-600"
          )}
        >
          <Users size={18} /> Bitrix24 CRM
        </button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder={activeSubTab === 'jira' ? "Buscar issues no Jira..." : "Buscar leads no Bitrix..."}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button className="p-2 text-slate-500 hover:bg-white rounded-lg border border-slate-200 transition-all">
                <Filter size={18} />
              </button>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2">
              <Plus size={18} /> {activeSubTab === 'jira' ? 'Nova Issue' : 'Novo Lead'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeSubTab === 'jira' ? (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Título</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prioridade</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Responsável</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockJiraIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-blue-600">{issue.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700 font-medium">{issue.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            issue.status === 'Em Progresso' && "bg-blue-100 text-blue-700",
                            issue.status === 'A Fazer' && "bg-slate-100 text-slate-700",
                            issue.status === 'Concluído' && "bg-emerald-100 text-emerald-700",
                          )}>
                            {issue.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-xs font-bold",
                          issue.priority === 'Alta' ? "text-rose-600" : "text-slate-600"
                        )}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {issue.assignee.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm text-slate-600">{issue.assignee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                          <ArrowUpRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tarefa / Lead</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hora</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {mockBitrixTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900">{task.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700 font-medium">{task.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {task.status === 'Agendado' && <Clock size={14} className="text-blue-500" />}
                          {task.status === 'Pendente' && <AlertCircle size={14} className="text-amber-500" />}
                          {task.status === 'Em Progresso' && <CheckCircle2 size={14} className="text-emerald-500" />}
                          <span className="text-xs font-bold text-slate-600">{task.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{task.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 font-bold">{task.time}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
