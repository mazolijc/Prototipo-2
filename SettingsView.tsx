import React from 'react';
import { Settings, Shield, Bell, User, Globe, Database, Key, Save } from 'lucide-react';
import { cn } from '../lib/utils';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('general');

  const tabs = [
    { id: 'general', label: 'Geral', icon: Settings },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'integrations', label: 'Integrações', icon: Globe },
    { id: 'database', label: 'Banco de Dados', icon: Database },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
              <Settings size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Configurações do Sistema</h1>
              <p className="text-slate-500 text-sm font-medium">Gerencie as preferências e parâmetros globais da plataforma.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm shadow-blue-200">
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar Tabs */}
        <aside className="w-64 border-r border-slate-200 bg-white p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* General Settings */}
            <section className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Preferências Gerais</h3>
                <p className="text-sm text-slate-500">Configure o comportamento básico do sistema.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome da Empresa</label>
                    <input 
                      type="text" 
                      defaultValue="SAAM CR v3"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Idioma Padrão</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                      <option>Português (Brasil)</option>
                      <option>English (US)</option>
                      <option>Español</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Modo de Manutenção</p>
                    <p className="text-xs text-slate-500">Desabilita o acesso de usuários externos durante atualizações.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </section>

            {/* API Keys */}
            <section className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Chaves de API</h3>
                <p className="text-sm text-slate-500">Gerencie as credenciais de acesso para integrações externas.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Serviço</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chave</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { service: 'Movidesk API', key: '••••••••••••••••••••••••' },
                      { service: 'Jira Cloud', key: '••••••••••••••••••••••••' },
                      { service: 'Bitrix24 Webhook', key: '••••••••••••••••••••••••' },
                      { service: 'Conta Azul OAuth', key: '••••••••••••••••••••••••' },
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700">{item.service}</span>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">{item.key}</code>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                            <Key size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsView;
