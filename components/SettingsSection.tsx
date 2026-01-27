
import React, { useState } from 'react';
import { Building2, Save, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';
import { CompanyInfo } from '../types';

interface SettingsSectionProps {
  settings: CompanyInfo;
  onSave: (settings: CompanyInfo) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<CompanyInfo>(settings);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData({ ...formData, logo: undefined });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-indigo-600 rounded-2xl">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Paramètres de l'entreprise</h2>
              <p className="text-slate-400 text-sm">Ces informations apparaîtront sur vos factures</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-6">
            {/* Logo Upload Section */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Logo de l'entreprise</label>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden group">
                  {formData.logo ? (
                    <>
                      <img src={formData.logo} alt="Logo preview" className="w-full h-full object-contain p-2" />
                      <button 
                        type="button"
                        onClick={removeLogo}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="mx-auto text-gray-400 mb-1" size={24} />
                      <span className="text-[10px] text-gray-400 font-medium">PNG/JPG</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="cursor-pointer bg-white border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold transition-all inline-block">
                    Choisir un logo
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">Format recommandé : Carré, max 1 Mo. Le logo sera affiché en haut à gauche de vos factures.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nom de l'entreprise</label>
              <input 
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: IBRA SERVICES INC."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Adresse complète</label>
              <textarea 
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                placeholder="Rue, Ville, Province, Code Postal"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Téléphone</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="819-000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="contact@exemple.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Numéro TPS</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.tps}
                  onChange={e => setFormData({...formData, tps: e.target.value})}
                  placeholder="123456789RT0001"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Numéro TVQ</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.tvq}
                  onChange={e => setFormData({...formData, tvq: e.target.value})}
                  placeholder="1234567890TQ0001"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            {showSuccess ? (
              <div className="flex items-center gap-2 text-green-600 font-bold animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 size={20} />
                <span>Enregistré avec succès !</span>
              </div>
            ) : <div />}
            
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Save size={20} />
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsSection;
