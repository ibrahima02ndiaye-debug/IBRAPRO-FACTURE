
import React, { useEffect, useState } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle,
  Lightbulb,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Invoice, InvoiceStatus } from '../types';
import { formatCurrency } from '../lib/utils';
import { getFinancialAdvice } from '../services/geminiService';

interface DashboardProps {
  invoices: Invoice[];
}

const Dashboard: React.FC<DashboardProps> = ({ invoices }) => {
  const [advice, setAdvice] = useState<string>("Chargement de vos conseils financiers...");

  const totalRevenue = invoices
    .filter(inv => inv.status === InvoiceStatus.PAID)
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingRevenue = invoices
    .filter(inv => inv.status === InvoiceStatus.SENT || inv.status === InvoiceStatus.OVERDUE)
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdueCount = invoices.filter(inv => inv.status === InvoiceStatus.OVERDUE).length;

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const res = await getFinancialAdvice(totalRevenue, overdueCount);
        setAdvice(res);
      } catch (e) {
        setAdvice("Surveillez vos factures en retard pour optimiser votre trésorerie.");
      }
    };
    fetchAdvice();
  }, [totalRevenue, overdueCount]);

  const chartData = [
    { name: 'Jan', revenue: 4500 },
    { name: 'Fév', revenue: 5200 },
    { name: 'Mar', revenue: 4800 },
    { name: 'Avr', revenue: 6100 },
    { name: 'Mai', revenue: 5500 },
    { name: 'Juin', revenue: 7200 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Payées</span>
          </div>
          <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chiffre d'Affaires</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalRevenue)}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Clock size={24} />
            </div>
          </div>
          <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">En attente</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(pendingRevenue)}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <TrendingDown size={24} />
            </div>
            {overdueCount > 0 && (
              <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-widest">{overdueCount} Retard(s)</span>
            )}
          </div>
          <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Impayées</p>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{formatCurrency(invoices.filter(i => i.status === InvoiceStatus.OVERDUE).reduce((a,b)=>a+b.total,0))}</h3>
        </div>

        <div className="bg-[#2557a7] p-6 rounded-3xl shadow-xl shadow-blue-100 text-white">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white/20 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
          </div>
          <p className="mt-4 text-[10px] font-black text-blue-200 uppercase tracking-widest opacity-80">Statut Système</p>
          <h3 className="text-2xl font-black mt-1">SÉCURISÉ</h3>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#2557a7] to-[#1a3e7a] rounded-[40px] p-8 text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-blue-100">
        <div className="p-5 bg-white/10 backdrop-blur-xl rounded-[30px] border border-white/10 shrink-0">
          <Lightbulb size={32} className="text-amber-300" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="font-black text-xl mb-2 uppercase tracking-tighter italic">Intelligence IbraPro</h4>
          <p className="text-blue-100 font-medium leading-relaxed">{advice}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Flux de Trésorerie</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2557a7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2557a7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2557a7" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Activités Récentes</h3>
          <div className="space-y-6">
            {invoices.slice(0, 4).map(inv => (
              <div key={inv.id} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full shadow-sm ${
                    inv.status === InvoiceStatus.PAID ? 'bg-emerald-500' : 
                    inv.status === InvoiceStatus.OVERDUE ? 'bg-rose-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-black text-slate-900">#{inv.number}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inv.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#2557a7]">{formatCurrency(inv.total)}</p>
                </div>
              </div>
            ))}
            {invoices.length === 0 && (
              <div className="text-center py-10 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-widest italic">Aucun mouvement</p>
              </div>
            )}
          </div>
          <button className="w-full mt-10 py-4 bg-slate-50 rounded-2xl text-[10px] font-black text-[#2557a7] uppercase tracking-widest hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
            <span>Rapports complets</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
