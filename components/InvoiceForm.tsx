
import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Sparkles,
  UserPlus,
  Search,
  Check,
  Car
} from 'lucide-react';
import { Client, Product, InvoiceItem, InvoiceStatus, Invoice, VehicleInfo } from '../types';
import { 
  generateId, 
  generateInvoiceNumber, 
  calculateTotals, 
  formatCurrency 
} from '../lib/utils';
import { generateProductDescription } from '../services/geminiService';

interface InvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  onQuickAddClient: (name: string) => Client | Promise<Client>;
  onCancel: () => void;
  clients: Client[];
  products: Product[];
  invoiceCount: number;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  onSave, 
  onQuickAddClient,
  onCancel, 
  clients, 
  products, 
  invoiceCount 
}) => {
  const [clientId, setClientId] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [showVehicle, setShowVehicle] = useState(false);
  
  const clientMenuRef = useRef<HTMLDivElement>(null);

  const [vehicle, setVehicle] = useState<VehicleInfo>({
    year: '',
    model: '',
    vin: '',
    mileage: ''
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientMenuRef.current && !clientMenuRef.current.contains(event.target as Node)) {
        setIsClientMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleSelectClient = (client: Client) => {
    setClientId(client.id);
    setClientSearch(client.name);
    setIsClientMenuOpen(false);
  };

  const handleQuickAdd = async () => {
    if (!clientSearch.trim()) return;
    const newClient = await onQuickAddClient(clientSearch.trim());
    handleSelectClient(newClient);
  };

  const addItem = () => {
    setItems([...items, {
      id: generateId(),
      description: '',
      quantity: 1,
      unitPrice: 0
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSmartDescribe = async (itemId: string, desc: string) => {
    if (!desc) return;
    setIsGenerating(itemId);
    const newDesc = await generateProductDescription(desc);
    updateItem(itemId, 'description', newDesc);
    setIsGenerating(null);
  };

  const { subTotal, tps, tvq, total } = calculateTotals(items);

  const handleSave = () => {
    if (!clientId) {
      alert("Veuillez sélectionner ou créer un client.");
      return;
    }
    if (items.length === 0) {
      alert("Veuillez ajouter au moins un service ou produit.");
      return;
    }

    const newInvoice: Invoice = {
      id: generateId(),
      number: generateInvoiceNumber(invoiceCount),
      clientId,
      date,
      dueDate: date,
      items,
      status: InvoiceStatus.DRAFT,
      notes,
      vehicle: showVehicle ? vehicle : undefined,
      subTotal,
      tps,
      tvq,
      total
    };
    onSave(newInvoice);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border-t-8 border-indigo-600 overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Nouvelle Facture</h2>
          <p className="text-indigo-600 font-bold">N° {generateInvoiceNumber(invoiceCount)}</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} className="text-gray-400" />
        </button>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">Client</label>
            <div className="relative" ref={clientMenuRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text"
                  placeholder="Rechercher ou créer un client..."
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setIsClientMenuOpen(true);
                    if (clientId) setClientId('');
                  }}
                  onFocus={() => setIsClientMenuOpen(true)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-indigo-500 outline-none transition-all font-bold text-lg text-slate-800 placeholder:text-gray-300"
                />
              </div>

              {isClientMenuOpen && (
                <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="max-h-60 overflow-y-auto">
                    {filteredClients.map(client => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => handleSelectClient(client)}
                        className="w-full text-left px-5 py-4 hover:bg-indigo-50 flex items-center justify-between border-b border-gray-50 last:border-0"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{client.name}</p>
                          <p className="text-xs text-gray-500">{client.phone || 'Pas de numéro'}</p>
                        </div>
                        {clientId === client.id && <Check className="text-indigo-600" size={20} />}
                      </button>
                    ))}
                    
                    {clientSearch.trim() && !filteredClients.some(c => c.name.toLowerCase() === clientSearch.toLowerCase()) && (
                      <button
                        type="button"
                        onClick={handleQuickAdd}
                        className="w-full text-left px-5 py-5 bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-3"
                      >
                        <UserPlus size={20} />
                        <div>
                          <p className="font-black">CRÉER : "{clientSearch}"</p>
                          <p className="text-xs text-indigo-100">Ajouter ce nouveau client instantanément</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 items-center">
               <div className="flex-1">
                 <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Date d'émission</label>
                 <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 outline-none focus:border-indigo-500 font-medium"
                />
               </div>
               <button 
                type="button"
                onClick={() => setShowVehicle(!showVehicle)}
                className={`mt-5 px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2 font-bold text-sm ${showVehicle ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
               >
                 <Car size={18} />
                 Véhicule
               </button>
            </div>
          </div>

          {/* Vehicle Info (Conditional) */}
          {showVehicle ? (
            <div className="bg-indigo-50/50 p-6 rounded-3xl border-2 border-indigo-100 space-y-4 animate-in slide-in-from-right-4">
              <h3 className="font-black text-indigo-900 text-sm uppercase tracking-widest flex items-center gap-2">
                <Car size={16} /> Détails Véhicule
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Année" value={vehicle.year} onChange={e => setVehicle({...vehicle, year: e.target.value})} className="px-3 py-2.5 rounded-xl border border-indigo-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input placeholder="Modèle" value={vehicle.model} onChange={e => setVehicle({...vehicle, model: e.target.value})} className="px-3 py-2.5 rounded-xl border border-indigo-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input placeholder="NIV / VIN" value={vehicle.vin} onChange={e => setVehicle({...vehicle, vin: e.target.value})} className="px-3 py-2.5 rounded-xl border border-indigo-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none uppercase" />
                <input placeholder="KM" value={vehicle.mileage} onChange={e => setVehicle({...vehicle, mileage: e.target.value})} className="px-3 py-2.5 rounded-xl border border-indigo-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl text-gray-300">
               <Car size={48} className="mb-2 opacity-20" />
               <p className="text-xs font-bold uppercase tracking-widest">Pas d'infos véhicule</p>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">Services & Pièces</h3>
            <button onClick={addItem} className="bg-white border-2 border-indigo-600 text-indigo-600 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
              <Plus size={16} /> Ajouter une ligne
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-white p-4 rounded-2xl border-2 border-gray-50 shadow-sm hover:border-indigo-200 transition-all group">
                <div className="flex-1 relative w-full">
                  <input 
                    placeholder="Description des travaux..."
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-800"
                  />
                  <button 
                    onClick={() => handleSmartDescribe(item.id, item.description)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors"
                  >
                    <Sparkles size={18} className={isGenerating === item.id ? "animate-spin" : ""} />
                  </button>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <div className="w-20">
                    <input 
                      type="number"
                      placeholder="Qté"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-3 rounded-xl bg-gray-50 border-none text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="w-32">
                    <input 
                      type="number"
                      placeholder="Prix"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-3 rounded-xl bg-gray-50 border-none text-right font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <button 
                onClick={addItem}
                className="w-full py-12 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-300 hover:border-indigo-200 hover:text-indigo-400 hover:bg-indigo-50/30 transition-all"
              >
                <Plus size={32} className="mb-2" />
                <span className="font-black text-sm uppercase tracking-widest">Démarrer la facture</span>
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t-2 border-gray-50">
          <textarea 
            placeholder="Notes (apparaît sur la facture)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-5 rounded-3xl bg-gray-50 border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium min-h-[120px]"
          />
          <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100 space-y-3">
            <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-wider">
              <span>Sous-total:</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-wider">
              <span>Taxes (TPS+TVQ):</span>
              <span>{formatCurrency(tps + tvq)}</span>
            </div>
            <div className="flex justify-between text-3xl font-black pt-4 border-t border-slate-800 text-white">
              <span>TOTAL</span>
              <span className="text-indigo-400">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 bg-gray-50 border-t flex justify-end items-center gap-6">
        <button onClick={onCancel} className="font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest text-sm transition-colors">Annuler</button>
        <button 
          onClick={handleSave} 
          className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3"
        >
          <Save size={20} />
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default InvoiceForm;
