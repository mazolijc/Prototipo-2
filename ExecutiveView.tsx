import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  BarChart3,
  ShieldCheck, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';

const monthlyData = [
  { name: 'Jan', atendimentos: 1200, sla: 98.2 },
  { name: 'Fev', atendimentos: 1350, sla: 97.8 },
  { name: 'Mar', atendimentos: 1580, sla: 98.5 },
];

const teamPerformance = [
  { name: 'Suporte N1', tickets: 850, satisfaction: 4.8 },
  { name: 'Suporte N2', tickets: 420, satisfaction: 4.9 },
  { name: 'Financeiro', tickets: 210, satisfaction: 4.7 },
  { name: 'Comercial', tickets: 100, satisfaction: 4.5 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function ExecutiveView() {
  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Executivo</h1>
            <p className="text-slate-500 font-medium mt-1">Visão analítica e estratégica da operação SAAM CR v3.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          {['Mensal', 'Trimestral', 'Anual'].map((period) => (
            <button key={period} className={cn(
              "px-4 py-1.5 text-sm font-bold rounded-lg transition-all",
              period === 'Mensal' ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            )}>
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Atendimentos no Mês', value: '1.580', trend: '+14%', icon: Users, color: 'blue' },
          { label: 'SLA Geral', value: '98.5%', trend: '+0.7%', icon: ShieldCheck, color: 'emerald' },
          { label: 'Tempo Médio (TMR)', value: '14min', trend: '-2min', icon: Clock, color: 'amber' },
          { label: 'Economia Gerada (IA)', value: 'R$ 12.4k', trend: '+22%', icon: DollarSign, color: 'indigo' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
            <div className="flex items-start justify-between relative z-10">
              <div className={cn(
                "p-3 rounded-2xl",
                kpi.color === 'blue' && "bg-blue-50 text-blue-600",
                kpi.color === 'emerald' && "bg-emerald-50 text-emerald-600",
                kpi.color === 'amber' && "bg-amber-50 text-amber-600",
                kpi.color === 'indigo' && "bg-indigo-50 text-indigo-600",
              )}>
                <kpi.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                kpi.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {kpi.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.trend}
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">{kpi.value}</h3>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <kpi.icon size={120} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Crescimento de Atendimento vs SLA</h3>
              <p className="text-sm text-slate-500">Comparativo trimestral de volume e qualidade.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-bold text-slate-600">Volume</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-bold text-slate-600">SLA %</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="atendimentos" stroke="#3B82F6" strokeWidth={4} dot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFF' }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="sla" stroke="#10B981" strokeWidth={4} dot={{ r: 6, fill: '#10B981', strokeWidth: 2, stroke: '#FFF' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategic Alertas */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Target size={24} className="text-blue-400" />
            Alertas Estratégicos
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Gargalo Identificado</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">A equipe de Suporte N1 está com sobrecarga de 25% acima da capacidade. Risco de queda no SLA.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Oportunidade de Automação</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">40% dos chamados de "Reset de Senha" podem ser automatizados via SAAMia, economizando R$ 4.2k/mês.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Churn Risk: TechCorp</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">Aumento de chamados críticos e queda na nota de satisfação. Recomendo contato do CS imediatamente.</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
            Ver Relatório Completo
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Team Performance Table */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-lg mb-6">Performance por Equipe</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Equipe</th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tickets Resolvidos</th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Satisfação (CSAT)</th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Carga de Trabalho</th>
                <th className="pb-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {teamPerformance.map((team, i) => (
                <tr key={team.name} className="group">
                  <td className="py-5">
                    <span className="font-bold text-slate-900">{team.name}</span>
                  </td>
                  <td className="py-5">
                    <span className="text-sm text-slate-600 font-medium">{team.tickets}</span>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={cn("text-lg", i < Math.floor(team.satisfaction) ? "opacity-100" : "opacity-20")}>★</span>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{team.satisfaction}</span>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={cn(
                        "h-full rounded-full",
                        i === 0 ? "bg-rose-500 w-[92%]" : 
                        i === 1 ? "bg-blue-500 w-[65%]" : "bg-emerald-500 w-[45%]"
                      )}></div>
                    </div>
                  </td>
                  <td className="py-5 text-right">
                    <button className="text-blue-600 font-bold text-xs hover:underline">Detalhes</button>
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
