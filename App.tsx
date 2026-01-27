
import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InvoiceForm from './components/InvoiceForm';
import ClientSection from './components/ClientSection';
import ProductSection from './components/ProductSection';
import SettingsSection from './components/SettingsSection';
import { 
  Invoice, 
  Client, 
  Product, 
  ViewState, 
  InvoiceStatus,
  CompanyInfo
} from './types';
import { 
  Search,
  Trash2,
  Eye,
  FileDown,
  Filter,
  XCircle,
  Database,
  ShieldCheck,
  Check
} from 'lucide-react';
import { formatCurrency, formatDate, generateId } from './lib/utils';
import { db, dbService } from './lib/db';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('DASHBOARD');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDbLoaded, setIsDbLoaded] = useState(false);
  
  // Filtres
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'IBRA SERVICES INC.',
    address: '2374 RUE ROYALE\nTrois-Rivières, QC, G9A 4L5',
    phone: '+1 819 979 10 17',
    email: 'INFO@IBRASERVICES.CA',
    tps: '787396746RT0001',
    tvq: '4031303082TQ0001',
    logo: undefined
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const [invs, cls, prods, config] = await Promise.all([
          db.invoices.toArray(),
          db.clients.toArray(),
          db.products.toArray(),
          db.company.get('config')
        ]);
        
        setInvoices(invs.sort((a, b) => b.date.localeCompare(a.date)));
        setClients(cls);
        setProducts(prods);
        if (config) {
          const { id, ...rest } = config as any;
          setCompanyInfo(rest);
        }
        setIsDbLoaded(true);
      } catch (error) {
        console.error("Erreur chargement DB:", error);
      }
    };
    initData();
  }, []);

  const handleSaveInvoice = async (invoice: Invoice) => {
    await db.invoices.add(invoice);
    setInvoices([invoice, ...invoices]);
    setCurrentView('INVOICES');
  };

  const handleQuickAddClient = async (name: string): Promise<Client> => {
    const newClient: Client = {
      id: generateId(),
      name,
      email: '',
      phone: '',
      address: '',
      createdAt: new Date().toISOString()
    };
    await db.clients.add(newClient);
    setClients(prev => [...prev, newClient]);
    return newClient;
  };

  const deleteInvoice = async (id: string) => {
    if (window.confirm("Action irréversible : Supprimer cette facture ?")) {
      await db.invoices.delete(id);
      setInvoices(invoices.filter(i => i.id !== id));
    }
  };

  const handleSaveSettings = async (newInfo: CompanyInfo) => {
    setCompanyInfo(newInfo);
    await db.company.put({ ...newInfo, id: 'config' });
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const client = clients.find(c => c.id === inv.clientId);
      const clientName = client?.name.toLowerCase() || '';
      const matchesSearch = inv.number.toLowerCase().includes(invoiceSearchTerm.toLowerCase()) || 
                           clientName.includes(invoiceSearchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      const matchesDate = (!dateStart || inv.date >= dateStart) && (!dateEnd || inv.date <= dateEnd);
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [invoices, clients, invoiceSearchTerm, statusFilter, dateStart, dateEnd]);

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID: return 'bg-green-100 text-green-700';
      case InvoiceStatus.OVERDUE: return 'bg-red-100 text-red-700';
      case InvoiceStatus.SENT: return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isDbLoaded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#2557a7]">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-black uppercase tracking-[0.3em]">Initialisation IbraPro...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return (
          <div className="space-y-6">
             <div className="bg-white px-6 py-3 rounded-2xl border flex items-center gap-3 no-print">
               <ShieldCheck className="text-green-500" size={20} />
               <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                 Sécurité : Vos données sont stockées localement sur cet appareil. Pensez à exporter régulièrement dans Paramètres.
               </p>
             </div>
             <Dashboard invoices={invoices} />
          </div>
        );
      
      case 'INVOICES':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white p-6 rounded-[32px] border shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Numéro, client..." 
                    value={invoiceSearchTerm}
                    onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#2557a7] outline-none font-bold transition-all" 
                  />
                </div>
                <div className="lg:w-48 relative">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#2557a7] outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="ALL">Statut: Tous</option>
                    {Object.values(InvoiceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {(invoiceSearchTerm || statusFilter !== 'ALL' || dateStart || dateEnd) && (
                  <button onClick={() => { setInvoiceSearchTerm(''); setStatusFilter('ALL'); setDateStart(''); setDateEnd(''); }} className="px-4 py-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                    <XCircle size={18} /> Réinitialiser
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b">
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">N°</th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Client</th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Statut</th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Total</th>
                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-6 font-black text-slate-900">#{inv.number}</td>
                      <td className="px-8 py-6 font-bold text-slate-700 uppercase">{clients.find(c => c.id === inv.clientId)?.name || 'Inconnu'}</td>
                      <td className="px-8 py-6 text-gray-500 font-medium">{formatDate(inv.date)}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-[#2557a7] text-lg">{formatCurrency(inv.total)}</td>
                      <td className="px-8 py-6 text-right flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelectedInvoice(inv); setCurrentView('VIEW_INVOICE'); }} className="p-3 bg-[#2557a7] text-white rounded-xl shadow-lg shadow-blue-100 hover:scale-105 transition-transform"><Eye size={18}/></button>
                        <button onClick={() => deleteInvoice(inv.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvoices.length === 0 && <div className="py-20 text-center text-gray-400 font-bold italic uppercase tracking-widest text-xs">Aucune facture trouvée.</div>}
            </div>
          </div>
        );

      case 'VIEW_INVOICE':
        if (!selectedInvoice) return null;
        const invClient = clients.find(c => c.id === selectedInvoice.clientId);
        return (
          <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in zoom-in-95">
            <div className="flex justify-between items-center no-print px-4">
              <button onClick={() => setCurrentView('INVOICES')} className="text-gray-500 font-black uppercase tracking-widest text-xs hover:text-[#2557a7] transition-colors">← Retour au répertoire</button>
              <button onClick={() => window.print()} className="bg-[#2557a7] text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2 hover:bg-[#1a3e7a] transition-all">
                <FileDown size={18}/> Exporter PDF / Imprimer
              </button>
            </div>

            <div id="invoice-print-area" className="bg-white p-12 text-black min-h-[1056px] font-sans border shadow-sm print:shadow-none print:border-none">
              <div className="border-t-[16px] border-[#2557a7] mb-6 flex justify-center py-2">
                 <h1 className="text-3xl font-bold tracking-[0.2em] uppercase">Facture</h1>
              </div>

              <div className="grid grid-cols-2 gap-0 border-t-2 border-[#2557a7] pt-4 mb-8">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-[#2557a7] rounded-tr-[30px] rounded-bl-[30px] flex items-center justify-center p-2 shrink-0">
                    {companyInfo.logo ? <img src={companyInfo.logo} className="w-full h-full object-contain" /> : <span className="text-white text-4xl font-black italic">i</span>}
                  </div>
                  <div className="text-[12px] leading-tight flex flex-col justify-center">
                    <h2 className="text-[16px] font-black uppercase">{companyInfo.name}</h2>
                    <h3 className="font-bold text-[#2557a7] text-[13px] mb-1 uppercase tracking-tighter">MÉCANIQUE GÉNÉRALE</h3>
                    <p className="whitespace-pre-line uppercase text-gray-700">{companyInfo.address}</p>
                    <p className="font-bold mt-1">TÉL: {companyInfo.phone}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center pl-10 text-[13px] space-y-1">
                   <div className="flex justify-between border-b pb-1"><span className="text-gray-500 uppercase font-black text-[9px]">Émise le :</span> <span className="font-bold">{formatDate(selectedInvoice.date)}</span></div>
                   <div className="flex justify-between border-b pb-1 pt-1"><span className="text-gray-500 uppercase font-black text-[9px]">Numéro :</span> <span className="font-bold">#{selectedInvoice.number}</span></div>
                </div>
              </div>

              <div className="mb-8 pt-4">
                <div className="border-t-[10px] border-[#63b3ed] w-full mb-4 opacity-50"></div>
                <div className="text-[14px]">
                  <p className="text-[10px] font-bold text-[#2557a7] mb-1 uppercase tracking-widest">Facturé à :</p>
                  <p className="font-black text-[18px] uppercase">{invClient?.name}</p>
                  <p className="uppercase text-gray-600 leading-tight">{invClient?.address || 'Adresse non spécifiée'}</p>
                  {selectedInvoice.vehicle && (
                    <div className="font-black text-[13px] uppercase mt-5 flex gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2"><span className="text-gray-400">VÉHICULE:</span> {selectedInvoice.vehicle.year} {selectedInvoice.vehicle.model}</div>
                      <div className="flex items-center gap-2"><span className="text-gray-400">VIN:</span> {selectedInvoice.vehicle.vin}</div>
                      <div className="ml-auto flex items-center gap-2"><span className="text-gray-400">ODO:</span> {selectedInvoice.vehicle.mileage} KM</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <table className="w-full border-collapse border border-black">
                  <thead className="bg-[#2557a7] text-white">
                    <tr>
                      <th className="border border-black px-2 py-3 text-center text-[10px] font-black uppercase w-12">Qté</th>
                      <th className="border border-black px-4 py-3 text-left text-[10px] font-black uppercase">Description</th>
                      <th className="border border-black px-2 py-3 text-center text-[10px] font-black uppercase w-32">P.U.</th>
                      <th className="border border-black px-2 py-3 text-center text-[10px] font-black uppercase w-32">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-[12px]">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border border-black px-2 py-3 text-center font-bold">{item.quantity}</td>
                        <td className="border border-black px-4 py-3 text-left uppercase font-medium">{item.description}</td>
                        <td className="border border-black px-2 py-3 text-right pr-4">{formatCurrency(item.unitPrice)}</td>
                        <td className="border border-black px-2 py-3 text-right pr-4 font-bold">{formatCurrency(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mb-8">
                <div className="w-full max-w-[320px] text-[14px] space-y-2">
                  <div className="flex justify-between border-b border-gray-100 pb-1"><span className="text-gray-500 uppercase font-bold text-[10px]">Sous-total</span><span className="font-bold">{formatCurrency(selectedInvoice.subTotal)}</span></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1"><span className="uppercase font-bold text-[10px]">TPS (5%)</span><span className="font-bold">{formatCurrency(selectedInvoice.tps)}</span></div>
                  <div className="flex justify-between border-b border-gray-100 pb-1"><span className="uppercase font-bold text-[10px]">TVQ (9.975%)</span><span className="font-bold">{formatCurrency(selectedInvoice.tvq)}</span></div>
                  <div className="flex justify-between text-[22px] font-black pt-3 border-t-2 border-black bg-gray-50 p-3 mt-2">
                    <span className="text-[11px] mt-1.5 uppercase">TOTAL</span>
                    <span className="text-[#2557a7]">{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="mb-12 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[9px] font-black text-[#2557a7] uppercase tracking-widest mb-1">Commentaires :</p>
                  <p className="text-xs text-gray-700 italic leading-relaxed">"{selectedInvoice.notes}"</p>
                </div>
              )}

              <div className="mt-auto pt-10 break-inside-avoid">
                <div className="border-t-[8px] border-[#2557a7] w-full mb-4 opacity-30"></div>
                <h3 className="text-center font-black text-[14px] tracking-[0.5em] uppercase mb-8 text-[#2557a7]">Coupon de versement</h3>
                <div className="grid grid-cols-2 gap-12 text-[13px] px-6 border-b-2 border-dashed pb-8">
                   <div className="space-y-2">
                      <p><span className="text-gray-400 font-bold uppercase text-[9px]">Dossier Client :</span> <br/><span className="font-black uppercase text-lg">{invClient?.name}</span></p>
                      <p><span className="text-gray-400 font-bold uppercase text-[9px]">Référence Facture :</span> <br/><span className="font-bold">#{selectedInvoice.number}</span></p>
                   </div>
                   <div className="space-y-2 text-right">
                      <p><span className="text-gray-400 font-bold uppercase text-[9px]">Date :</span> <br/><span className="font-bold">{formatDate(selectedInvoice.date)}</span></p>
                      <p className="text-3xl font-black text-[#2557a7] pt-2">{formatCurrency(selectedInvoice.total)}</p>
                   </div>
                </div>
                <div className="flex justify-between mt-6 text-[9px] font-black px-6 opacity-40 uppercase tracking-widest">
                  <p>TPS : {companyInfo.tps}</p>
                  <p>TVQ : {companyInfo.tvq}</p>
                  <p>Merci pour votre confiance !</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'CLIENTS': return <ClientSection clients={clients} onAddClient={c => { db.clients.add(c); setClients([...clients, c]); }} onDeleteClient={id => { db.clients.delete(id); setClients(clients.filter(c => c.id !== id)); }} />;
      case 'PRODUCTS': return <ProductSection products={products} onAddProduct={p => { db.products.add(p); setProducts([...products, p]); }} onDeleteProduct={id => { db.products.delete(id); setProducts(products.filter(p => p.id !== id)); }} />;
      case 'SETTINGS': return <div className="space-y-8 animate-in fade-in"><SettingsSection settings={companyInfo} onSave={handleSaveSettings} /><div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border shadow-sm space-y-4"><h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Database className="text-[#2557a7]" /> Maintenance & Sauvegarde</h3><p className="text-xs text-gray-500 font-medium px-1">L'application fonctionne en local. Exporter vos données permet de les restaurer sur un autre ordinateur ou de garder une archive de sécurité.</p><div className="flex gap-4"><button onClick={() => dbService.exportBackup()} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all">Exporter SQL (JSON)</button><label className="flex-1 py-4 bg-blue-50 text-[#2557a7] hover:bg-blue-100 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer">Restaurer Sauvegarde<input type="file" accept=".json" onChange={async e => { if (e.target.files?.[0]) { if (await dbService.importBackup(e.target.files[0])) window.location.reload(); } }} className="hidden" /></label></div></div></div>;
      case 'CREATE_INVOICE': return <InvoiceForm onSave={handleSaveInvoice} onQuickAddClient={handleQuickAddClient} onCancel={() => setCurrentView('INVOICES')} clients={clients} products={products} invoiceCount={invoices.length} />;
      default: return null;
    }
  };

  return <Layout currentView={currentView} setView={setCurrentView}>{renderContent()}</Layout>;
};

export default App;
