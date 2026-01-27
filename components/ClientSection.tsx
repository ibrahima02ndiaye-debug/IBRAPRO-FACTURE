
import React, { useState } from 'react';
import { Users, Plus, Search, Trash2, Mail, Phone, MapPin, X, User } from 'lucide-react';
import { Client } from '../types';
import { generateId } from '../lib/utils';

interface ClientSectionProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

const ClientSection: React.FC<ClientSectionProps> = ({ clients, onAddClient, onDeleteClient }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;
    
    const client: Client = {
      id: generateId(),
      name: newClient.name!,
      email: newClient.email || '',
      phone: newClient.phone || '',
      address: newClient.address || '',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    onAddClient(client);
    setIsAdding(false);
    setNewClient({ name: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Répertoire Clients</h2>
          <p className="text-gray-500 font-medium">Gérez vos relations clients et leurs coordonnées.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Nouveau Client
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border shadow-sm flex items-center gap-4">
        <Search className="text-gray-400 ml-2" size={20} />
        <input 
          type="text" 
          placeholder="Rechercher par nom, email ou ville..." 
          className="flex-1 border-none focus:ring-0 text-lg font-medium outline-none" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Adresse</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-black">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-black text-slate-900 uppercase tracking-tight">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <Phone size={14} className="text-indigo-400" />
                        {client.phone || '-'}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                        <Mail size={12} />
                        {client.email || '-'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-medium text-sm max-w-xs truncate">
                    {client.address || '-'}
                  </td>
                  <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onDeleteClient(client.id)}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-gray-400 font-bold italic">
                    Aucun client trouvé pour votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Ajouter un Client</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="p-2 bg-gray-50 rounded-full text-gray-400"><X size={20} /></button>
            </div>
            <div className="p-10 space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Nom Complet / Entreprise *</label>
                <input 
                  required
                  autoFocus
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-lg"
                  value={newClient.name}
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email</label>
                  <input 
                    type="email"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 outline-none font-medium"
                    value={newClient.email}
                    onChange={e => setNewClient({...newClient, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Téléphone</label>
                  <input 
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 outline-none font-medium"
                    value={newClient.phone}
                    onChange={e => setNewClient({...newClient, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Adresse de facturation</label>
                <textarea 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 outline-none font-medium"
                  rows={2}
                  value={newClient.address}
                  onChange={e => setNewClient({...newClient, address: e.target.value})}
                />
              </div>
            </div>
            <div className="px-10 py-8 bg-gray-50 flex justify-end gap-6 items-center">
              <button type="button" onClick={() => setIsAdding(false)} className="font-black text-gray-400 uppercase tracking-widest text-xs">Annuler</button>
              <button type="submit" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100">Enregistrer</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientSection;
