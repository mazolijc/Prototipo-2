import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink,
  ArrowUpRight,
  FileText,
  PieChart
} from 'lucide-react';
import { cn } from '../lib/utils';

const mockInvoices = [
  { id: 'FT-2024-001', customer: 'TechCorp Solutions', value: 'R$ 4.500,00', status: 'Paga', due: '10/03/2026' },
  { id: 'FT-2024-002', customer: 'Indústrias Globo', value: 'R$ 12.800,00', status: 'Pendente', due: '05/04/2026' },
  { id: 'FT-2024-003', customer: 'Varejo Total', value: 'R$ 2.150,00', status: 'Vencida', due: '20/03/2026' },
  { id: 'FT-2024-004', customer: 'Logística Express', value: 'R$ 7.400,00', status: 'Paga', due: '15/03/2026' },
];

export default function ContaAzulView() {
  return (
    <div className="h-full flex flex-col space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <DollarSign size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Conta Azul</h1>
            <p className="text-slate-500 font-medium mt-1">Gestão financeira e faturamento sincronizados.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <ExternalLink size={18} />
            Abrir Conta Azul
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12% este mês</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Receita Prevista</p>
          <h3 className="text-3xl font-black text-slate-900">R$ 145.200,00</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <TrendingDown size={20} />
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">-5% este mês</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Despesas Fixas</p>
          <h3 className="text-3xl font-black text-slate-900">R$ 42.850,00</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <PieChart size={20} />
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Saudável</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Fluxo de Caixa</p>
          <h3 className="text-3xl font-black text-slate-900">R$ 102.350,00</h3>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-slate-400" />
              Faturas Recentes
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar faturas..." 
                className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none w-64"
              />
            </div>
            <button className="p-2 text-slate-500 hover:bg-white rounded-lg border border-slate-200 transition-all">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Número</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valor</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vencimento</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{invoice.customer}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-900 font-bold">{invoice.value}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={14} />
                      {invoice.due}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      invoice.status === 'Paga' && "bg-emerald-100 text-emerald-700",
                      invoice.status === 'Pendente' && "bg-amber-100 text-amber-700",
                      invoice.status === 'Vencida' && "bg-rose-100 text-rose-700",
                    )}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                      <ArrowUpRight size={18} />
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
