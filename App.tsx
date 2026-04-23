import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users,
  Ticket as TicketIcon, 
  MessageSquare, 
  Bot, 
  CheckSquare, 
  BarChart3, 
  UserCircle, 
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  Smartphone,
  LayoutGrid,
  DollarSign,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { TicketProvider } from './context/TicketContext';
import { cn } from './lib/utils';
import { View } from './types';

// Views
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import CustomerPortalView from './views/CustomerPortalView';
import SAAMiaView from './views/SAAMiaView';
import TasksView from './views/TasksView';
import ExecutiveView from './views/ExecutiveView';
import CustomersView from './views/CustomersView';
import WhatsAppView from './views/WhatsAppView';
import MovideskView from './views/MovideskView';
import JiraBitrixView from './views/JiraBitrixView';
import ContaAzulView from './views/ContaAzulView';
import SettingsView from './views/SettingsView';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [movideskTab, setMovideskTab] = useState<'inicio' | 'pessoas' | 'indicadores'>('inicio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Principal', 'Integrações']);

  const handleNavigate = (view: View, tab?: 'inicio' | 'pessoas' | 'indicadores') => {
    setCurrentView(view);
    if (tab) {
      setMovideskTab(tab);
    } else if (view === 'movidesk') {
      setMovideskTab('inicio');
    }
  };

  if (currentView === 'login') {
    return (
      <TicketProvider>
        <Toaster position="top-right" richColors />
        <LoginView onLogin={() => handleNavigate('dashboard')} />
      </TicketProvider>
    );
  }

  const navGroups = [
    {
      title: 'Principal',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tasks', label: 'Diário de Bordo', icon: CheckSquare },
      ]
    },
    {
      title: 'Comunicação',
      items: [
        { id: 'saamia', label: 'Assistente SAAMia', icon: Bot },
        { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
      ]
    },
    {
      title: 'Integrações',
      items: [
        { id: 'movidesk', label: 'Central Movidesk', icon: TicketIcon },
        { id: 'jira-bitrix', label: 'Jira & Bitrix', icon: LayoutGrid },
        { id: 'conta-azul', label: 'Conta Azul', icon: DollarSign },
      ]
    },
    {
      title: 'Gestão',
      items: [
        { id: 'customer-portal', label: 'Portal do Cliente', icon: Smartphone },
        { id: 'settings', label: 'Configurações', icon: Settings },
      ]
    }
  ];

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const currentNavItem = navGroups.flatMap(g => g.items).find(item => item.id === currentView);

  return (
    <TicketProvider>
      <div className="flex flex-col h-screen bg-[#F1F5F9] text-slate-900 font-sans overflow-hidden">
        {/* Top System Status Bar */}
        <div className="h-6 bg-slate-900 text-white flex items-center justify-between px-4 text-[10px] font-bold uppercase tracking-widest shrink-0">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sistema Online
            </span>
            <span className="text-slate-500">|</span>
            <span>Região: US-East-1</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Versão: 3.0.4-Stable</span>
            <span className="text-slate-500">|</span>
            <span>{new Date().toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <Toaster position="top-right" richColors />
        
        {/* Sidebar */}
        <aside 
          className={cn(
            "bg-[#0F172A] text-white flex flex-col transition-all duration-300 ease-in-out z-50 border-r border-slate-800 shadow-2xl",
            isSidebarOpen ? "w-64" : "w-20"
          )}
        >
          <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0 bg-[#1E293B]/30">
            {isSidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">S</div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight leading-none">SAAM <span className="text-blue-400">CR</span></span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Enterprise v3.0</span>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center font-bold text-lg mx-auto shadow-lg shadow-blue-500/20">S</div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                {isSidebarOpen ? (
                  <button 
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between px-3 mb-2 group cursor-pointer"
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] group-hover:text-slate-300 transition-colors">
                      {group.title}
                    </p>
                    <div className={cn(
                      "w-4 h-4 flex items-center justify-center transition-transform duration-200",
                      expandedGroups.includes(group.title) ? "rotate-0" : "-rotate-90"
                    )}>
                      <Menu size={10} className="text-slate-600" />
                    </div>
                  </button>
                ) : (
                  <div className="h-px bg-slate-800 mx-2 mb-4 opacity-50" />
                )}
                
                <AnimatePresence initial={false}>
                  {(expandedGroups.includes(group.title) || !isSidebarOpen) && (
                    <motion.div 
                      initial={isSidebarOpen ? { height: 0, opacity: 0 } : false}
                      animate={isSidebarOpen ? { height: 'auto', opacity: 1 } : false}
                      exit={isSidebarOpen ? { height: 0, opacity: 0 } : false}
                      className="space-y-0.5 overflow-hidden"
                    >
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            handleNavigate(item.id as View);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative border",
                            currentView === item.id 
                              ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20" 
                              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border-transparent"
                          )}
                        >
                          <item.icon size={18} className={cn(currentView === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                          {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                          {!isSidebarOpen && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none shadow-xl border border-slate-800 whitespace-nowrap z-[100] transition-opacity">
                              {item.label}
                            </div>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800 bg-[#0F172A]">
            <div className="bg-slate-800/30 rounded-2xl p-3 mb-4 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <UserCircle size={20} />
                </div>
                {isSidebarOpen && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-200 truncate">João Carlos</span>
                    <span className="text-[10px] text-slate-500 truncate">Admin Master</span>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => setCurrentView('login')}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 transition-all rounded-xl group"
            >
              <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-300" />
              {isSidebarOpen && <span className="font-medium text-sm">Sair do Sistema</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-40">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <Menu size={20} />
              </button>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">Sistema</span>
                <span className="text-slate-300">/</span>
                <span className="font-semibold text-slate-700">{currentNavItem?.label || 'Início'}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Pesquisa global..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl w-64 text-xs transition-all outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 relative transition-colors border border-transparent hover:border-slate-200">
                  <Bell size={18} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                </button>
              </div>

              <div className="h-8 w-px bg-slate-200"></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">João Carlos</p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1">Administrador</p>
                </div>
                <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 border border-blue-400/20 hover:scale-105 transition-transform">
                  JC
                </button>
              </div>
            </div>
          </header>

          {/* View Content */}
          <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full p-8"
              >
              {currentView === 'dashboard' && <DashboardView onNavigate={(view, tab) => handleNavigate(view, tab as any)} />}
              {currentView === 'tasks' && <TasksView />}
              {currentView === 'saamia' && <SAAMiaView />}
              {currentView === 'whatsapp' && <WhatsAppView />}
              {currentView === 'movidesk' && <MovideskView initialTab={movideskTab} />}
              {currentView === 'jira-bitrix' && <JiraBitrixView />}
              {currentView === 'conta-azul' && <ContaAzulView />}
              {currentView === 'executive' && <ExecutiveView />}
              {currentView === 'settings' && <SettingsView />}
              {currentView === 'customer-portal' && <CustomerPortalView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
        </div>
      </div>
    </TicketProvider>
  );
}
