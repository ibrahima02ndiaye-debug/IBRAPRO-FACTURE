
import React, { useState } from 'react';
import { Package, Plus, Search, Trash2, Tag, Info } from 'lucide-react';
import { Product } from '../types';
import { generateId, formatCurrency } from '../lib/utils';

interface ProductSectionProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductSection: React.FC<ProductSectionProps> = ({ products, onAddProduct, onDeleteProduct }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    basePrice: 0,
    taxRate: 20
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.basePrice === undefined) return;
    
    const product: Product = {
      id: generateId(),
      name: newProduct.name!,
      description: newProduct.description || '',
      basePrice: newProduct.basePrice,
      taxRate: 20
    };
    
    onAddProduct(product);
    setIsAdding(false);
    setNewProduct({ name: '', description: '', basePrice: 0 });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="text-indigo-600" />
          Catalogue Services & Pièces
        </h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all"
        >
          <Plus size={20} />
          Ajouter au Catalogue
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher par nom..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Article</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Prix de base</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </td>
                <td className="px-6 py-4 font-bold text-indigo-600">
                  {formatCurrency(product.basePrice)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDeleteProduct(product.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-400">Aucun article enregistré.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Nouvel Article</h3>
              <button type="button" onClick={() => setIsAdding(false)}><Plus className="rotate-45" size={24} /></button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nom / Description courte *</label>
                <input 
                  required
                  placeholder="ex: Main d'oeuvre mécanique"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Prix unitaire (CAD) *</label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newProduct.basePrice}
                  onChange={e => setNewProduct({...newProduct, basePrice: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Notes internes</label>
                <textarea 
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 font-medium text-gray-500">Annuler</button>
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">Ajouter</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductSection;
