import React, { useEffect, useState } from 'react';
import { raffleService } from '../services/raffleService';
import { Raffle, RaffleStatus } from '../types';
import { useNavigation } from '../App';
import { Trophy, Timer, ChevronRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const { navigate } = useNavigation();

  useEffect(() => {
    raffleService.getRaffles().then(data => {
      setRaffles(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  const activeRaffles = raffles.filter(r => r.status === RaffleStatus.ACTIVE);
  const finishedRaffles = raffles.filter(r => r.status !== RaffleStatus.ACTIVE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-emerald-800 rounded-2xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Sua sorte começa aqui!</h1>
          <p className="text-brand-100 text-lg mb-6">Participe das melhores rifas online. Prêmios incríveis, sorteios transparentes e compra segura.</p>
          <button onClick={() => document.getElementById('active-raffles')?.scrollIntoView({ behavior: 'smooth'})} className="bg-white text-brand-700 px-6 py-3 rounded-lg font-bold hover:bg-brand-50 transition-colors shadow-lg">
            Ver Prêmios Disponíveis
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 transform translate-x-12 -skew-x-12 bg-white"></div>
      </div>

      <div id="active-raffles" className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <Trophy className="mr-2 text-brand-500" /> Rifas em Destaque
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeRaffles.map(raffle => (
            <RaffleCard key={raffle.id} raffle={raffle} onClick={() => navigate('raffle-details', { id: raffle.id })} />
          ))}
          {activeRaffles.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">Nenhuma rifa ativa no momento.</p>
            </div>
          )}
        </div>
      </div>

      {finishedRaffles.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center opacity-75">
            <Timer className="mr-2" /> Rifas Encerradas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {finishedRaffles.map(raffle => (
              <RaffleCard key={raffle.id} raffle={raffle} compact onClick={() => navigate('raffle-details', { id: raffle.id })} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const RaffleCard: React.FC<{ raffle: Raffle, onClick: () => void, compact?: boolean }> = ({ raffle, onClick, compact }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col ${compact ? 'opacity-80' : ''}`}
    >
      <div className={`relative ${compact ? 'h-32' : 'h-48'}`}>
        <img src={raffle.imageUrl} alt={raffle.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
            raffle.status === RaffleStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {raffle.status === RaffleStatus.ACTIVE ? 'Ativa' : 'Encerrada'}
          </span>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className={`font-bold text-slate-900 mb-2 ${compact ? 'text-md' : 'text-xl'}`}>{raffle.title}</h3>
        {!compact && <p className="text-slate-500 text-sm mb-4 line-clamp-2">{raffle.description}</p>}
        
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-xs text-slate-400">Por apenas</span>
            <span className="text-lg font-bold text-brand-600">R$ {raffle.pricePerTicket.toFixed(2)}</span>
          </div>
          <button className="h-8 w-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-100">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};