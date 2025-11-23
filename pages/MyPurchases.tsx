import React, { useEffect, useState } from 'react';
import { raffleService } from '../services/raffleService';
import { Purchase, Raffle } from '../types';
import { Calendar, Ticket as TicketIcon } from 'lucide-react';

export const MyPurchases: React.FC = () => {
  const [purchases, setPurchases] = useState<{ purchase: Purchase, raffle: Raffle }[]>([]);
  const currentUser = raffleService.getCurrentUser();

  useEffect(() => {
    raffleService.getUserPurchases(currentUser.id).then(setPurchases);
  }, [currentUser]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Minhas Compras</h1>
      
      {purchases.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <TicketIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500">Você ainda não participou de nenhuma rifa.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map(({ purchase, raffle }) => (
            <div key={purchase.id} className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{raffle.title}</h3>
                <div className="flex items-center text-sm text-slate-500 mb-2">
                  <Calendar size={14} className="mr-1" />
                  {new Date(purchase.createdAt).toLocaleDateString('pt-BR')} às {new Date(purchase.createdAt).toLocaleTimeString('pt-BR')}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {purchase.ticketIds.map(tid => {
                    const ticketNum = tid.split('-').pop(); // extract number from id
                    const isWinner = raffle.winnerTicketId === tid;
                    return (
                        <span key={tid} className={`px-2 py-1 rounded text-xs font-mono font-bold border ${isWinner ? 'bg-yellow-100 text-yellow-800 border-yellow-300 ring-2 ring-yellow-400' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            #{ticketNum} {isWinner && '👑'}
                        </span>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <span className="block text-xs text-slate-400">Total Pago</span>
                <span className="block text-xl font-bold text-brand-600">R$ {purchase.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};