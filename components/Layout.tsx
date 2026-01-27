
import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Package, 
  Settings, 
  PlusCircle,
  Menu
} from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'DASHBOARD' as ViewState, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'INVOICES' as ViewState, label: 'Factures', icon: FileText },
    { id: 'CLIENTS' as ViewState, label: 'Clients', icon: Users },
    { id: 'PRODUCTS' as ViewState, label: 'Services & Pièces', icon: Package },
    { id: 'SETTINGS' as ViewState, label: 'Configuration', icon: Settings },
  ];

  const brandColor = "#2557a7";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden print:h-auto print:overflow-visible print:bg-white">
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex md:flex-col md:w-64 text-white no-print shadow-2xl z-20`} style={{ backgroundColor: brandColor }}>
        <div className="p-8 flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-[#2557a7] text-3xl italic shadow-lg">I</div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">IbraPro</span>
            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest opacity-80">Services Inc.</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center space-x-3 w-full px-4 py-4 rounded-2xl transition-all duration-300 ${
                currentView === item.id 
                  ? 'bg-white/20 text-white shadow-inner font-black translate-x-1' 
                  : 'text-blue-100 hover:bg-white/10 hover:translate-x-1'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? "opacity-100" : "opacity-60"} />
              <span className="text-sm uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/10">
          <div className="p-4 bg-white/5 rounded-2xl">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-center text-blue-200 opacity-60">Gestionnaire V1.0.5</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden print:overflow-visible print:h-auto">
        <header className="h-20 bg-white border-b flex items-center justify-between px-10 no-print shrink-0 shadow-sm z-10">
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          
          <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Navigation / {navItems.find(n => n.id === currentView)?.label || 'Facturation'}
          </h1>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setView('CREATE_INVOICE')}
              className="bg-[#2557a7] text-white px-8 py-3 rounded-2xl flex items-center space-x-2 transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[#1a3e7a] hover:-translate-y-0.5"
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">Nouvelle Facture</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 print:overflow-visible print:p-0 print:m-0 print:block">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
