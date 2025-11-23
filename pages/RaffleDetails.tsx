import React, { useEffect, useState, useMemo } from 'react';
import { raffleService } from '../services/raffleService';
import { Raffle, Ticket, TicketStatus, RaffleStatus } from '../types';
import { useNavigation } from '../App';
import { ChevronLeft, Check, AlertCircle, ShoppingCart } from 'lucide-react';

export const RaffleDetails: React.FC<{ raffleId: string }> = ({ raffleId }) => {
  const [raffle, setRaffle] = useState<Raffle | undefined>();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const { navigate } = useNavigation();
  const currentUser = raffleService.getCurrentUser();

  useEffect(() => {
    const loadData = async () => {
      const r = await raffleService.getRaffleById(raffleId);
      const t = await raffleService.getTicketsByRaffle(raffleId);
      setRaffle(r);
      setTickets(t);
      setLoading(false);
    };
    loadData();
  }, [raffleId]);

  const toggleTicket = (ticketId: string) => {
    const newSelected = new Set(selectedTickets);
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId);
    } else {
      newSelected.add(ticketId);
    }
    setSelectedTickets(newSelected);
  };

  const handleBuy = async () => {
    if (!raffle) return;
    setProcessing(true);
    setError(null);
    try {
      await raffleService.buyTickets(currentUser.id, raffle.id, Array.from(selectedTickets));
      setSuccessMsg("Compra realizada com sucesso! Boa sorte!");
      setSelectedTickets(new Set());
      // Reload tickets
      const t = await raffleService.getTicketsByRaffle(raffleId);
      setTickets(t);
    } catch (e: any) {
      setError(e.message || "Erro ao processar compra");
    } finally {
      setProcessing(false);
    }
  };

  const totalValue = useMemo(() => {
    return selectedTickets.size * (raffle?.pricePerTicket || 0);
  }, [selectedTickets, raffle]);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!raffle) return <div className="p-8 text-center">Rifa não encontrada</div>;

  const isActive = raffle.status === RaffleStatus.ACTIVE;
  const soldCount = tickets.filter(t => t.status === TicketStatus.SOLD).length;
  const percentage = Math.round((soldCount / raffle.totalTickets) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button onClick={() => navigate('home')} className="flex items-center text-slate-500 hover:text-slate-800 mb-6">
        <ChevronLeft size={20} /> Voltar para Rifas
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Raffle Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <img src={raffle.imageUrl} alt={raffle.title} className="w-full h-56 object-cover" />
            <div className="p-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{raffle.title}</h1>
              <p className="text-slate-600 text-sm mb-6">{raffle.description}</p>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Progresso</span>
                    <span className="font-bold text-slate-700">{percentage}% vendido</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-brand-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                   <span className="text-slate-500 text-sm">Preço por cota</span>
                   <span className="text-2xl font-bold text-brand-600">R$ {raffle.pricePerTicket.toFixed(2)}</span>
                </div>

                {raffle.status === RaffleStatus.DRAWN && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                        <p className="text-yellow-800 font-bold text-sm uppercase mb-1">Ganhador Sorteado!</p>
                        <p className="text-2xl font-mono font-bold text-yellow-900">Cota #{tickets.find(t => t.id === raffle.winnerTicketId)?.number}</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Selection Grid */}
        <div className="lg:col-span-2">
          {successMsg && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <Check className="mr-2 h-5 w-5" /> {successMsg}
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" /> {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">Escolha seus números</h3>
              <div className="flex gap-3 text-xs">
                <div className="flex items-center"><span className="w-3 h-3 bg-white border border-slate-300 rounded mr-1"></span> Livre</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-brand-500 rounded mr-1"></span> Selecionado</div>
                <div className="flex items-center"><span className="w-3 h-3 bg-slate-200 rounded mr-1"></span> Vendido</div>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[500px] overflow-y-auto p-2 ticket-grid">
              {tickets.map(ticket => {
                const isSold = ticket.status === TicketStatus.SOLD;
                const isSelected = selectedTickets.has(ticket.id);
                
                return (
                  <button
                    key={ticket.id}
                    disabled={isSold || !isActive}
                    onClick={() => toggleTicket(ticket.id)}
                    className={`
                      relative h-10 rounded text-sm font-medium transition-all
                      ${isSold 
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                        : isSelected
                          ? 'bg-brand-500 text-white shadow-md transform scale-105'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-600'
                      }
                    `}
                  >
                    {ticket.number}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Checkout Bar */}
          <div className="mt-6 bg-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-lg">
            <div className="mb-4 sm:mb-0">
               <p className="text-slate-400 text-sm">Total a pagar</p>
               <div className="text-3xl font-bold">R$ {totalValue.toFixed(2)}</div>
               <p className="text-xs text-slate-400">{selectedTickets.size} cotas selecionadas</p>
            </div>
            <button 
              disabled={selectedTickets.size === 0 || processing || !isActive}
              onClick={handleBuy}
              className={`
                px-8 py-3 rounded-lg font-bold flex items-center transition-all
                ${selectedTickets.size > 0 && isActive
                  ? 'bg-brand-500 hover:bg-brand-400 text-white shadow-lg hover:shadow-brand-500/25' 
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
              `}
            >
              {processing ? (
                  <span className="flex items-center"><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div> Processando</span>
              ) : (
                  <span className="flex items-center"><ShoppingCart className="mr-2" size={18} /> Comprar Agora</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};