import React, { useState } from 'react';
import { raffleService } from '../services/raffleService';
import { useNavigation } from '../App';
import { ChevronLeft, Save } from 'lucide-react';

export const CreateRaffle: React.FC = () => {
  const { navigate } = useNavigation();
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: 'https://picsum.photos/id/10/800/600',
    pricePerTicket: 1.00,
    totalTickets: 100,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await raffleService.createRaffle(form);
    navigate('admin');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
       <button onClick={() => navigate('admin')} className="flex items-center text-slate-500 hover:text-slate-800 mb-6">
        <ChevronLeft size={20} /> Cancelar
      </button>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Criar Nova Rifa</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título do Prêmio</label>
            <input 
              required
              type="text"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="Ex: iPhone 15 Pro"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Detalhes do prêmio..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preço da Cota (R$)</label>
              <input 
                required
                type="number"
                step="0.01"
                min="0.01"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                value={form.pricePerTicket}
                onChange={e => setForm({...form, pricePerTicket: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Qtd. de Números</label>
              <input 
                required
                type="number"
                min="10"
                max="1000"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                value={form.totalTickets}
                onChange={e => setForm({...form, totalTickets: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL da Imagem</label>
            <input 
              required
              type="url"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              value={form.imageUrl}
              onChange={e => setForm({...form, imageUrl: e.target.value})}
            />
            <p className="text-xs text-slate-400 mt-1">Use https://picsum.photos/id/NUMBER/800/600 para testar</p>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full flex justify-center items-center bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg">
              <Save className="mr-2" size={20} /> Criar Rifa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};