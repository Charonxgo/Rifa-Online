import { Raffle, Ticket, TicketStatus, Purchase, User, RaffleStatus, DashboardStats } from '../types';
import { INITIAL_RAFFLES, MOCK_USERS } from './mockData';

const STORAGE_KEYS = {
  RAFFLES: 'rifa_raffles',
  TICKETS: 'rifa_tickets',
  PURCHASES: 'rifa_purchases',
  USERS: 'rifa_users',
  CURRENT_USER: 'rifa_current_user',
};

// Initialize Storage if empty
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.RAFFLES)) {
    localStorage.setItem(STORAGE_KEYS.RAFFLES, JSON.stringify(INITIAL_RAFFLES));
    // Generate initial tickets for these raffles
    const tickets: Ticket[] = [];
    INITIAL_RAFFLES.forEach(raffle => {
      for (let i = 1; i <= raffle.totalTickets; i++) {
        tickets.push({
          id: `${raffle.id}-ticket-${i}`,
          number: i,
          status: TicketStatus.AVAILABLE,
          raffleId: raffle.id,
        });
      }
    });
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PURCHASES)) {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify([]));
  }
  // Default login as user
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(MOCK_USERS[0]));
  }
};

initStorage();

// Helpers
const getStored = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const setStored = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const raffleService = {
  // --- User Session ---
  getCurrentUser: (): User => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || JSON.stringify(MOCK_USERS[0]));
  },
  
  switchUser: (role: 'admin' | 'user') => {
    const user = role === 'admin' ? MOCK_USERS[1] : MOCK_USERS[0];
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    window.location.reload(); // Simple reload to refresh app state
  },

  // --- Public Queries ---
  getRaffles: async (): Promise<Raffle[]> => {
    await new Promise(r => setTimeout(r, 400)); // Simulate latency
    return getStored<Raffle>(STORAGE_KEYS.RAFFLES);
  },

  getRaffleById: async (id: string): Promise<Raffle | undefined> => {
    await new Promise(r => setTimeout(r, 200));
    const raffles = getStored<Raffle>(STORAGE_KEYS.RAFFLES);
    return raffles.find(r => r.id === id);
  },

  getTicketsByRaffle: async (raffleId: string): Promise<Ticket[]> => {
    await new Promise(r => setTimeout(r, 300)); // Simulate heavy load
    const tickets = getStored<Ticket>(STORAGE_KEYS.TICKETS);
    return tickets.filter(t => t.raffleId === raffleId).sort((a, b) => a.number - b.number);
  },

  getUserPurchases: async (userId: string): Promise<{ purchase: Purchase, raffle: Raffle }[]> => {
    const purchases = getStored<Purchase>(STORAGE_KEYS.PURCHASES);
    const raffles = getStored<Raffle>(STORAGE_KEYS.RAFFLES);
    
    return purchases
      .filter(p => p.userId === userId)
      .map(p => ({
        purchase: p,
        raffle: raffles.find(r => r.id === p.raffleId)!
      }))
      .reverse();
  },

  // --- Transactions ---
  buyTickets: async (userId: string, raffleId: string, ticketIds: string[]): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800)); // Simulate processing
    
    const allTickets = getStored<Ticket>(STORAGE_KEYS.TICKETS);
    const allPurchases = getStored<Purchase>(STORAGE_KEYS.PURCHASES);
    const raffles = getStored<Raffle>(STORAGE_KEYS.RAFFLES);
    const raffle = raffles.find(r => r.id === raffleId);

    if (!raffle || raffle.status !== RaffleStatus.ACTIVE) throw new Error("Rifa inválida ou encerrada.");

    // Check availability
    const ticketsToBuy = allTickets.filter(t => ticketIds.includes(t.id));
    const unavailable = ticketsToBuy.some(t => t.status !== TicketStatus.AVAILABLE);
    
    if (unavailable) throw new Error("Alguns bilhetes selecionados não estão mais disponíveis.");

    // Create Purchase
    const newPurchase: Purchase = {
      id: `purch-${Date.now()}`,
      userId,
      raffleId,
      ticketIds,
      totalAmount: ticketIds.length * raffle.pricePerTicket,
      createdAt: new Date().toISOString()
    };

    // Update Tickets
    const updatedTickets = allTickets.map(t => {
      if (ticketIds.includes(t.id)) {
        return { ...t, status: TicketStatus.SOLD, userId, purchaseId: newPurchase.id };
      }
      return t;
    });

    setStored(STORAGE_KEYS.PURCHASES, [...allPurchases, newPurchase]);
    setStored(STORAGE_KEYS.TICKETS, updatedTickets);

    return true;
  },

  // --- Admin ---
  getDashboardStats: async (): Promise<DashboardStats> => {
    const raffles = getStored<Raffle>(STORAGE_KEYS.RAFFLES);
    const tickets = getStored<Ticket>(STORAGE_KEYS.TICKETS);
    const purchases = getStored<Purchase>(STORAGE_KEYS.PURCHASES);

    const soldTickets = tickets.filter(t => t.status === TicketStatus.SOLD).length;
    const totalRevenue = purchases.reduce((acc, p) => acc + p.totalAmount, 0);

    return {
      activeRaffles: raffles.filter(r => r.status === RaffleStatus.ACTIVE).length,
      ticketsSold: soldTickets,
      totalRevenue,
      totalUsers: 142 // Mock number
    };
  },

  createRaffle: async (data: Omit<Raffle, 'id' | 'createdAt' | 'status'>): Promise<Raffle> => {
    const raffles = getStored<Raffle>(STORAGE_KEYS.RAFFLES);
    const allTickets = getStored<Ticket>(STORAGE_KEYS.TICKETS);

    const newRaffle: Raffle = {
      ...data,
      id: `raffle-${Date.now()}`,
      status: RaffleStatus.ACTIVE,
      createdAt: new Date().toISOString(),
    };

    // Generate tickets for new raffle
    const newTickets: Ticket[] = [];
    for (let i = 1; i <= newRaffle.totalTickets; i++) {
      newTickets.push({
        id: `${newRaffle.id}-ticket-${i}`,
        number: i,
        status: TicketStatus.AVAILABLE,
        raffleId: newRaffle.id,
      });
    }

    setStored(STORAGE_KEYS.RAFFLES, [...raffles, newRaffle]);
    setStored(STORAGE_KEYS.TICKETS, [...allTickets, ...newTickets]);
    
    return newRaffle;
  },

  drawWinner: async (raffleId: string): Promise<Ticket> => {
    await new Promise(r => setTimeout(r, 2000)); // Suspense
    
    const allTickets = getStored<Ticket>(STORAGE_KEYS.TICKETS);
    const raffles = getStored<Raffle>(STORAGE_KEYS.RAFFLES);
    
    const raffleTickets = allTickets.filter(t => t.raffleId === raffleId && t.status === TicketStatus.SOLD);
    
    if (raffleTickets.length === 0) throw new Error("Nenhum bilhete vendido para realizar o sorteio.");

    const winnerIndex = Math.floor(Math.random() * raffleTickets.length);
    const winningTicket = raffleTickets[winnerIndex];

    // Update Raffle
    const updatedRaffles = raffles.map(r => {
      if (r.id === raffleId) {
        return { 
          ...r, 
          status: RaffleStatus.DRAWN, 
          winnerTicketId: winningTicket.id,
          winnerUserId: winningTicket.userId,
          drawDate: new Date().toISOString()
        };
      }
      return r;
    });

    setStored(STORAGE_KEYS.RAFFLES, updatedRaffles);
    
    return winningTicket;
  },

  // --- Backup ---
  getSystemBackup: (): Record<string, any> => {
    const backup: Record<string, any> = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      backup[key] = JSON.parse(localStorage.getItem(key) || '[]');
    });
    return backup;
  }
};