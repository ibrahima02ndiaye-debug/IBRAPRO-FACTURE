
import React, { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
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
  ArrowUpRight
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
      const res = await getFinancialAdvice(totalRevenue, overdueCount);
      setAdvice(res);
    };
    fetchAdvice();
  }, [totalRevenue, overdueCount]);

  const chartData = [
    { name: 'Jan', revenue: 4500, expenses: 3200 },
    { name: 'Feb', revenue: 5200, expenses: 3100 },
    { name: 'Mar', revenue: 4800, expenses: 3400 },
    { name: 'Apr', revenue: 6100, expenses: 3800 },
    { name: 'May', revenue: 5500, expenses: 3900 },
    { name: 'Jun', revenue: 7200, expenses: 4200 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">Chiffre d'Affaires</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Clock size={24} />
            </div>
            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">En attente</span>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">En cours d'encaissement</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(pendingRevenue)}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <TrendingDown size={24} />
            </div>
            {overdueCount > 0 && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">{overdueCount} Retard(s)</span>
            )}
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">Factures Impayées</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(invoices.filter(i => i.status === InvoiceStatus.OVERDUE).reduce((a,b)=>a+b.total,0))}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-gray-500">Taux de Conversion</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">94%</h3>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-6 text-white flex items-start space-x-4 shadow-lg">
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
          <Lightbulb size={24} />
        </div>
        <div>
          <h4 className="font-bold text-lg mb-1">Conseil IbraPro AI</h4>
          <p className="text-indigo-100">{advice}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Activité mensuelle</h3>
            <select className="bg-gray-50 border-none text-sm font-medium rounded-lg focus:ring-0">
              <option>6 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  cursor={{stroke: '#4f46e5', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Dernières factures</h3>
          <div className="space-y-4">
            {invoices.slice(0, 5).map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    inv.status === InvoiceStatus.PAID ? 'bg-green-500' : 
                    inv.status === InvoiceStatus.OVERDUE ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{inv.number}</p>
                    <p className="text-xs text-gray-500">Facture #{inv.number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(inv.total)}</p>
                  <p className="text-xs text-gray-400">{inv.date}</p>
                </div>
              </div>
            ))}
            {invoices.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 text-sm">Aucune facture récente</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center justify-center space-x-2">
            <span>Voir toutes les factures</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
