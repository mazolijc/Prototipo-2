import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink,
  UserPlus,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const clients = [
  { id: '1', name: 'TechCorp Solutions', plan: 'Enterprise', status: 'Ativo', users: 45, lastActivity: 'Há 5 min', health: 98 },
  { id: '2', name: 'Indústrias Globo', plan: 'Business', status: 'Ativo', users: 120, lastActivity: 'Há 12 min', health: 95 },
  { id: '3', name: 'Varejo Total', plan: 'Pro', status: 'Atenção', users: 28, lastActivity: 'Há 1 hora', health: 72 },
  { id: '4', name: 'Logística Express', plan: 'Enterprise', status: 'Ativo', users: 85, lastActivity: 'Há 2 horas', health: 99 },
  { id: '5', name: 'Banco Digital X', plan: 'Enterprise', status: 'Ativo', users: 250, lastActivity: 'Há 15 min', health: 97 },
  { id: '6', name: 'Educação Online', plan: 'Business', status: 'Inativo', users: 15, lastActivity: 'Há 3 dias', health: 45 },
];

export default function CustomersView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Solicitação de novo cliente enviada para aprovação!');
    setIsNewClientModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestão de Clientes</h1>
            <p className="text-slate-500 font-medium mt-1">Monitoramento de saúde, planos e engajamento da base ativa.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNewClientModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <UserPlus size={18} />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clientes', value: clients.length, color: 'blue', icon: Users },
          { label: 'Ativos Agora', value: clients.filter(c => c.status === 'Ativo').length, color: 'emerald', icon: CheckCircle2 },
          { label: 'Em Risco', value: clients.filter(c => c.status === 'Atenção').length, color: 'amber', icon: Clock },
          { label: 'Health Score Médio', value: '92%', color: 'indigo', icon: ShieldCheck },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                stat.color === 'blue' && "bg-blue-50 text-blue-600",
                stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                stat.color === 'amber' && "bg-amber-50 text-amber-600",
                stat.color === 'indigo' && "bg-indigo-50 text-indigo-600",
              )}>
                <stat.icon size={16} />
              </div>
            </div>
            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* New Client Modal */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Cadastrar Novo Cliente</h3>
              <button onClick={() => setIsNewClientModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddClient} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Nome da Empresa</label>
                <input type="text" placeholder="Ex: Tech Solutions Ltda" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Plano</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Pro</option>
                    <option>Business</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">CNPJ</label>
                  <input type="text" placeholder="00.000.000/0000-00" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">E-mail do Administrador</label>
                <input type="email" placeholder="admin@empresa.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsNewClientModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clients List */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-w-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome, plano ou status..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 rounded-lg text-sm"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plano</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usuários</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health Score</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Última Atividade</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-xs font-medium px-2 py-1 rounded-lg",
                      client.plan === 'Enterprise' ? "bg-indigo-50 text-indigo-600" :
                      client.plan === 'Business' ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-600"
                    )}>
                      {client.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    {client.users}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-500",
                            client.health > 90 ? "bg-emerald-500" : client.health > 70 ? "bg-amber-500" : "bg-rose-500"
                          )} 
                          style={{ width: `${client.health}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{client.health}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      client.status === 'Ativo' ? "bg-emerald-100 text-emerald-700" :
                      client.status === 'Atenção' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        client.status === 'Ativo' ? "bg-emerald-500" :
                        client.status === 'Atenção' ? "bg-amber-500 animate-pulse" : "bg-slate-400"
                      )} />
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {client.lastActivity}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
