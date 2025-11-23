import React, { useEffect, useState } from 'react';
import { raffleService } from '../services/raffleService';
import { Raffle, RaffleStatus, DashboardStats } from '../types';
import { Plus, Users, DollarSign, Ticket as TicketIcon, Play, Gift, Download } from 'lucide-react';
import { useNavigation } from '../App';

export const AdminDashboard: React.FC = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [drawingId, setDrawingId] = useState<string | null>(null);
  const { navigate } = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [rData, sData] = await Promise.all([
      raffleService.getRaffles(),
      raffleService.getDashboardStats()
    ]);
    setRaffles(rData);
    setStats(sData);
  };

  const handleDraw = async (raffleId: string) => {
    if (!confirm("Tem certeza que deseja realizar o sorteio agora? Essa ação é irreversível.")) return;
    
    setDrawingId(raffleId);
    try {
      const winner = await raffleService.drawWinner(raffleId);
      alert(`Sorteio realizado! O bilhete vencedor é o número #${winner.number}`);
      loadData();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDrawingId(null);
    }
  };

  const handleExport = () => {
    const data = raffleService.getSystemBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rifamaster-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Painel Administrativo</h1>
        <div className="flex space-x-3">
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
          >
            <Download size={18} className="mr-2" /> Backup Dados
          </button>
          <button 
            onClick={() => navigate('admin-create')}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors"
          >
            <Plus size={18} className="mr-2" /> Nova Rifa
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Faturamento Total" value={`R$ ${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} color="bg-emerald-100 text-emerald-600" />
          <StatCard title="Rifas Ativas" value={stats.activeRaffles} icon={Play} color="bg-blue-100 text-blue-600" />
          <StatCard title="Bilhetes Vendidos" value={stats.ticketsSold} icon={TicketIcon} color="bg-orange-100 text-orange-600" />
          <StatCard title="Usuários" value={stats.totalUsers} icon={Users} color="bg-purple-100 text-purple-600" />
        </div>
      )}

      {/* Raffles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Gerenciar Rifas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Preço</th>
                <th className="px-6 py-3">Total Bilhetes</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {raffles.map(raffle => (
                <tr key={raffle.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{raffle.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      raffle.status === RaffleStatus.ACTIVE ? 'bg-green-100 text-green-700' : 
                      raffle.status === RaffleStatus.DRAWN ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {raffle.status === RaffleStatus.ACTIVE ? 'Ativa' : 
                       raffle.status === RaffleStatus.DRAWN ? 'Sorteada' : 'Fechada'}
                    </span>
                  </td>
                  <td className="px-6 py-4">R$ {raffle.pricePerTicket.toFixed(2)}</td>
                  <td className="px-6 py-4">{raffle.totalTickets}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {raffle.status === RaffleStatus.ACTIVE && (
                      <button 
                        onClick={() => handleDraw(raffle.id)}
                        disabled={!!drawingId}
                        className="text-brand-600 hover:text-brand-800 font-medium hover:underline disabled:opacity-50"
                      >
                        {drawingId === raffle.id ? 'Sorteando...' : 'Realizar Sorteio'}
                      </button>
                    )}
                     {raffle.status === RaffleStatus.DRAWN && (
                        <span className="text-yellow-600 flex items-center justify-end font-medium">
                            <Gift size={14} className="mr-1" /> Ganhador definido
                        </span>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
    <div className={`p-3 rounded-lg mr-4 ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);